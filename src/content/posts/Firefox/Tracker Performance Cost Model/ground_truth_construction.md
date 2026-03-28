---
title: 'Ground Truth Construction'
pubDate: '2026-03-27'
order: 2
viewId: 198
---

*There's no labeled dataset of "tracker domain to performance cost profile." So I built one from HTTP Archive and Lighthouse data on BigQuery.*

---

## The Problem

No one has published a dataset that maps tracker domains to their performance impact on web pages, let alone one that breaks that impact into independent dimensions. The Disconnect list categorizes domains by privacy function. The third-party-web project tracks script execution time. But neither produces the thing I actually needed: a three-dimensional performance cost profile per domain, covering CPU cost, render-blocking behavior, and network overhead independently.

I had to construct the ground truth labels from raw web crawl data.

## Data Source: HTTP Archive on BigQuery

HTTP Archive crawls millions of web pages monthly and stores the results in BigQuery. The tables I used:

- `httparchive.crawl.requests` provides per-request timing, transfer size, resource type, and waterfall position for every HTTP request in the crawl.
- `httparchive.crawl.pages` contains per-page Lighthouse audit results as JSON, including the third-party-summary, render-blocking-resources, and bootup-time audits.
- `httparchive.almanac.third_parties` maps domains to categories from the third-party-web project (~2,700 entities).

I joined these against the Disconnect list (`services.json`) to filter down to known tracker domains. I used the `2024-06-01` crawl (most recent with stable Lighthouse v12 data) and the `mobile` client, which is more representative of constrained devices and covers ~60% of HTTP Archive's crawl.

## The Three-Stage SQL Pipeline

The labeling pipeline runs as three sequential BigQuery stages, each producing an intermediate table.

### Stage 1: Per-Request Feature Extraction

The first stage pulls raw request-level signals for every HTTP request to a known tracker domain:

```sql
CREATE TEMP TABLE request_features AS
SELECT
  NET.HOST(req.url) AS tracker_domain,
  req.page,
  req.type AS resource_type,
  CAST(JSON_VALUE(req.payload, '$._bytesIn') AS INT64) AS transfer_bytes,
  CAST(JSON_VALUE(req.payload, '$._load_ms') AS INT64) AS load_ms,
  CAST(JSON_VALUE(req.payload, '$._ttfb_ms') AS INT64) AS ttfb_ms,
  req.index AS waterfall_index,
  JSON_VALUE(req.payload, '$._priority') AS chrome_priority,
  JSON_VALUE(req.payload, '$._contentType') AS content_type,
FROM `httparchive.crawl.requests` req
WHERE req.date = '2024-06-01'
  AND req.client = 'mobile'
  AND req.is_root_page = TRUE
  AND NET.HOST(req.url) IN (SELECT domain FROM disconnect_domains)
```

This gives me the raw building blocks: how big each request is, how long it takes, where it falls in the page waterfall, and what type of resource it is (script, image, etc.).

### Stage 2: Lighthouse Signal Extraction

The second stage extracts performance signals from Lighthouse audits embedded in the page-level data. Three audits matter, and notably, each one maps to a different target variable:

**Third-party summary** gives per-entity blocking time and main-thread time (drives `main_thread_cost`):

```sql
CREATE TEMP TABLE lighthouse_features AS
SELECT
  NET.HOST(JSON_VALUE(item, '$.entity.url')) AS tracker_domain,
  page,
  CAST(JSON_VALUE(item, '$.blockingTime') AS FLOAT64) AS lh_blocking_time_ms,
  CAST(JSON_VALUE(item, '$.mainThreadTime') AS FLOAT64) AS lh_main_thread_time_ms,
FROM `httparchive.crawl.pages`,
  UNNEST(JSON_QUERY_ARRAY(lighthouse,
    '$.audits.third-party-summary.details.items')) AS item
WHERE date = '2024-06-01'
  AND client = 'mobile'
  AND is_root_page = TRUE
```

**Render-blocking resources** identifies scripts and stylesheets that delay first paint (drives `render_delay`):

