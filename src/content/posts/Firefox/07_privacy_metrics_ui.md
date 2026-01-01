---
title: 'VII. Privacy Metrics - UI & Testing'
pubDate: '2025-12-31'
---

*Building the React component, adding localization, and testing the privacy metrics widget.*

**Bug TBD** | Design Document

---

## React Component

**Directory**: `browser/extensions/newtab/content-src/components/PrivacyMetrics/`

The component handles four states: loading, ETP disabled, empty (no data), and stats display.

```jsx
import React from "react";
import { connect } from "react-redux";
import { actionCreators as ac } from "resource://newtab/common/Actions.mjs";

export class _PrivacyMetrics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onViewReport = this.onViewReport.bind(this);
    this.onEnableETP = this.onEnableETP.bind(this);
  }

  onViewReport() {
    this.props.dispatch(ac.OnlyToMain({
      type: "OPEN_LINK",
      data: { url: "about:protections" },
    }));
  }

  onEnableETP() {
    this.props.dispatch(ac.OnlyToMain({
      type: "OPEN_LINK",
      data: { url: "about:preferences#privacy" },
    }));
  }

  formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  renderLoading() {
    return (
      <div className="privacy-metrics placeholder">
        <div className="placeholder-text" />
      </div>
    );
  }

  renderEmpty() {
    return (
      <div className="privacy-metrics empty-state">
        <h3 data-l10n-id="newtab-privacy-metrics-empty-title" />
        <p data-l10n-id="newtab-privacy-metrics-empty-description" />
      </div>
    );
  }

  renderETPDisabled() {
    return (
      <div className="privacy-metrics etp-disabled">
        <h3 data-l10n-id="newtab-privacy-metrics-etp-disabled-title" />
        <p data-l10n-id="newtab-privacy-metrics-etp-disabled-description" />
        <button
          onClick={this.onEnableETP}
          data-l10n-id="newtab-privacy-metrics-enable-protection"
        />
      </div>
    );
  }

  renderStats() {
    const { weeklyCount, byType, memorySavedBytes } = this.props.PrivacyMetrics;

    return (
      <div className="privacy-metrics">
        <div className="header">
          <h3 data-l10n-id="newtab-privacy-metrics-title" />
        </div>

        <div className="main-stat">
          <span className="count">{weeklyCount.toLocaleString()}</span>
          <span data-l10n-id="newtab-privacy-metrics-threats-blocked-week" />
        </div>

        <div className="breakdown">
          {byType.trackers > 0 && (
            <div className="type-row">
              <span data-l10n-id="newtab-privacy-metrics-trackers" />
              <span>{byType.trackers}</span>
            </div>
          )}
          {byType.fingerprinters > 0 && (
            <div className="type-row">
              <span data-l10n-id="newtab-privacy-metrics-fingerprinters" />
              <span>{byType.fingerprinters}</span>
            </div>
          )}
          {/* ... other types ... */}
        </div>

        {memorySavedBytes > 0 && (
          <div className="memory-saved">
            <span
              data-l10n-id="newtab-privacy-metrics-memory-saved"
              data-l10n-args={JSON.stringify({ size: this.formatBytes(memorySavedBytes) })}
            />
          </div>
        )}

        <button className="view-report" onClick={this.onViewReport}>
          <span data-l10n-id="newtab-privacy-metrics-view-report" />
        </button>
      </div>
    );
  }

  render() {
    const { initialized, etpEnabled, weeklyCount } = this.props.PrivacyMetrics;

    if (!initialized) return this.renderLoading();
    if (!etpEnabled) return this.renderETPDisabled();
    if (weeklyCount === 0) return this.renderEmpty();
    return this.renderStats();
  }
}

export const PrivacyMetrics = connect(state => ({
  PrivacyMetrics: state.PrivacyMetrics,
}))(_PrivacyMetrics);
```

---

## Localization

**File**: `browser/locales/en-US/browser/newtab/newtab.ftl`

