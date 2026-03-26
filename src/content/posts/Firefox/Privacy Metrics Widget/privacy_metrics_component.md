---
title: 'Privacy Metrics Component'
pubDate: '2026-03-19'
order: 2
viewId: 79
---

*The service layer was done. Now I needed something users could actually see.*

**Bug 2010369** | [D279564](https://phabricator.services.mozilla.com/D279564) | Reviewers: emz, fluent-reviewers, desktop-theme-reviewers, flod, jules

---

## The Problem

With the `PrivacyMetricsService` landing in the [previous patch](/firefox/privacy-metrics-widget/privacy_metrics_service), I had a backend that could aggregate tracking protection stats from TrackingDBService. But `about:protections` (the page users see when they click "Protections Dashboard" in Firefox) had no way to display any of it. I needed a UI component that could fetch the stats, handle edge cases gracefully, and present the data in a way that felt native to the existing page.

## The Component

I built `privacy-metrics-card.mjs`, a 198-line Lit web component using Mozilla's `MozLitElement` base class. This is the standard pattern for new privileged UI in Firefox: you get reactive properties, shadow DOM, and lifecycle hooks, but within the `chrome://` context so you can talk to privileged APIs.

The component's properties use `reflect: true` so that values are mirrored as HTML attributes. This matters for testing, since browser tests can query attribute values directly without reaching into component internals:

```javascript
export class PrivacyMetricsCard extends MozLitElement {
  static properties = {
    total: { type: Number, reflect: true },
    trackers: { type: Number, reflect: true },
    fingerprinters: { type: Number, reflect: true },
    cookies: { type: Number, reflect: true },
    socialTrackers: { type: Number, reflect: true },
    _loading: { type: Boolean, state: true },
    _error: { type: Boolean, state: true },
    _isPrivate: { type: Boolean, state: true },
  };
```

When the component mounts, `connectedCallback` kicks off a fetch via `RPMSendQuery`, which is how unprivileged `about:` pages talk to the parent process in Firefox. The response drives a state machine with five possible states: loading, error, private browsing, empty (zero threats blocked), and the normal stats view. Private browsing gets its own state because we intentionally don't collect or display metrics in that context.

```javascript
async #fetchStats() {
  this._loading = true;
  this._error = false;
  try {
    const stats = await RPMSendQuery("FetchPrivacyMetrics");
    if (!this.isConnected) return;
    if (stats?.isPrivate) { this._isPrivate = true; return; }
    if (!stats) { this._error = true; return; }
    this.total = stats.total;
    this.trackers = stats.trackers;
    this.fingerprinters = stats.fingerprinters;
    this.cookies = stats.cookies;
    this.socialTrackers = stats.socialTrackers;
  } catch (e) {
    console.error("PrivacyMetricsCard: Failed to fetch stats", e);
    this._error = true;
  } finally {
    this._loading = false;
  }
}
```

The `if (!this.isConnected) return` guard is a subtle but important detail. If the user navigates away before the async fetch resolves, we bail out instead of updating a detached component. Without this, you get stale renders and potential errors in the console.

## Rendering

The rendering logic sorts categories by count (descending) so the most-blocked category always appears first. This gives users an immediate sense of what Firefox is doing for them. Each category maps to an icon already in Firefox's skin directory, so the visual language stays consistent with the rest of the browser:

```javascript
#renderCategories() {
  const sorted = [...CATEGORIES].sort((a, b) => this[b.prop] - this[a.prop]);
  const categoryElements = sorted.map(cat => {
    const count = this[cat.prop];
    return html`
      <div class="category-row" data-type=${cat.key}>
        <img class="category-icon ${cat.key}" src=${cat.icon} />
        <span class="category-label"
          data-l10n-id=${cat.l10nId}
          data-l10n-args=${JSON.stringify({ count })}
        ></span>
      </div>
    `;
  });
  return html`<div class="categories">${categoryElements}</div>`;
}
```

The `CATEGORIES` array at the top of the file defines four tracking categories (trackers, fingerprinters, cookies, social trackers), each with a key, a property name, an icon path, and a Fluent localization ID. Adding a new category in the future is just one more object in the array.

## Localization

This patch added 42 new Fluent strings to `protections.ftl`. Firefox ships in nearly 100 locales, so every user-visible string needs to go through Fluent, Mozilla's localization system. Pluralization was the interesting part here, since different languages have wildly different plural rules. Fluent handles this with selector syntax:

```ftl
privacy-metrics-trackers = { $count ->
    [one] { $count } tracker
   *[other] { $count } trackers
}
privacy-metrics-blocked-this-week = { $count ->
    [one] { $count } threat blocked this week
   *[other] { $count } threats blocked this week
}
```

On the component side, I pass counts via `data-l10n-args` as JSON. Fluent picks the correct plural form for whatever locale the user is running. I also added strings for every edge state (loading, error, private window, empty) so that nothing renders as raw English in a non-English build.

## Pref Gating

The entire feature is gated behind a preference:

```javascript
pref("browser.contentblocking.report.privacy_metrics.enabled", false);
#ifdef NIGHTLY_BUILD
  pref("browser.contentblocking.report.privacy_metrics.enabled", true);
#endif
```

This means the component only appears on Nightly by default. Other channels (Beta, Release) keep it disabled until the feature is validated. The C preprocessor directive (`#ifdef NIGHTLY_BUILD`) is how Firefox handles channel-specific defaults at build time. On the front-end side, `protections.mjs` checks this pref before injecting the `<privacy-metrics-card>` element into the page, so there's zero overhead on channels where it's off.

## What I Learned

**State machines make UI predictable.** Having explicit states (loading, error, private, empty, stats) instead of ad-hoc boolean combinations eliminated an entire class of bugs where the component could end up in an ambiguous visual state. My reviewer caught an early version where the error and loading states could overlap, and the explicit state machine fixed that cleanly.

**`reflect: true` is a testing strategy, not just a convenience.** Reflecting properties as attributes made browser tests dramatically simpler. Instead of reaching into shadow DOM or mocking component internals, tests could just assert on attribute values. This was a pattern I picked up from reviewing other `MozLitElement` components in the codebase.

**Localization shapes your architecture.** Designing for Fluent from the start meant the component's data flow was cleaner than it would have been otherwise. Every piece of text is driven by structured data (category objects with l10n IDs, count arguments), which made the rendering logic more declarative and the component easier to reason about.