```sql
CREATE TEMP TABLE render_blocking AS
SELECT
  NET.HOST(JSON_VALUE(item, '$.url')) AS tracker_domain,
  page,
  CAST(JSON_VALUE(item, '$.wastedMs') AS FLOAT64) AS render_block_wasted_ms,
  CAST(JSON_VALUE(item, '$.totalBytes') AS INT64) AS render_block_total_bytes,
FROM `httparchive.crawl.pages`,
  UNNEST(JSON_QUERY_ARRAY(lighthouse,
    '$.audits.render-blocking-resources.details.items')) AS item
WHERE date = '2024-06-01'
  AND client = 'mobile'
  AND is_root_page = TRUE
```

**Boot-up time** breaks down per-script CPU cost into scripting and parse/compile time (supplements `main_thread_cost`):

```sql
CREATE TEMP TABLE bootup_features AS
SELECT
  NET.HOST(JSON_VALUE(item, '$.url')) AS tracker_domain,
  page,
  CAST(JSON_VALUE(item, '$.scripting') AS FLOAT64) AS scripting_ms,
  CAST(JSON_VALUE(item, '$.scriptParseCompile') AS FLOAT64) AS parse_compile_ms,
FROM `httparchive.crawl.pages`,
  UNNEST(JSON_QUERY_ARRAY(lighthouse,
    '$.audits.bootup-time.details.items')) AS item
WHERE date = '2024-06-01'
  AND client = 'mobile'
  AND is_root_page = TRUE
```

### Stage 3: Domain-Level Aggregation and Three-Target Score Construction

The third stage joins everything, aggregates to the domain level, and computes three independent target scores. This is where individual page-level observations become a 3-dimensional profile per tracker domain.

The aggregation computes percentile ranks across all tracker domains for each signal, then constructs each target from its relevant signals:

```sql
WITH percentile_ranks AS (
  SELECT
    *,
    -- Main-thread signals
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(mean_lh_blocking_time_ms, 0)
    ) AS prank_blocking_time,
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(mean_scripting_ms, 0)
    ) AS prank_scripting,
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(mean_parse_compile_ms, 0)
    ) AS prank_parse_compile,
    -- Render-delay signals
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(mean_render_block_wasted_ms, 0)
        * SAFE_DIVIDE(render_blocking_occurrences, pages_seen_on)
    ) AS prank_render_blocking,
    -- Network signals
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(p50_transfer_bytes, 0)
    ) AS prank_transfer_size,
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(bytes_per_page, 0)
    ) AS prank_bytes_per_page,
    PERCENT_RANK() OVER (
      ORDER BY COALESCE(requests_per_page_avg, 0)
    ) AS prank_requests_per_page,
  FROM domain_agg
)
SELECT
  *,
  -- Target 1: main_thread_cost (CPU impact on interactivity)
  GREATEST(0.0, LEAST(1.0,
    0.50 * prank_blocking_time +
    0.35 * prank_scripting +
    0.15 * prank_parse_compile
  )) AS main_thread_cost,

  -- Target 2: render_delay (impact on first paint)
  GREATEST(0.0, LEAST(1.0,
    prank_render_blocking
  )) AS render_delay,

  -- Target 3: network_cost (bandwidth and transfer overhead)
  GREATEST(0.0, LEAST(1.0,
    0.50 * prank_transfer_size +
    0.30 * prank_bytes_per_page +
    0.20 * prank_requests_per_page
  )) AS network_cost

FROM percentile_ranks
WHERE pages_seen_on >= 100
```

Each target is constructed from a different subset of signals. This is a key design choice: the three axes are built from independent evidence, not from shuffling the same numbers into different weighted sums.

The `pages_seen_on >= 100` filter ensures stable statistics. Domains that appear on fewer than 100 pages have too much variance in their Lighthouse aggregates to produce reliable scores.

## Why Percentile Ranks

I considered using raw Lighthouse milliseconds directly, but percentile ranks turned out to be much better:

- **Robust to outliers.** A single page with 10,000ms blocking time doesn't dominate the score.
- **Naturally scaled to [0, 1].** No need for min-max normalization, which is sensitive to extreme values.
- **Interpretable.** A main_thread_cost of 0.85 means "worse than 85% of tracker domains on CPU cost."