```ftl
## Privacy Metrics

newtab-privacy-metrics-title = Your Privacy Protection
newtab-privacy-metrics-threats-blocked-week = threats blocked this week
newtab-privacy-metrics-trackers = Trackers
newtab-privacy-metrics-fingerprinters = Fingerprinters
newtab-privacy-metrics-cookies = Tracking cookies
newtab-privacy-metrics-cryptominers = Cryptominers
newtab-privacy-metrics-social = Social trackers
newtab-privacy-metrics-memory-saved = { $size } saved
newtab-privacy-metrics-view-report = View full report

newtab-privacy-metrics-empty-title = No threats blocked yet
newtab-privacy-metrics-empty-description = Firefox is ready to protect you as you browse.

newtab-privacy-metrics-etp-disabled-title = Protection is off
newtab-privacy-metrics-etp-disabled-description = Enhanced Tracking Protection is disabled.
newtab-privacy-metrics-enable-protection = Turn on protection
```

---

## Telemetry

Using Glean for privacy-respecting metrics:

```yaml
privacy_metrics:
  impression:
    type: event
    description: User viewed the privacy metrics widget

  click:
    type: event
    description: User clicked on the privacy metrics widget
    extra_keys:
      action:
        type: string
        description: What was clicked (view_report, enable_etp)
```

Fire `impression` on component mount, `click` in event handlers.

---

## Testing

### XPCShell Test

**File**: `browser/extensions/newtab/test/xpcshell/test_PrivacyMetricsFeed.js`

```javascript
"use strict";

const { PrivacyMetricsFeed } = ChromeUtils.importESModule(
  "resource://newtab/lib/PrivacyMetricsFeed.sys.mjs"
);

add_task(async function test_aggregateEvents() {
  const feed = new PrivacyMetricsFeed();
  // Mock events, test aggregation logic
});

add_task(async function test_caching() {
  // Test that data is cached for 5 minutes
});
```

### Browser Test

**File**: `browser/extensions/newtab/test/browser/browser_privacy_metrics.js`

```javascript
add_task(async function test_widget_renders() {
  await BrowserTestUtils.withNewTab("about:newtab", async browser => {
    // Check widget appears
    // Check click handlers work
  });
});
```

---

## Performance Considerations

| Concern | Mitigation |
|---------|------------|
| DB query on every new tab | 5-minute cache in Feed |
| Large event history | Query only last 2 weeks |
| Widget blocking render | Async load, show placeholder |

---

## Stretch Features

### Trend Indicator

Already have `previousWeekCount` in state:

```jsx
renderTrend() {
  const { weeklyCount, previousWeekCount } = this.props.PrivacyMetrics;
  if (previousWeekCount === 0) return null;

  const diff = weeklyCount - previousWeekCount;
  const percent = Math.round((diff / previousWeekCount) * 100);

  return (
    <div className={`trend ${diff < 0 ? 'down' : 'up'}`}>
      {percent}% {diff < 0 ? 'fewer' : 'more'} than last week
    </div>
  );
}
```

### Privacy Score

Would require:
1. Define scoring algorithm (weighted factors)
2. Factors: ETP enabled, blocking counts, cookie settings, HTTPS-only mode
3. Normalize to 0-100 scale

**Concern**: Could be misleading. Users might not understand what the score means. Defer until core features are validated.

---

## Open Questions

1. **Memory metric accuracy** — Is estimation acceptable, or must we track real bytes?
2. **Widget placement** — Where exactly on new tab? Above/below existing content?
3. **Private browsing** — Hide completely? Show different message?
4. **Refresh behavior** — Update live while tab is open, or only on load?

---

## File Summary

| File | Action |
|------|--------|
| `common/Actions.mjs` | Add action types |
| `common/Reducers.sys.mjs` | Add state + reducer |
| `lib/PrivacyMetricsFeed.sys.mjs` | Create (new file) |
| `lib/ActivityStream.sys.mjs` | Register feed |
| `content-src/components/PrivacyMetrics/` | Create (new dir) |
| `content-src/components/Base/Base.jsx` | Import component |
| `browser/locales/en-US/browser/newtab/newtab.ftl` | Add strings |

---

## What I Learned

1. **State-Driven Rendering** — Four distinct states (loading, disabled, empty, data) each get their own render path
2. **Fluent for i18n** — Firefox uses Fluent (`.ftl` files) with `data-l10n-id` attributes
3. **Telemetry is Non-Negotiable** — Every new feature needs impression and interaction metrics
4. **Open Questions are Good** — Documenting uncertainties helps drive design discussions
