---
title: "Index: Tracker Performance Cost Model"
pubDate: "2026-03-27"
order: 0
viewId: 196
---

*Multi-target XGBoost regression on HTTP Archive data, predicting tracker domain performance cost along three axes, exported to ONNX for in-browser inference in Firefox.*

This project builds a full ML pipeline from raw web crawl data to in-browser model inference. The core task is multi-target regression: given behavioral features for a tracker domain (transfer size, script ratio, waterfall position, Disconnect category), predict its performance cost along three independent axes -- CPU, render delay, and network. The training data comes from HTTP Archive and Lighthouse audits on BigQuery. The models export to ONNX for delivery via Firefox's Remote Settings, where they power richer messaging on the privacy metrics card.

---

## Articles

1. [Problem and Target Variables](/firefox/tracker-performance-cost-model/problem_and_target_variable) - Framing tracker performance as multi-target regression over three independent cost axes
2. [Ground Truth Construction](/firefox/tracker-performance-cost-model/ground_truth_construction) - Constructing labeled data from HTTP Archive and Lighthouse audits on BigQuery
3. [Feature Engineering](/firefox/tracker-performance-cost-model/feature_engineering) - Designing a 20-feature vector from request metadata and Lighthouse signals
4. [Model Selection and Training](/firefox/tracker-performance-cost-model/model_selection_and_training) - Three independent XGBoost regressors with per-target Optuna hyperparameter search
5. [Evaluation Strategy](/firefox/tracker-performance-cost-model/evaluation_strategy) - Per-target Spearman rank correlation, baselines, and the generalization argument
6. [ONNX Export](/firefox/tracker-performance-cost-model/onnx_export) - Tree model to ONNX conversion under a 150KB combined size budget
7. [Firefox Integration](/firefox/tracker-performance-cost-model/firefox_integration) - TrackerRiskScorer module, lookup table fast path, and per-axis UI messaging
