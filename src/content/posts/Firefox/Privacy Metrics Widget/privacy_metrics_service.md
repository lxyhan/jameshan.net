---
title: 'Privacy Metrics Service'
pubDate: '2026-03-19'
order: 1
---

*Firefox blocks thousands of trackers every week, but users had no way to see the numbers.*

**Bug 2010368** | [D279464](https://phabricator.services.mozilla.com/D279464) | Reviewer: emz

---

## The Problem

Firefox's Enhanced Tracking Protection is quietly doing a lot of work in the background. It blocks trackers, fingerprinters, cryptominers, tracking cookies, and social media trackers on nearly every page you visit. But all of that activity was invisible. The `about:protections` page existed as a dashboard for privacy stats, but it needed a proper backend service to surface real-time, aggregated data about what Firefox had actually blocked for you over the past week.

My job was to build that service layer: something that could pull raw blocking events out of storage, aggregate them by category, and hand them to the frontend through Firefox's IPC system.

## Architecture

To understand the design, you need to know a bit about how Firefox works internally. Firefox runs in multiple processes. The "parent" process handles privileged operations (file I/O, database access, system calls), and "content" processes render web pages. The `about:protections` page runs in a content process, which means it can't just reach into SQLite directly. It has to ask the parent process for data.

The data flow looks like this:

1. **TrackingDBService** (C++ XPCOM service) stores blocking events in a SQLite database as they happen during browsing.
2. **PrivacyMetricsService** (my new JS module) wraps TrackingDBService, queries it for a date range, and aggregates the raw rows into a clean stats object.
3. **AboutProtectionsParent** (the IPC parent actor) receives messages from the content process via `RPMSendQuery`, delegates to PrivacyMetricsService, and sends back the result.

Each layer has a single responsibility. TrackingDBService owns storage. PrivacyMetricsService owns aggregation logic. AboutProtectionsParent owns the IPC boundary.

## The Service

Here's the full `PrivacyMetricsService.sys.mjs`, coming in at 101 lines:

```javascript
import { XPCOMUtils } from "resource://gre/modules/XPCOMUtils.sys.mjs";

const lazy = {};

XPCOMUtils.defineLazyServiceGetter(
  lazy,
  "TrackingDBService",
  "@mozilla.org/tracking-db-service;1",
  Ci.nsITrackingDBService
);

export const PrivacyMetricsService = {
  async getWeeklyStats() {
    const todayInMs = Date.now();
    const weekAgoInMs = todayInMs - 7 * 24 * 60 * 60 * 1000;

    const eventRows = await lazy.TrackingDBService.getEventsByDateRange(
      weekAgoInMs,
      todayInMs
    );

    return this._aggregateStats(eventRows);
  },

  _aggregateStats(eventRows) {
    let trackers = 0;
    let cookies = 0;
    let fingerprinters = 0;
    let cryptominers = 0;
    let socialTrackers = 0;

    for (let row of eventRows) {
      const count = row.getResultByName("count");
      const type = row.getResultByName("type");

      switch (type) {
        case Ci.nsITrackingDBService.TRACKERS_ID:
          trackers += count;
          break;
        case Ci.nsITrackingDBService.TRACKING_COOKIES_ID:
          cookies += count;
          break;
        case Ci.nsITrackingDBService.FINGERPRINTERS_ID:
        case Ci.nsITrackingDBService.SUSPICIOUS_FINGERPRINTERS_ID:
          fingerprinters += count;
          break;
        case Ci.nsITrackingDBService.CRYPTOMINERS_ID:
          cryptominers += count;
          break;
        case Ci.nsITrackingDBService.SOCIAL_ID:
          socialTrackers += count;
          break;
      }
    }

    const total =
      trackers + cookies + cryptominers + fingerprinters + socialTrackers;

    return {
      total, trackers, cookies, fingerprinters, cryptominers, socialTrackers,
      lastUpdated: Date.now(),
    };
  },
};
```

A few things worth calling out:

- **Lazy service getter.** `XPCOMUtils.defineLazyServiceGetter` defers the cost of instantiating TrackingDBService until the first time someone actually calls `getWeeklyStats()`. This is standard practice in Firefox's codebase to keep startup fast, since modules get imported eagerly but services should not spin up until needed.
- **`getWeeklyStats()`** computes the date range (now minus 7 days) and hands it off to TrackingDBService's `getEventsByDateRange`, which runs a SQL query under the hood. The result comes back as mozIStorageRow objects.
- **`_aggregateStats()`** iterates the rows and buckets them by type constant. Fingerprinters have two sub-types (`FINGERPRINTERS_ID` and `SUSPICIOUS_FINGERPRINTERS_ID`) that get merged into one count. The return object is a flat, typed structure that the frontend can consume directly.

## IPC Integration

The `about:protections` page sends an `RPMSendQuery("FetchPrivacyMetrics")` message from the content process. That gets handled in `AboutProtectionsParent.sys.mjs`:

```javascript
// Added import:
PrivacyMetricsService:
  "moz-src:///browser/components/protections/PrivacyMetricsService.sys.mjs",

// Added message handler:
case "FetchPrivacyMetrics":
  if (lazy.PrivateBrowsingUtils.isWindowPrivate(win)) {
    return null;
  }
  return lazy.PrivacyMetricsService.getWeeklyStats();
```

The private browsing check is important. If the user is in a private window, we return `null` instead of stats. Private browsing shouldn't expose any historical data, even aggregate counts, because showing "you blocked 47 trackers this week" in a private window would leak information about non-private browsing activity.

I also had to update `RemotePageAccessManager.sys.mjs` to whitelist the new `FetchPrivacyMetrics` message. Without that, the RPM framework would silently drop the query from the content process.

## Testing

The patch includes 220 lines of xpcshell tests and 183 lines of browser tests.

The xpcshell tests exercise the service in isolation: they mock TrackingDBService, feed in synthetic rows, and verify that aggregation works correctly for each category, edge cases (empty data, unknown types), and the date math. The browser tests verify the full IPC round-trip by loading `about:protections` in an actual browser window and confirming that the message handler returns the expected shape.

The total changeset was 8 files and 521 new lines, with most of the weight in tests. That ratio (roughly 2:1 test code to production code) felt right for a service that downstream UI components would depend on.

## What I Learned

**XPCOM is weird but powerful.** The lazy service getter pattern was new to me. It's a very Firefox-specific way of doing dependency injection: you declare what interface you need, and the framework resolves it at call time. Once I understood the pattern, I started seeing it everywhere in the codebase.

**IPC boundaries force good design.** Having to serialize data across process boundaries meant I couldn't just pass around rich objects or database cursors. The stats object had to be a plain, JSON-serializable structure. That constraint made the API cleaner than it would have been otherwise.

**Private browsing has subtle implications.** I initially didn't think about the private window case. My reviewer (emz) flagged it. It's a good example of how privacy engineering goes beyond "don't track things." You also have to think about what existing data you might inadvertently surface in a context where the user expects isolation.