The alternative was min-max normalization over raw values, but that would make the scores unstable across crawl dates. Percentile ranks are relative, so the distribution stays calibrated even as absolute performance numbers shift.

## Per-Target Weight Rationale

Each target is a weighted combination of related percentile-ranked signals:

**`main_thread_cost`** (3 signals):

| Signal | Weight | Rationale |
|---|---|---|
| `prank_blocking_time` | 0.50 | Lighthouse `blockingTime` directly measures TBT contribution, the most user-impactful CPU metric |
| `prank_scripting` | 0.35 | Total JS execution time from bootup-time audit; captures overall CPU cost |
| `prank_parse_compile` | 0.15 | Parse/compile overhead; smaller weight because it's typically a fraction of total scripting time |

**`render_delay`** (1 signal): Simply the percentile rank of render-blocking wasted-ms weighted by occurrence rate. No composite needed. The Lighthouse render-blocking audit is already the definitive measure. Most tracker domains score near 0.0 here; the few that score high (tag managers, consent scripts) are the ones that really matter.

**`network_cost`** (3 signals):

| Signal | Weight | Rationale |
|---|---|---|
| `prank_transfer_size` | 0.50 | Median per-request transfer size; captures how heavy individual resources are |
| `prank_bytes_per_page` | 0.30 | Total bytes from this domain per page; captures cumulative bandwidth impact |
| `prank_requests_per_page` | 0.20 | Request count overhead; each request has fixed costs (DNS, TLS, HTTP headers) |

These weights are design decisions, not learned parameters. I validated them by checking that the resulting score profiles match expert intuition on known domains.

## Score Validation

Before training any model, I checked the three-dimensional profiles against domains where I had strong priors:

| Domain | `main_thread` | `render_delay` | `network` | Rationale |
|---|---|---|---|---|
| `googletagmanager.com` | high (>0.7) | high (>0.8) | moderate | GTM: sync in `<head>`, significant JS, moderate transfer |
| `google-analytics.com` | moderate (0.5-0.7) | low (<0.2) | moderate | Meaningful JS exec but async, not render-blocking |
| `cdn.cookielaw.org` | low (<0.3) | high (>0.8) | low | Consent: render-blocking but small script, minimal CPU |
| `doubleclick.net` | high (>0.7) | low-moderate | high (>0.7) | Heavy ad scripts, large transfers, but usually async |
| `pixel.quantserve.com` | near-zero | near-zero | near-zero | Image pixel: no JS, no rendering impact, tiny transfer |
| `bat.bing.com` | near-zero | near-zero | near-zero | Tracking pixel |
| `connect.facebook.net` | high (>0.7) | low (<0.2) | high (>0.6) | Large SDK, heavy CPU, but async loaded |

The key validation is that the three dimensions produce **different profiles** for qualitatively different trackers. If `cdn.cookielaw.org` and `doubleclick.net` get similar vectors, something is wrong. The consent banner should be [low, high, low] and the ad network should be [high, low, high]. That's exactly what the pipeline produced.

---

## What I Learned

**Constructing labels is the hardest part of an ML project.** The model training was straightforward once I had good labels. Getting from "raw crawl data in BigQuery" to "validated per-domain 3D performance profiles" took more than half the total project time. Every decision in the labeling pipeline (which signals map to which target, how to weight composites, what minimum prevalence to require) directly affects what the models learn.

**Percentile ranks are underrated as a normalization strategy.** They solved three problems at once: outlier robustness, natural [0, 1] scaling, and cross-crawl stability. I initially built the pipeline with raw milliseconds and min-max normalization, and the scores were dominated by a handful of extremely heavy domains. Switching to percentile ranks immediately fixed the distribution on all three axes.

**Three-dimensional validation is more convincing than one-dimensional.** With a single composite score, validation is just "is domain A ranked higher than domain B?" With three axes, validation is "does domain A have the right *shape*?" A consent banner should look different from an ad SDK even if they have similar overall cost. The fact that the pipeline produced the right shapes for known domains gave me much more confidence than a rank ordering check would have.
