---
title: 'Top Trackers Database'
pubDate: '2026-03-28'
order: 3
viewId: 204
---

*The privacy metrics widget could tell you how many trackers were blocked, but not which ones. Adding per-origin tracking to the database fixes that.*

**Bug 2027450** | [D290707](https://phabricator.services.mozilla.com/D290707) | Reviewer: timhuang

---

## The Problem

The existing `protections.sqlite` database stores blocking events as aggregate counts per type per day. A row might say "12 trackers blocked on 2026-03-28." But it doesn't record *which* trackers. If the privacy metrics widget wants to show users the top trackers Firefox blocked for them this week (e.g., "googletagmanager.com - blocked 47 times"), there's no data to query. The origin information was discarded at write time.

I needed to add per-origin storage to the database without breaking the existing schema or the consumers that depend on it.

## Schema Migration

The events table in v1 looked like this:

```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  type INTEGER NOT NULL,
  count INTEGER NOT NULL,
  timestamp DATE
);
```

I added an `origins` column that stores a JSON map of `{origin: count}` per row:

```sql
ALTER TABLE events ADD COLUMN origins TEXT DEFAULT '{}';
```

This is a v1-to-v2 schema migration. The `SCHEMA_VERSION` constant bumps from 1 to 2, and a new `upgradeDatabase()` function handles the migration:

```javascript
async function upgradeDatabase(db, oldVersion) {
  if (oldVersion < 2) {
    await db.execute(SQL.addOriginsColumn);
  }
}
```

The migration path had been stubbed as a TODO in the original code. The `ensureDB()` function already had the version check and branching logic; it just called a placeholder. I replaced that with the real migration.

The `DEFAULT '{}'` on the column means existing rows in upgraded databases get an empty JSON object, so old data stays valid. New rows written after the upgrade populate the origins map with actual tracker domains.

## Rewriting saveEvents

The original `saveEvents()` method iterated over the blocking log one third-party domain at a time. For each domain, it identified the type, incremented the count, and moved on. The origin was used only to look up the type, then discarded.

The new version does two passes. First, it groups origins by type:

```javascript
let originsByType = {};
for (let thirdParty in log) {
  let type = this.identifyType(log[thirdParty]);
  if (type) {
    if (!originsByType[type]) {
      originsByType[type] = {};
    }
    originsByType[type][thirdParty] =
      (originsByType[type][thirdParty] || 0) + 1;
  }
}
```

Then it writes one row per type per day, merging origins into the JSON blob:

```javascript
await db.executeTransaction(async () => {
  for (let typeStr in originsByType) {
    let type = parseInt(typeStr);
    let newOrigins = originsByType[type];
    let count = Object.values(newOrigins).reduce((a, b) => a + b, 0);

    Glean.contentblocking.trackersBlockedCount.add(count);

    let today = new Date().toISOString().split("T")[0];
    let row = await db.executeCached(SQL.selectByTypeAndDate, {
      type,
      date: today,
    });
    let todayEntry = row[0];

    if (todayEntry) {
      let id = todayEntry.getResultByName("id");
      await db.executeCached(SQL.incrementEvent, { id, count });

      // Merge new origins into the existing blob.
      let existing = JSON.parse(
        todayEntry.getResultByName("origins") || "{}"
      );
      for (let origin in newOrigins) {
        existing[origin] = (existing[origin] || 0) + newOrigins[origin];
      }
      await db.executeCached(SQL.updateOrigins, {
        id,
        origins: JSON.stringify(existing),
      });
    } else {
      await db.executeCached(SQL.addEvent, { type, count, date: today });
      let inserted = await db.executeCached(SQL.selectByTypeAndDate, {
        type,
        date: today,
      });
      let id = inserted[0].getResultByName("id");
      await db.executeCached(SQL.updateOrigins, {
        id,
        origins: JSON.stringify(newOrigins),
      });
    }
  }
});
```

A few things going on here:

- **Grouping first** avoids N separate database writes per page load. Instead of one write per blocked domain, it's one write per *type* per day. A page that blocks 15 trackers, 3 fingerprinters, and 1 cryptominer produces 3 database operations, not 19.
- **Merging origins** handles the case where `saveEvents()` is called multiple times on the same day (which happens on every page navigation). If `tracker-a.example.com` was already recorded with count 2, and we see it again with count 1, the merged blob becomes `{"tracker-a.example.com": 3}`.
- **The count parameter** in `addEvent` and `incrementEvent` replaces the old hardcoded `1`. Since we're batching by type, the count for a single insert might be greater than 1.

## The getTopTrackers API

With origins stored, querying for the top-K is straightforward. The new `getTopTrackers(count, dateFrom, dateTo)` method merges origin blobs across all rows in the date range, then sorts by total count:

```javascript
async getTopTrackers(count, dateFrom, dateTo) {
  let db = await this.ensureDB();
  dateFrom = new Date(dateFrom).toISOString();
  dateTo = new Date(dateTo).toISOString();
  let rows = await db.execute(SQL.selectByDateRange, { dateFrom, dateTo });

  // Merge all origin blobs across the date range into a single map.
  let merged = {};
  for (let row of rows) {
    let origins = JSON.parse(row.getResultByName("origins") || "{}");
    for (let origin in origins) {
      merged[origin] = (merged[origin] || 0) + origins[origin];
    }
  }

  // Sort by count descending and take top K.
  return Object.entries(merged)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([origin, total]) => ({ origin, total }));
},
```

The merging happens in JavaScript rather than SQL because the origins are stored as JSON text. SQLite can parse JSON with `json_each()`, but the Mozilla build's SQLite configuration doesn't guarantee that extension is available everywhere. Doing the merge in JS is safer and the data volume is small (at most 7 rows per type for a week-long query).

I also added the IDL definition so the method is callable through XPCOM:

```
Promise getTopTrackers(in unsigned long count, in int64_t dateFrom, in int64_t dateTo);
```

This resolves to an array of `{origin, total}` objects sorted by total descending. The privacy metrics component can call it the same way it calls `getEventsByDateRange`: through the `nsITrackingDBService` interface via a lazy service getter.

## Testing

Three new xpcshell test cases covering the origin storage path:

1. **`test_origins_saved`** verifies that after `saveEvents()`, the origins column contains the expected JSON map with correct per-origin counts. Checks both tracker and fingerprinter types against the existing test fixture (`LOG`).

2. **`test_origins_merge`** calls `saveEvents()` twice with overlapping origins and verifies the counts merge correctly. `tracker-a.example.com` appears in both calls and should accumulate to count 2. `tracker-b.example.com` appears only in the second call with count 1. The total row count should be 3.

3. **`test_getTopTrackers`** saves the same log three times to build up counts, then calls `getTopTrackers()` and verifies the results come back sorted by total descending. Also tests the `count` limit parameter.

The total changeset was 3 files changed with ~260 new lines.

## What I Learned

**Schema migrations in Firefox are conservative by design.** `ALTER TABLE ADD COLUMN` with a default value is one of the safest SQLite operations: it doesn't rewrite the table, existing rows get the default automatically, and it can't fail on a well-formed database. More invasive migrations (renaming columns, changing types) would require creating a new table and copying data, which is risky on a database that lives in the user's profile and can't be recreated if something goes wrong.

**Batching writes by type instead of by origin was a meaningful optimization.** The original code did one database round-trip per blocked domain per page load. On a page that blocks 20 trackers, that's 20 INSERT-or-UPDATE operations inside a transaction. The new code groups by type first, so the same page produces at most 6 operations (one per ETP category). The JSON blob absorbs the per-origin detail without per-origin writes.

**Storing structured data as JSON in SQLite is a pragmatic tradeoff.** A normalized design would have a separate `origins` table with foreign keys. But that would require a more complex migration, more complex queries, and more complex merge logic, all for a column that only the top-K query reads. The JSON blob keeps the schema simple and the merge logic self-contained. The downside is that you can't query individual origins with SQL, but the only consumer (`getTopTrackers`) needs the full blob anyway.
