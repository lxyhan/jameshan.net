---
title: 'VI. Privacy Metrics - Implementation'
pubDate: '2025-12-31'
---

*Building the data pipeline: from SQLite queries to Redux state, following Firefox's Activity Stream architecture.*

**Bug TBD** | Design Document

---

## Architecture Overview

The New Tab page uses a parent-content process split. Data flows from SQLite through a Feed in the parent process, then syncs to Redux in the content process:

```
┌────────────────────────────────────────────────────────────────┐
│                        PARENT PROCESS                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  TrackingDBService ──────► PrivacyMetricsFeed                  │
│  (SQLite queries)          (aggregates, caches)                │
│                                   │                            │
│                                   │ dispatch(PRIVACY_METRICS_  │
│                                   │          UPDATE)           │
│                                   ▼                            │
│                            ActivityStream                      │
│                            (Redux store)                       │
│                                   │                            │
└───────────────────────────────────┼────────────────────────────┘
                                    │ IPC (state sync)
┌───────────────────────────────────┼────────────────────────────┐
│                        CONTENT PROCESS                         │
├───────────────────────────────────┼────────────────────────────┤
│                                   ▼                            │
│                            Redux Store                         │
│                     state.PrivacyMetrics                       │
│                                   │                            │
│                                   ▼                            │
│                      <PrivacyMetrics /> Component              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Redux State Shape

```javascript
PrivacyMetrics: {
  // Loading state
  initialized: false,

  // Core data
  weeklyCount: 0,
  byType: {
    trackers: 0,
    trackingCookies: 0,
    fingerprinters: 0,
    cryptominers: 0,
    social: 0,
  },

  // Memory metric (estimated)
  memorySavedBytes: 0,

  // For trend calculation (stretch)
  previousWeekCount: 0,

  // For "protecting you since X"
  earliestDate: null,

  // ETP status
  etpEnabled: true,

  // Cache timestamp
  lastUpdated: null,
}
```

---

## Actions

**File**: `browser/extensions/newtab/common/Actions.mjs`

```javascript
// Add to action types
"PRIVACY_METRICS_UPDATE",
"PRIVACY_METRICS_REQUEST",  // optional: for manual refresh
```

---

## Reducer

**File**: `browser/extensions/newtab/common/Reducers.sys.mjs`

```javascript
function PrivacyMetrics(prevState = INITIAL_STATE.PrivacyMetrics, action) {
  switch (action.type) {
    case at.PRIVACY_METRICS_UPDATE:
      return { ...prevState, ...action.data, initialized: true };
    default:
      return prevState;
  }
}
```

---

## The Feed

**File**: `browser/extensions/newtab/lib/PrivacyMetricsFeed.sys.mjs`

The Feed is the core logic layer. It queries TrackingDBService, aggregates results, and dispatches to Redux.

```javascript
import { actionTypes as at, actionCreators as ac } from "resource://newtab/common/Actions.mjs";

const TRACKING_DB_CONTRACT = "@mozilla.org/tracking-db-service;1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;

const BYTES_PER_TYPE = {
  1: 50000,   // Trackers
  2: 5000,    // Tracking cookies
  3: 200000,  // Cryptominers
  4: 30000,   // Fingerprinters
  5: 40000,   // Social
};

export class PrivacyMetricsFeed {
  constructor() {
    this._trackingDBService = null;
    this._cachedData = null;
    this._cacheExpiry = 0;
  }

  get trackingDBService() {
    if (!this._trackingDBService) {
      this._trackingDBService = Cc[TRACKING_DB_CONTRACT].getService(
        Ci.nsITrackingDBService
      );
    }
    return this._trackingDBService;
  }

  get isEnabled() {
    return this.store.getState().Prefs.values["privacyMetrics.enabled"];
  }

  get isETPEnabled() {
    return Services.prefs.getBoolPref(
      "privacy.trackingprotection.enabled",
      false
    );
  }

