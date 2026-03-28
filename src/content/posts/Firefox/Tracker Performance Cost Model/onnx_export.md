---
title: 'ONNX Export'
pubDate: '2026-03-27'
order: 6
viewId: 202
---

*Getting three gradient-boosted tree models into a format Firefox can load, under a combined 150KB gzipped size budget.*

---

## Why ONNX

Firefox ships with ONNX Runtime for in-browser ML inference. It's the same runtime used for features like alt-text generation and smart downloads. Exporting the XGBoost models to ONNX means they can run inside the browser process without any external dependencies.

For this project, the ONNX models are primarily a demonstration of the runtime inference path. The primary deployment mechanism is a precomputed lookup table (domain to 3-float vector JSON) that covers all known Disconnect list domains. But having the ONNX models means Firefox *could* score unknown domains at runtime if a new tracker appears before the lookup table is updated.

## Conversion

The export uses `onnxmltools`, which converts XGBoost's internal tree representation to the ONNX `TreeEnsembleRegressor` operator. With three independent models, I export each one separately:

```python
import onnxmltools
from onnxmltools.common.data_types import FloatTensorType
import onnxruntime as ort
import numpy as np
import os

TARGETS = ['main_thread_cost', 'render_delay', 'network_cost']

def export_all(models: dict, n_features: int, output_dir: str):
    total_size = 0
    for target in TARGETS:
        path = f'{output_dir}/tracker_{target}.onnx'
        export_single(models[target], n_features, path)
        size_kb = os.path.getsize(path) / 1024
        total_size += size_kb
        print(f"{target}: {size_kb:.1f} KB")
    print(f"Total: {total_size:.1f} KB (~{total_size * 0.47:.1f} KB gzipped)")

def export_single(xgb_model, n_features: int, output_path: str):
    initial_types = [('X', FloatTensorType([None, n_features]))]

    onnx_model = onnxmltools.convert_xgboost(
        xgb_model,
        initial_types=initial_types,
        target_opset={'': 15, 'ai.onnx.ml': 2},
    )

    onnxmltools.utils.save_model(onnx_model, output_path)
    validate_onnx(xgb_model, output_path, n_features)
```

The `target_opset` specifies ONNX opset 15 and the ML extension opset 2, which is the minimum needed for `TreeEnsembleRegressor`. Using the regression variant rather than the classifier variant is a small win: there's no probability output array, just a single float per sample per model.

## Validation

After conversion, I validate that each ONNX model produces identical predictions to the corresponding Python model:

```python
def validate_onnx(xgb_model, onnx_path: str, n_features: int):
    session = ort.InferenceSession(onnx_path)
    X_test = np.random.randn(100, n_features).astype(np.float32)

    xgb_preds = xgb_model.predict(X_test)
    onnx_preds = session.run(
        ['variable'], {'X': X_test}
    )[0].flatten()

    max_diff = np.max(np.abs(xgb_preds - onnx_preds))
    assert max_diff < 1e-5, f"Max diff: {max_diff}"

    size_kb = os.path.getsize(onnx_path) / 1024
    print(f"ONNX model size: {size_kb:.1f} KB")
```

The tolerance of 1e-5 accounts for float32 rounding differences between XGBoost's internal float64 computation and ONNX Runtime's float32 inference. In practice, the max diff was typically around 1e-6.

Each regressor outputs a single tensor named `variable` containing one float per input sample. At inference time, all three models receive the same input features; each produces one of the three cost axis scores, clamped to [0, 1].

## Size Budget

The target is under **150KB total gzipped** for all three models combined (~50KB each). Three independent `TreeEnsembleRegressor` models, each potentially with different tree counts from per-target Optuna tuning:

| Per-model config | Per-model raw | Per-model gzipped | 3-model total |
|---|---|---|---|
| 40 trees, depth 4 | ~48 KB | ~22 KB | ~67 KB |
| 50 trees, depth 4 | ~60 KB | ~28 KB | ~85 KB |
| 75 trees, depth 5 | ~150 KB | ~70 KB | ~210 KB |

