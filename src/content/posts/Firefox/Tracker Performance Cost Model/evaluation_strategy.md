---
title: 'Evaluation Strategy'
pubDate: '2026-03-27'
order: 5
viewId: 201
---

*Each model needs to preserve the correct ordering of domains on its axis. Spearman rank correlation, computed per target, is the right primary metric.*

---

## Splits

The dataset of ~2,000-3,000 scored domains is split into three parts:

- **Train (70%):** used for per-target Optuna hyperparameter search with 5-fold cross-validation
- **Validation (15%):** used during tuning to monitor overfitting
- **Test (15%):** held out entirely, touched once after all tuning is complete

The same split is used across all three targets for fair comparison. With ~2,500 domains, the test set contains ~375 domains.

## Metrics

All metrics are computed **per target** and then summarized.

### Primary: Spearman Rank Correlation (per target)

Spearman rho measures whether each model preserves the correct rank ordering on its axis. If the main_thread_cost model says domain A uses more CPU than domain B, is that true? This is the metric that matters most for the downstream use case. The privacy metrics card needs to correctly identify which trackers are high-impact on each axis, not predict their exact score to three decimal places.

### Secondary Metrics

- **RMSE per target** measures absolute prediction error. Useful for calibration.
- **MAE per target** is less sensitive to outliers and gives a sense of typical error.
- **Mean Spearman rho** across all 3 targets is the headline summary metric.
- **Per-target R-squared** is particularly interesting to compare across targets. `render_delay` may have lower R-squared due to sparsity even if its Spearman rho is acceptable.

### Targets

| Metric | Minimum (credible) | Target (strong) |
|---|---|---|
| Mean Spearman rho (across 3 targets) | >= 0.75 | >= 0.85 |
| No individual target rho below | 0.60 | 0.70 |
| RMSE per target | <= 0.18 | <= 0.15 |

### Per-Target Difficulty Expectations

The three targets aren't equally hard to predict:

- **`main_thread_cost`:** Easiest. Strongest signal from multiple correlated features (blocking time, scripting time, transfer size). Expected rho: 0.80-0.90.
- **`network_cost`:** Moderate. Transfer size is a strong direct predictor, but request count and per-page totals add complexity. Expected rho: 0.75-0.85.
- **`render_delay`:** Hardest. Very sparse (~80-90% of domains score near 0), so the model mainly needs to identify the few render-blocking domains from the many that aren't. Expected rho: 0.65-0.80.

If `render_delay` falls below 0.60 Spearman rho, it's a signal that the target is too sparse to learn reliably. In that case, the fallback is to fold render-delay information into the `main_thread_cost` target, reducing from three axes to two.

## Baselines

Every metric is meaningless without baselines. I computed five, evaluated per target and reported as the mean:

| Baseline | Description | Expected mean rho |
|---|---|---|
| **Mean prediction** | Predict the per-target mean for everything | 0.0 (by definition) |
| **Transfer size only** | All 3 targets = `percentile_rank(p50_transfer_bytes)` | ~0.40-0.55 |
| **Script ratio only** | All 3 targets = `script_request_ratio` | ~0.35-0.50 |
| **Disconnect category mean** | Per-category mean per target from training set | ~0.30-0.45 |
| **Ridge regression (per target)** | Independent ridge regression per target | ~0.60-0.75 |

The transfer size baseline is surprisingly strong for `network_cost` (it's almost a direct predictor) but weak for `render_delay` (transfer size doesn't tell you whether something is render-blocking). This asymmetry is the whole point of multi-target regression: different axes have different predictive structures.

XGBoost needs to beat ridge regression on at least 2 of 3 targets. If it can't, the problem doesn't have meaningful feature interactions and I should ship the simpler model.

## The Generalization Argument

There's a reasonable question: why train models if I already have the score formulas?

The target scores (described in the [ground truth construction article](/firefox/tracker-performance-cost-model/ground_truth_construction)) require Lighthouse data: blocking time, scripting time, render-blocking audit results. That data only exists for the ~16M pages in the HTTP Archive crawl. For any domain that doesn't appear in HTTP Archive, or for future domains added to the Disconnect list, the formulas can't produce scores.

The models learn the mapping from **observable request-level features** (size, type composition, waterfall position, Disconnect category) **to the Lighthouse-derived target scores**. At inference time, the models only need features that can be precomputed or observed from request metadata. They don't need Lighthouse.

To quantify the generalization gap, I trained **two sets of three models**:

1. **All-features models:** all 26 features, including Lighthouse-derived ones (features 10-17)
2. **No-Lighthouse models:** only the 12 non-Lighthouse features (size, type composition, prevalence, Disconnect category)

Both sets are evaluated on the same held-out test set. The per-target gap tells a specific story:

| Target | Expected rho (all features) | Expected rho (no Lighthouse) | Gap |
|---|---|---|---|
| `main_thread_cost` | 0.85-0.90 | 0.70-0.80 | 0.10-0.15 |
| `render_delay` | 0.70-0.80 | 0.55-0.70 | 0.10-0.15 |
| `network_cost` | 0.80-0.85 | 0.75-0.82 | 0.03-0.08 |

`network_cost` should have the smallest gap because its primary signal (transfer size) is a non-Lighthouse feature -- it's directly observable. `render_delay` should have the largest gap because the render-blocking audit is the primary signal and there's no great proxy for it in the non-Lighthouse features, though waterfall position and script-in-head patterns may partially compensate.

This asymmetry is a real finding about what's learnable from request metadata alone. It's also one of the strongest interview moments: the per-target generalization gaps tell you exactly which dimensions of performance cost are observable without running Lighthouse and which aren't.

## Error Analysis

Beyond aggregate metrics, I looked at individual predictions per target. The most informative analysis was examining high-residual domains: tracker domains where a specific model's prediction is far from the label.

Common patterns:

- **Domains with mixed behavior.** A domain that serves both lightweight pixels and heavyweight scripts on different pages has unstable aggregates. The label reflects the weighted average, but the model might key on whichever behavior dominates the feature vector. This shows up most on the `main_thread_cost` axis.
- **Low-prevalence domains near the 100-page threshold.** Domains with exactly 100-200 page observations have noisier labels than those with 10,000+ observations. The model predictions were often more stable than the labels for these domains.
- **The render_delay blind spot.** The `render_delay` model struggles most with domains that are render-blocking on a small fraction of pages. The render_block_rate feature captures this, but when the rate is low (say 5%), the model has to decide whether that's signal or noise. For the no-Lighthouse model, this is even harder since the render-blocking audit is unavailable.

---

## What I Learned

**Baselines are the most important part of evaluation.** Without them, a mean Spearman rho of 0.82 is just a number. With baselines, it means "20+ points better than transfer size alone on the axes where transfer size is a weak predictor." The per-target baseline comparison is particularly revealing: the transfer size baseline is strong for `network_cost` but weak for `render_delay`, which validates the multi-target decomposition.

**The two-model evaluation is the strongest argument for the approach.** The per-target generalization gaps answer "why not just use the formula?" with a nuanced, specific answer: "because network cost generalizes well (small gap), CPU cost generalizes moderately (medium gap), and render delay generalizes poorly (large gap)." That's a real finding, not a talking point.

**Per-target error analysis reveals different failure modes.** The `main_thread_cost` model fails on mixed-behavior domains. The `render_delay` model fails on low-rate render-blocking. The `network_cost` model rarely fails badly because transfer size is directly observable. Each failure mode points to a specific limitation of the approach, which is more useful than "the model sometimes gets it wrong."