  async fetchData() {
    const now = Date.now();
    const weekAgo = now - ONE_WEEK_MS;
    const twoWeeksAgo = now - (2 * ONE_WEEK_MS);

    try {
      const thisWeekEvents = await this.trackingDBService.getEventsByDateRange(
        weekAgo, now
      );
      const prevWeekEvents = await this.trackingDBService.getEventsByDateRange(
        twoWeeksAgo, weekAgo
      );
      const earliestDate = await this.trackingDBService.getEarliestRecordedDate();

      return { thisWeekEvents, prevWeekEvents, earliestDate };
    } catch (e) {
      console.error("PrivacyMetricsFeed: Error fetching data", e);
      return null;
    }
  }

  aggregateEvents(events) {
    const byType = {
      trackers: 0,
      trackingCookies: 0,
      fingerprinters: 0,
      cryptominers: 0,
      social: 0,
    };

    let totalCount = 0;
    let memorySavedBytes = 0;

    const TYPE_MAP = {
      1: "trackers",
      2: "trackingCookies",
      3: "cryptominers",
      4: "fingerprinters",
      5: "social",
    };

    for (const event of events) {
      const type = event.getResultByName("type");
      const count = event.getResultByName("count");
      const key = TYPE_MAP[type];

      if (key) {
        byType[key] += count;
        totalCount += count;
        memorySavedBytes += count * (BYTES_PER_TYPE[type] || 10000);
      }
    }

    return { byType, totalCount, memorySavedBytes };
  }

  async update() {
    if (!this.isEnabled) return;

    // Check cache (5 minute expiry)
    const now = Date.now();
    if (this._cachedData && now < this._cacheExpiry) {
      this.store.dispatch(ac.BroadcastToContent({
        type: at.PRIVACY_METRICS_UPDATE,
        data: this._cachedData,
      }));
      return;
    }

    const rawData = await this.fetchData();
    if (!rawData) return;

    const thisWeek = this.aggregateEvents(rawData.thisWeekEvents);
    const prevWeek = this.aggregateEvents(rawData.prevWeekEvents);

    const data = {
      weeklyCount: thisWeek.totalCount,
      byType: thisWeek.byType,
      memorySavedBytes: thisWeek.memorySavedBytes,
      previousWeekCount: prevWeek.totalCount,
      earliestDate: rawData.earliestDate,
      etpEnabled: this.isETPEnabled,
      lastUpdated: now,
    };

    // Cache for 5 minutes
    this._cachedData = data;
    this._cacheExpiry = now + (5 * 60 * 1000);

    this.store.dispatch(ac.BroadcastToContent({
      type: at.PRIVACY_METRICS_UPDATE,
      data,
    }));
  }

  onAction(action) {
    switch (action.type) {
      case at.INIT:
        this.update();
        break;
      case at.PRIVACY_METRICS_REQUEST:
        this.update();
        break;
      case at.UNINIT:
        this._cachedData = null;
        break;
    }
  }
}
```

---

## Registration

**File**: `browser/extensions/newtab/lib/ActivityStream.sys.mjs`

```javascript
// Add lazy getter
ChromeUtils.defineLazyGetter(lazy, "PrivacyMetricsFeed", () => {
  const { PrivacyMetricsFeed } = ChromeUtils.importESModule(
    "resource://newtab/lib/PrivacyMetricsFeed.sys.mjs"
  );
  return PrivacyMetricsFeed;
});

// Add to FEEDS_DATA
{
  name: "privacymetrics",
  factory: () => new lazy.PrivacyMetricsFeed(),
  title: "Privacy Metrics",
  value: true,
},
```

---

## Preferences

```javascript
// ActivityStream.sys.mjs - PREFS_CONFIG
["privacyMetrics.enabled", { defaultValue: true }],

// all.js
pref("browser.newtabpage.activity-stream.privacyMetrics.enabled", true);
```

---

## What I Learned

1. **Feeds Are the Data Layer** — They handle async fetching, caching, and dispatching to Redux
2. **Parent-Content Split Matters** — Heavy lifting (DB queries) happens in parent process, UI renders in content process
3. **Caching is Essential** — New tabs open frequently; 5-minute cache prevents DB spam
4. **Action Creators Handle IPC** — `ac.BroadcastToContent` automatically syncs state across processes