The `render_delay` model likely needs the fewest trees: its target is sparse (mostly zeros with a few high-value domains), so it may converge with 30-40 trees while `main_thread_cost` needs 50+. Per-target tuning handles this naturally.

If the total exceeds budget, I prune per-target independently:

1. Reduce `n_estimators` per model until individual Spearman rho drops below 0.60
2. Reduce `max_depth` to 4
3. Increase `min_child_weight` to produce sparser trees

In practice, going from 75 trees to 50 trees per model typically drops Spearman rho by only 0.02-0.05, because the later trees in a boosting ensemble contribute diminishing marginal improvements.

Alternatively: ship a precomputed lookup table (domain to 3-float vector JSON) for known domains and only run models for unknown domains. The lookup table for ~3,000 domains with three float values each is ~55KB gzipped.

## Metadata Sidecar

The ONNX models alone aren't sufficient for inference. The inference code needs to know which features to log-transform and what order the features should be in. I export this as a JSON sidecar shared across all three models (they use the same input features):

```json
{
  "feature_names": [
    "p50_transfer_bytes", "p90_transfer_bytes", "mean_transfer_bytes",
    "max_script_bytes", "total_bytes_per_page", "script_request_ratio",
    "image_request_ratio", "requests_per_page", "distinct_resource_types",
    "mean_lh_blocking_time_ms", "mean_lh_main_thread_ms",
    "mean_scripting_ms", "mean_parse_compile_ms", "p50_load_ms",
    "render_block_rate", "mean_render_block_wasted_ms",
    "mean_render_block_bytes", "pages_seen_on", "p10_waterfall_index",
    "disconnect_Advertising", "disconnect_Analytics",
    "disconnect_Social", "disconnect_Content",
    "disconnect_Fingerprinting", "disconnect_Cryptomining"
  ],
  "log_transform_cols": [
    "p50_transfer_bytes", "p90_transfer_bytes", "mean_transfer_bytes",
    "max_script_bytes", "total_bytes_per_page",
    "mean_lh_blocking_time_ms", "mean_lh_main_thread_ms",
    "mean_scripting_ms", "mean_parse_compile_ms", "p50_load_ms",
    "mean_render_block_wasted_ms", "mean_render_block_bytes"
  ],
  "targets": ["main_thread_cost", "render_delay", "network_cost"],
  "axis_to_ms_mapping": {
    "main_thread_cost": { "slope": 520.0, "intercept": -12.5 },
    "render_delay": { "slope": 380.0, "intercept": -8.0 },
    "network_cost": { "slope_bytes": 245000, "intercept_bytes": -500 }
  }
}
```

The `axis_to_ms_mapping` fields define per-axis linear mappings from the 0-1 scores back to approximate real-world values (milliseconds for CPU and render axes, bytes for network), derived from the training data. These enable the UI to say "prevented 420ms of render delay" rather than showing raw scores.

---

## What I Learned

**Per-target size optimization is more flexible than one big model.** With three independent ONNX files, I can allocate size budget where it matters. If `render_delay` converges with 30 trees at 40KB while `main_thread_cost` needs 50 trees at 60KB, the total is still under budget. A single multi-output model would be forced to a uniform size.

**The ONNX `ai.onnx.ml` opset is less widely supported than the core opset.** Firefox's ONNX Runtime build includes it, but not every deployment target does. I tested early in the project by loading a trivial tree model in Firefox to confirm operator support before investing in the full pipeline. That test took 20 minutes and saved me from a potential dead end at week 4.

**The metadata sidecar is as important as the model files.** Without it, the inference code has to hardcode feature names, transform logic, and axis-to-value mappings, which creates a coupling between the training pipeline and the inference code that breaks whenever anything changes. The shared sidecar makes the inference path self-describing for all three models.
