---
title: 'V. Privacy Metrics - Design & Data Foundation'
pubDate: '2025-12-31'
---

*Designing a New Tab widget that surfaces Firefox's privacy protection stats to users, making invisible protection visible.*

**Bug TBD** | Design Document

---

## The Vision

Firefox's Enhanced Tracking Protection (ETP) quietly blocks thousands of trackers, fingerprinters, and cryptominers as users browse. But this protection is invisible—users have no idea how much Firefox is doing for them.

The goal: create a New Tab widget that shows **"X threats blocked this week"** with category breakdowns, memory saved estimates, and a link to the full protection report.

### Core Features

- "X threats blocked this week" with category breakdown
- Memory saved metric (estimated)
- Empty state for new users
- Warning when ETP is disabled
- Link to full report (`about:protections`)

### Stretch Features

- Trend indicator ("12% fewer than last week")
- Privacy Score via statistical inference

---

## Existing Infrastructure

Firefox already tracks blocking events. The key service is `TrackingDBService`:

**Location**: `toolkit/components/antitracking/TrackingDBService.sys.mjs`

**Storage**: SQLite database at `{profile}/protections.sqlite`

**Schema**:
```sql
events(id, type, count, timestamp)
```

**Type Codes**:
| Code | Category |
|------|----------|
| 1 | Trackers |
| 2 | Tracking Cookies |
| 3 | Cryptominers |
| 4 | Fingerprinters |
| 5 | Social |
| 6 | Suspicious Fingerprinters |
| 7 | Bounce Trackers |

Events are already aggregated by day (one row per type per day), which makes querying efficient.

---

## Available API

From `nsITrackingDBService.idl`:

```javascript
Promise getEventsByDateRange(int64_t dateFrom, int64_t dateTo);
Promise sumAllEvents();
Promise getEarliestRecordedDate();
Promise clearAll();
Promise clearSince(int64_t date);
```

For the widget, we primarily need:
- `getEventsByDateRange()` — fetch last 7 days for weekly count
- `getEarliestRecordedDate()` — for "protecting you since X" messaging

---

## The Missing Piece: Memory Saved

Currently, Firefox does not track blocked resource sizes. The blocking happens in `ContentBlockingLog.cpp` but only records event type, not bytes.

### Options Analysis

| Approach | Effort | Accuracy |
|----------|--------|----------|
| **A. Estimate from count** (avg tracker = 50KB) | Low | Low |
| **B. Add byte tracking** to ContentBlockingLog + TrackingDBService | High | High |
| **C. Skip memory metric** for v1 | None | N/A |

### Recommendation

Start with **Option A** (estimation) for v1. Use industry averages based on research:

```javascript
const BYTES_PER_TYPE = {
  1: 50000,   // Trackers: ~50KB
  2: 5000,    // Tracking cookies: ~5KB
  3: 200000,  // Cryptominers: ~200KB
  4: 30000,   // Fingerprinters: ~30KB
  5: 40000,   // Social: ~40KB
};
```

This provides a reasonable estimate while keeping the implementation simple. We can refine with real data or implement Option B as a stretch goal.

---

## What I Learned

1. **Firefox Already Has the Data** — TrackingDBService provides everything we need for the core feature
2. **Aggregation is Key** — Events are stored per-day, making weekly queries efficient
3. **Estimation vs. Accuracy Trade-off** — Sometimes a rough estimate provides user value without the engineering cost of perfect accuracy
4. **Build on Existing Patterns** — The `about:protections` page already uses this same data source
