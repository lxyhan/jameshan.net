---
title: 'Firefox Integration'
pubDate: '2026-03-27'
order: 7
viewId: 203
---

*Wiring three models into Firefox's existing tracking protection infrastructure, from Remote Settings delivery to per-axis UI messaging on the privacy metrics card.*

---

## Architecture

The integration touches four layers of Firefox, each with a single responsibility:

```
Remote Settings (Mozilla CDN)
  ├── tracker_main_thread_cost.onnx
  ├── tracker_render_delay.onnx
  ├── tracker_network_cost.onnx
  ├── tracker_risk_lookup.json
  └── tracker_risk_meta.json
          │
          ▼  download + cache
TrackerRiskScorer.sys.mjs
  → Check lookup table (fast path)
  → Run 3 ONNX models (fallback)
  → Return {main_thread, render, network}
          │
          ▼
TrackingDBService.sys.mjs
  → Records: domain, 3 scores, count
  → Stores in protections.sqlite
          │
          ▼
privacy-metrics-card.mjs
  → "Prevented 420ms render delay"
  → "Saved 890ms background CPU"
  → "Avoided 2.3MB network traffic"
```

**Remote Settings** is Mozilla's mechanism for delivering data files to Firefox without shipping a full browser update. The model artifacts (three ONNX files, lookup table, shared metadata) are published there and cached locally on the user's machine.

**TrackerRiskScorer** is the new module I built. It loads the lookup table on init and provides a synchronous `score(domain)` method for known domains. For unknown domains, it can optionally run all three ONNX models at runtime.

**TrackingDBService** is the existing C++ XPCOM service that records blocking events. I extended it with a new table to store the three cost axis scores alongside the existing domain and type information.

**privacy-metrics-card** is the Lit web component from the [privacy metrics widget project](/firefox/privacy-metrics-widget/privacy_metrics_component). It queries the new table and presents a per-axis performance summary to the user.

## TrackerRiskScorer Module

The core module provides two paths: a fast synchronous lookup for known domains, and an async ONNX inference path that runs all three models:

```javascript
// TrackerRiskScorer.sys.mjs
const COST_AXES = ['main_thread_cost', 'render_delay', 'network_cost'];

export class TrackerRiskScorer {
  #lookup = null;   // Map<domain, {main_thread_cost, render_delay, network_cost}>
  #sessions = {};   // {axis: InferenceSession} (lazy-loaded per axis)
  #meta = null;

  async init() {
    const lookupData = await this.#fetchFromRemoteSettings(
      'tracker_risk_lookup.json'
    );
    this.#lookup = new Map(Object.entries(JSON.parse(lookupData)));
    this.#meta = JSON.parse(
      await this.#fetchFromRemoteSettings('tracker_risk_meta.json')
    );
  }

  score(domain) {
    const cached = this.#lookup.get(domain);
    if (cached) {
      return { scores: cached, source: 'lookup' };
    }
    return { scores: null, source: 'miss' };
  }

  async scoreWithModels(domain, features) {
    const transformed = this.#applyTransforms(features);
    const input = new Tensor(
      'float32',
      new Float32Array(transformed),
      [1, transformed.length]
    );
    const scores = {};

    for (const axis of COST_AXES) {
      if (!this.#sessions[axis]) {
        const bytes = await this.#fetchFromRemoteSettings(
          `tracker_${axis}.onnx`
        );
        this.#sessions[axis] = await InferenceSession.create(bytes);
      }
      const result = await this.#sessions[axis].run({ X: input });
      scores[axis] = Math.max(0, Math.min(1, result.variable.data[0]));
    }

    return { scores, source: 'model' };
  }

  #applyTransforms(features) {
    return this.#meta.feature_names.map((name, i) => {
      const val = features[i];
      if (this.#meta.log_transform_cols.includes(name)) {
        return Math.log1p(val);
      }
      return val;
    });
  }
}
```

The `score()` method is synchronous and fast. It's called on the hot path when Firefox records a blocking event. The `scoreWithModels()` method is async (ONNX inference involves an awaitable session run) and loads each model lazily on first use. In the prototype, the lookup table covers all Disconnect list domains, so `scoreWithModels()` is only exercised in tests.

The `#applyTransforms()` method reads the log-transform column list from the shared metadata sidecar, so the feature engineering logic isn't hardcoded. All three models receive the same transformed input.

## Database Schema

The existing `protections.sqlite` database stores blocking events in a table with columns `(type, count, timestamp)`. I added a new table to store the three-dimensional cost profiles:

```sql
CREATE TABLE IF NOT EXISTS tracker_risk (
  domain TEXT NOT NULL,
  main_thread_cost REAL NOT NULL,
  render_delay REAL NOT NULL,
  network_cost REAL NOT NULL,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  block_count INTEGER DEFAULT 1,
  PRIMARY KEY (domain)
);
```

When Firefox blocks a tracker domain, the blocking event handler calls `TrackerRiskScorer.score(domain)` and writes all three scores to `tracker_risk`. The `block_count` and `last_seen` columns update on subsequent blocks of the same domain. This gives the privacy metrics card everything it needs: which domains were blocked, how they were costly on each axis, and how many times.

## Privacy Metrics Card Integration

The three-dimensional scores enable UI messaging that's impossible with a single number. I prototyped three options:

**Option A: Per-axis impact summary**

```
This week, Firefox protected you from:
  420ms of render delay    (from 6 render-blocking trackers)
  890ms of background CPU  (from 14 CPU-heavy trackers)
  2.3MB of network traffic (from 38 bandwidth-heavy trackers)
```

Time and byte estimates come from the per-axis mappings in `tracker_risk_meta.json`. For each blocked domain, the estimated savings on each axis is `score * slope + intercept`, summed across all domains weighted by block count. These are approximations, but they're grounded in the training data's relationship between scores and actual Lighthouse measurements.

**Option B: Top offenders with context**

```
Highest-impact trackers blocked this week:
  cdn.cookielaw.org       render-blocking  (blocked 31 times)
  doubleclick.net         CPU-heavy        (blocked 28 times)
  googletagmanager.com    render-blocking + CPU-heavy  (blocked 47 times)
```

The dominant axis (highest score) determines the label. Domains high on multiple axes get compound labels. This is the presentation that most directly benefits from multi-target scoring: a single composite number can't produce "render-blocking" vs "CPU-heavy" labels.

**Option C: Aggregate with drill-down**

```
Firefox blocked 58 trackers this week.
  ■■■ 6 delayed page rendering
  ■■■■■■ 14 used CPU in the background
  ■■■■■■■■■■■■ 38 used your bandwidth
```

Each tracker is assigned to the axis where its score is highest, with a threshold (e.g., >0.3) to filter out negligible trackers.

All three options are implemented as render modes in the same Lit component. A pref controls which mode is active, defaulting to Option A on Nightly. The three-dimensional structure means different UI surfaces can emphasize different axes: a performance-focused dashboard might lead with render_delay; a mobile data-usage UI might lead with network_cost.

## What Ships vs What Doesn't

| Artifact | Ships? | Notes |
|---|---|---|
| `tracker_risk_lookup.json` | Yes (Remote Settings) | Precomputed 3-float vectors for ~3,000 known tracker domains |
| `tracker_{axis}.onnx` (x3) | Optional | Three models, only needed for scoring unknown domains at runtime |
| `tracker_risk_meta.json` | With ONNX models | Feature names, transforms, per-axis value mappings |
| Training pipeline | No | Separate research repo |
| BigQuery SQL | No | Data extraction only |

For the prototype, the lookup table alone provides full coverage. The ONNX models demonstrate the capability for runtime inference on domains that haven't been scored yet.

---

## What I Learned

**The lookup table is the right default.** I spent significant effort on the ONNX export pipeline for three models, but for the actual prototype, a ~55KB JSON file mapping ~3,000 domains to 3-float vectors covers every Disconnect list domain. The ONNX models are a capability demonstration, not a practical necessity for known domains. If I were building this for production, I'd ship the lookup table first and add ONNX inference only when there's evidence that unknown-domain scoring improves the user experience.

**Three axes make the UI more honest.** "Firefox saved you ~340ms" (from a single score) is vague about *what* was saved. "Firefox prevented 420ms of render delay and 890ms of background CPU cost" is specific about *how* the trackers would have hurt the page. The multi-target decomposition costs more engineering complexity, but it produces a message that means something concrete. Users can understand "delayed your page from appearing" and "used CPU in the background" as distinct, real costs.

**Integrating with existing Firefox infrastructure constrains the design in useful ways.** The fact that `TrackingDBService` is domain-granular, that `about:protections` uses IPC via `RPMSendQuery`, and that Remote Settings handles data delivery meant I didn't have to build any of that infrastructure. The constraints from the existing system (domain-level scoring, synchronous lookups on the hot path, async ONNX as a fallback) produced a cleaner architecture than I would have designed from scratch. Adding three columns to the database table instead of one was the only schema change.
