---
title: 'Feature Engineering'
pubDate: '2026-03-27'
order: 3
viewId: 199
---

*Twenty features that describe how a tracker domain behaves on the web, from transfer size to waterfall position to Disconnect category.*

---

## The Feature Vector

All three models receive the same fixed-length feature vector per tracker domain. The features are shared; the targets are different. All features are aggregated from HTTP Archive data at the domain level. I organized them into five groups based on what aspect of tracker behavior they capture.

### Size Features (5)

| # | Feature | Description |
|---|---|---|
| 1 | `p50_transfer_bytes` | Median transfer size across all requests |
| 2 | `p90_transfer_bytes` | 90th percentile transfer size |
| 3 | `mean_transfer_bytes` | Mean transfer size |
| 4 | `max_script_bytes` | Largest single script transfer size |
| 5 | `total_bytes_per_page` | Sum of all bytes from this domain per page (median across pages) |

Size features alone tell you a lot. A domain that consistently serves 500KB of JavaScript is almost certainly more expensive than one that serves 200 bytes of image data. But size isn't everything. A 100KB script loaded asynchronously after DOMContentLoaded costs much less than a 30KB script loaded synchronously in `<head>`.

### Type Composition Features (4)

| # | Feature | Description |
|---|---|---|
| 6 | `script_request_ratio` | Fraction of requests that are type=script |
| 7 | `image_request_ratio` | Fraction that are type=image |
| 8 | `requests_per_page` | Median number of requests from this domain per page |
| 9 | `distinct_resource_types` | Number of unique resource types served |

These features capture the *character* of a tracker domain. A pure tracking pixel has `image_request_ratio` near 1.0 and `script_request_ratio` near 0.0. A tag manager has the inverse. A domain that serves scripts, images, and fonts is probably an ad SDK with broad page integration. The ratio between script and non-script requests is one of the strongest signals of performance cost.

### Timing and Execution Features (5)

| # | Feature | Description |
|---|---|---|
| 10 | `mean_lh_blocking_time_ms` | Lighthouse third-party-summary blockingTime |
| 11 | `mean_lh_main_thread_ms` | Lighthouse third-party-summary mainThreadTime |
| 12 | `mean_scripting_ms` | Lighthouse bootup-time scripting time |
| 13 | `mean_parse_compile_ms` | Lighthouse bootup-time scriptParseCompile time |
| 14 | `p50_load_ms` | Median total request time |

These are the most direct performance signals. Lighthouse's `blockingTime` measures how long a third party holds the main thread in chunks over 50ms, which is exactly what contributes to Total Blocking Time and Interaction to Next Paint. The `scripting_ms` and `parse_compile_ms` from the bootup-time audit give a finer breakdown of CPU cost. Together, features 10-13 capture the execution cost that raw transfer size misses.

### Render-Blocking Features (3)

| # | Feature | Description |
|---|---|---|
| 15 | `render_block_rate` | Fraction of pages where domain appears in render-blocking audit |
| 16 | `mean_render_block_wasted_ms` | Average wasted render-blocking ms |
| 17 | `mean_render_block_bytes` | Average render-blocking resource size |

A render-blocking resource delays first paint entirely. It doesn't just add CPU time; it freezes the page until the resource loads and executes. The `render_block_rate` feature captures how consistently a domain imposes this cost. `cdn.cookielaw.org` appears in the render-blocking audit on almost every page it's loaded on. `google-analytics.com` almost never does, because analytics.js is typically loaded async.

### Prevalence and Context Features (3)

| # | Feature | Description |
|---|---|---|
| 18 | `pages_seen_on` | Number of pages this domain appears on |
| 19 | `p10_waterfall_index` | 10th percentile waterfall position (how early it loads) |
| 20 | `disconnect_category` | Disconnect list category |

`pages_seen_on` is a statistical confidence signal more than a performance signal. A domain observed on 50,000 pages has stable aggregates; one on 100 pages may not. `p10_waterfall_index` captures how early a domain loads: a low waterfall position means it's loaded before most other resources, which correlates with render-blocking behavior. `disconnect_category` gives the model access to the privacy taxonomy, so it can learn interactions like "Analytics + small transfer size = low cost" vs "Advertising + large transfer size = high cost."

## Transforms and Encoding

### Log Transforms

All byte and millisecond features are heavily right-skewed. A few domains serve megabytes of JavaScript; most serve kilobytes. Without transformation, the model would spend most of its splits distinguishing between the extreme tail values, which isn't useful.

I applied `log1p` (natural log of 1 + x) to all features with `bytes` or `_ms` in the name. `log1p` handles zero values cleanly (log1p(0) = 0) and compresses the range so the model can split on meaningful differences across the full distribution.

### One-Hot Encoding

The `disconnect_category` feature is categorical with 6 values: Advertising, Analytics, Social, Content, Fingerprinting, Cryptomining. I one-hot encoded this into 6 binary features, bringing the total input dimensionality from 20 raw features to 26.

One-hot encoding lets the model learn category-specific interactions. A tree split on `disconnect_category_Analytics = 1` combined with a split on `p50_transfer_bytes < threshold` captures the pattern "lightweight analytics scripts are low-cost" without needing to encode that relationship explicitly.

### Missing Values

Some tracker domains have no Lighthouse data. They appear in the request tables but not in any Lighthouse audit, either because they load after Lighthouse's observation window or because they don't trigger any of the performance audits. Features 10-17 (timing and render-blocking) can be null for these domains.

XGBoost handles missing values natively. During training, it learns a default split direction for each node: when a value is missing, the tree sends the sample left or right based on which direction reduces loss more. This means I don't need to impute missing values, which is important because imputation (e.g., filling with zeros or medians) would inject false signal. A missing Lighthouse blocking time is not the same as zero blocking time.

### What's Not a Feature

The domain name itself is not a feature. The models don't see `googletagmanager.com` as a string; they only see the 26-dimensional behavioral description. This is a deliberate choice: the models should generalize from behavioral signals, not memorize domain identity. If a new tracker domain appears on the Disconnect list tomorrow, all three models can score it based on its observed behavior without ever having seen its name.

---

## What I Learned

**Feature groups tell a story.** Organizing features by what they measure (size, type composition, timing, render-blocking, context) made it much easier to reason about what each model was learning and to diagnose errors. When a domain had an unexpectedly high score on one axis, I could look at which feature group was driving it and immediately narrow down why. It also made the multi-target design feel natural: the timing features drive `main_thread_cost`, the render-blocking features drive `render_delay`, the size features drive `network_cost`, and the composition and context features inform all three.

**Missing values are informative, not just inconvenient.** A domain with no Lighthouse blocking time data is likely one that loads late, loads only as images, or loads on very few pages. XGBoost's native handling of missingness lets the model learn from this absence rather than filling it with a guess.

**Twenty features is enough.** I started with ~35 features and pruned down based on SHAP importance analysis and correlation checks. Several features were redundant (e.g., `mean_transfer_bytes` and `p50_transfer_bytes` are highly correlated for most domains). The final 20 cover the signal space without introducing noise from redundant or uninformative features.
