---
title: 'Problem and Target Variables'
pubDate: '2026-03-27'
order: 1
viewId: 197
---

*Firefox knows which domains are trackers. It doesn't know which ones are expensive, or how they're expensive.*

---

## The Problem

Firefox's Enhanced Tracking Protection blocks trackers using the Disconnect list, which categorizes domains by privacy function: Advertising, Analytics, Social, Fingerprinting, Cryptomining. These categories tell you what a tracker *does* to your privacy, but they say nothing about what it *costs* your page load. A 1x1 tracking pixel and a 500KB render-blocking ad script are both "Advertising."

That distinction matters. The privacy metrics card on `about:protections` currently shows users how many trackers Firefox blocked, broken down by category. But "47 trackers blocked this week" is a flat number. It treats a tracking pixel from `bat.bing.com` (near-zero cost) the same as a render-blocking tag manager from `googletagmanager.com` (potentially hundreds of milliseconds of main-thread blocking time). If I could score each tracker by its likely performance cost, the card could show something much more specific: "Firefox prevented 420ms of render delay and 890ms of background CPU cost this week."

The goal was to build a multi-target regression model that scores tracker domains along three independent performance cost axes, enabling Firefox to surface specific, actionable information on the privacy dashboard.

## Why Three Targets, Not One

My first design used a single composite score: one float in [0.0, 1.0] representing overall performance cost. It worked, but it was lossy. Consider these two domains:

| Domain | `main_thread_cost` | `render_delay` | `network_cost` | Composite (if averaged) |
|---|---|---|---|---|
| `cdn.cookielaw.org` | 0.15 | 0.92 | 0.10 | 0.39 |
| `heavy-analytics.com` | 0.88 | 0.05 | 0.70 | 0.54 |

With a single score, the analytics SDK "outranks" the consent banner. But the consent banner is far more impactful on user-perceived performance because it blocks rendering entirely. A single number collapses qualitatively different costs into a ranking that doesn't reflect reality.

Three targets preserve *how* something is costly:

- The UI can say "blocked a render-blocking tracker" vs "blocked a CPU-heavy tracker" -- different messages for different costs.
- Downstream consumers can weight dimensions differently. A mobile-focused UI might emphasize network cost; a desktop UI might emphasize main-thread cost.
- You can still derive a single aggregate if needed: `max(main_thread, render_delay, network_cost)` or a weighted sum. But you can't go the other direction -- you can't recover the three components from a single number.

## The Three Axes

The three targets correspond to the three independent bottlenecks in web page loading:

| Target | What it captures | Primary signal | User-facing meaning |
|---|---|---|---|
| **`main_thread_cost`** | CPU time: scripting, parse/compile, long tasks that block interactivity | `blockingTime`, `scripting`, `scriptParseCompile` from Lighthouse | "used your CPU in the background" |
| **`render_delay`** | First-paint impact: sync resources in the critical rendering path | `wastedMs` from render-blocking-resources audit | "delayed your page from appearing" |
| **`network_cost`** | Bandwidth and transfer overhead | `p50_transfer_bytes`, `requests_per_page`, total bytes per page | "used your bandwidth" |

These aren't arbitrary. **Main thread** (CPU-bound) directly impacts Total Blocking Time and Interaction to Next Paint. **Render path** (parser-bound) directly impacts First Contentful Paint and Largest Contentful Paint. **Network** (bandwidth-bound) impacts load time on slow connections and competes with first-party resources for bandwidth.

A tracker can be high on any combination. A 200-byte sync `<script>` in `<head>` is high render-delay but low on the other two axes. A 500KB async analytics bundle is high main-thread and high network but zero render-delay.

## Why Regression, Not Classification

Even with three axes, the question of continuous scores vs discrete buckets comes up. The case for regression is the same on each axis:

1. **No arbitrary boundaries.** Where do you draw the line between "moderate" and "heavy" CPU cost? 45ms of blocking time and 55ms aren't meaningfully different categories.
2. **Flexible downstream use.** The privacy metrics card can threshold at 0.5 for "high impact" today and 0.7 tomorrow without retraining. Each axis can use different thresholds.
3. **Richer signal.** A render_delay of 0.92 vs 0.71 tells you something. "Render-blocking" vs "render-blocking" doesn't.

## Why Per-Domain Scoring

The same tracker domain (e.g., `www.google-analytics.com`) can serve both a heavyweight analytics script and a lightweight pixel endpoint. I had to decide what level of granularity to score at.

I chose **domain level** using the *worst-case observed behavior* across pages. Three reasons:

1. **Firefox's storage is domain-granular.** `TrackingDBService` records blocked trackers by domain. The privacy metrics card displays per-domain counts. Scoring at the domain level means the scores slot directly into the existing data flow.
2. **At block time, Firefox knows the domain but hasn't fetched the resource.** Per-request features (like actual transfer size or content type) aren't available because the request was blocked. Domain-level features can be precomputed and shipped as a lookup table.
3. **Worst-case scoring is the right framing.** Each dimension reflects the upper bound of that cost type the user is protected from. A domain that is render-blocking on 5% of pages gets a high render_delay score based on its worst-case behavior. This is the right signal for "Firefox prevented X."

## Expected Score Distributions

Each target has a different distribution shape, reflecting the different nature of each cost type:

**`main_thread_cost`:** Right-skewed. Most tracker domains execute little or no JavaScript. A long tail of heavy SDKs.
- ~50% of domains score <0.2 (pixels, image beacons, CSS-only)
- ~10-15% score >0.7 (major analytics/ad SDKs)

**`render_delay`:** Extremely sparse. Very few tracker domains are render-blocking -- only sync `<script>` and `<link>` in `<head>` qualify.
- ~80-90% of domains score <0.1 (async or non-script resources)
- ~3-5% score >0.7 (tag managers, consent scripts)

**`network_cost`:** More evenly distributed, since every request has some transfer cost.
- More uniform spread, still right-skewed
- Pixels cluster near 0; ad networks cluster high

The sparsity of `render_delay` is a modeling challenge: the model mostly needs to distinguish the few render-blocking domains from the many that aren't. I address this in the [evaluation article](/firefox/tracker-performance-cost-model/evaluation_strategy).

---

## What I Learned

**Decomposition reveals structure that a single number hides.** The progression from classification to single regression to multi-target regression was driven by looking at the data. Every time I collapsed dimensions, I lost information that mattered for the UI. A consent banner and an analytics SDK are both "expensive," but they're expensive in ways that users experience differently. The three-axis decomposition preserves that.

**The Disconnect list is a privacy taxonomy, not a performance taxonomy.** The existing infrastructure in Firefox treats all trackers within a category as equivalent. The performance cost scorer adds three new dimensions to that taxonomy, and they're largely independent of the privacy categories. A "Social" tracker can be a pixel (low on all axes) or a heavyweight SDK (high main-thread, high network).

**Worst-case scoring is a product decision, not a statistical one.** Choosing to score domains by their upper-bound behavior on each axis is a choice about what message to send to users. "Firefox prevented 420ms of render delay" is more useful and more honest than "Firefox may have saved you approximately 200ms." The scoring methodology should serve the product story.
