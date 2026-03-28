---
title: 'Model Selection and Training'
pubDate: '2026-03-27'
order: 4
viewId: 200
---

*Three independent XGBoost regressors, one per target axis, each tuned with Optuna, optimized for rank correlation.*

---

## Model Choice

The task is tabular regression: 26 numeric features in, one float out per target. The dataset is small (~2,000-3,000 domains after filtering). The models need to export to ONNX for potential in-browser delivery. I considered four options.

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **XGBoost** | Best on tabular data; handles missing values natively; small ONNX; interpretable via SHAP | No transfer learning | **Selected** |
| **LightGBM** | Slightly faster training | Asymmetric trees produce less predictable ONNX size; ONNX converter less mature | Runner-up |
| **Ridge/Lasso** | Simplest possible; tiny model | Can't capture feature interactions | Too weak |
| **Small neural net** | Could learn embeddings | Overkill for 26 features and ~3K samples; larger ONNX | Wrong tool |

The critical factor was feature interactions. A linear model can learn "high transfer size = high cost," but it can't learn "high script ratio + large size = high cost, but high script ratio + small size = low cost." That interaction is real: a domain that serves many small scripts (like a retargeting pixel chain) behaves very differently from one that serves a few large scripts (like an ad SDK). XGBoost captures this with tree splits, and it does so efficiently on small datasets where neural nets would overfit.

The missing value handling was a bonus. As discussed in the [feature engineering article](/firefox/tracker-performance-cost-model/feature_engineering), Lighthouse features are null for many domains. XGBoost learns default split directions for missing values during training, so I don't need an imputation step that would inject false signal.

## Three Independent Models

I train three independent `XGBRegressor` models, one per target axis. Not a single multi-output model, for several reasons:

- XGBoost doesn't natively support multi-output regression. Scikit-learn's `MultiOutputRegressor` is just a wrapper that trains independent models anyway.
- Independent models let me tune hyperparameters per target. The `render_delay` target is very sparse (~80-90% of domains near zero), so it may need different regularization than `main_thread_cost`.
- Independent ONNX export: each model is a separate small file. If one target turns out to be unpredictable, I can drop it without retraining the others.
- Per-target SHAP analysis is cleaner when each model is self-contained.

```python
import xgboost as xgb

TARGETS = ['main_thread_cost', 'render_delay', 'network_cost']

base_params = dict(
    max_depth=5,
    learning_rate=0.1,
    min_child_weight=5,
    subsample=0.8,
    colsample_bytree=0.8,
    objective='reg:squarederror',
    eval_metric='rmse',
    tree_method='hist',
    random_state=42,
)

models = {}
for target in TARGETS:
    models[target] = xgb.XGBRegressor(
        n_estimators=100,
        **base_params,
    )
```

A few notes on the base configuration:

- **`max_depth=5`** keeps trees shallow. With ~3,000 samples, deep trees overfit quickly. Each tree should capture a simple interaction (2-3 feature splits), not memorize the training set.
- **`min_child_weight=5`** regularizes by requiring at least 5 samples in each leaf. This prevents the model from creating leaves for individual domains.
- **`subsample=0.8` and `colsample_bytree=0.8`** add stochasticity to reduce overfitting. Each tree sees 80% of samples and 80% of features.

## Hyperparameter Tuning with Optuna

Each target gets its own Optuna study with 5-fold cross-validation, optimizing for Spearman rank correlation. Independent tuning is important because the targets have different distributions: `render_delay` is sparse and may need fewer trees, while `main_thread_cost` has stronger signal and can support more complexity.

```python
import optuna
from scipy.stats import spearmanr
from sklearn.model_selection import KFold

def train_single(X_train, y_train, target_name: str, output_dir: str):
    def objective(trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 30, 200),
            'max_depth': trial.suggest_int('max_depth', 3, 7),
            'learning_rate': trial.suggest_float(
                'learning_rate', 0.01, 0.3, log=True
            ),
            'min_child_weight': trial.suggest_int('min_child_weight', 1, 20),
            'subsample': trial.suggest_float('subsample', 0.6, 1.0),
            'colsample_bytree': trial.suggest_float(
                'colsample_bytree', 0.5, 1.0
            ),
            'gamma': trial.suggest_float('gamma', 0, 5),
            'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10, log=True),
            'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10, log=True),
        }

        kf = KFold(n_splits=5, shuffle=True, random_state=42)
        scores = []
        for train_idx, val_idx in kf.split(X_train):
            model = xgb.XGBRegressor(
                **params,
                objective='reg:squarederror',
                tree_method='hist',
                random_state=42,
            )
            model.fit(
                X_train.iloc[train_idx], y_train.iloc[train_idx],
                eval_set=[(X_train.iloc[val_idx], y_train.iloc[val_idx])],
                verbose=False,
            )
            preds = model.predict(X_train.iloc[val_idx])
            rho, _ = spearmanr(y_train.iloc[val_idx], preds)
            scores.append(rho)

        return np.mean(scores)

    study = optuna.create_study(direction='maximize')
    study.optimize(objective, n_trials=100)
    print(f"{target_name}: best CV Spearman rho = {study.best_value:.3f}")

    best_model = xgb.XGBRegressor(
        **study.best_params,
        objective='reg:squarederror',
        tree_method='hist',
        random_state=42,
    )
    best_model.fit(X_train, y_train)
    best_model.save_model(f'{output_dir}/tracker_{target_name}.json')
    return best_model
```

The search space is wide on regularization parameters (`reg_alpha`, `reg_lambda`, `gamma`) because I wasn't sure how much regularization the small dataset would need. Optuna's tree-structured Parzen estimator explores this efficiently without grid search.

## The Training Loop

The outer loop trains all three models on the same train/test split, then evaluates each independently:

```python
TARGETS = ['main_thread_cost', 'render_delay', 'network_cost']

def train_all(features_path: str, output_dir: str):
    df = pd.read_parquet(features_path)

    feature_cols = [c for c in df.columns
                    if c not in ['tracker_domain'] + TARGETS]
    X = df[feature_cols].copy()

    skewed_cols = [c for c in feature_cols if 'bytes' in c or '_ms' in c]
    X[skewed_cols] = np.log1p(X[skewed_cols])

    X_train, X_test, idx_train, idx_test = train_test_split(
        X, df.index, test_size=0.15, random_state=42
    )

    models = {}
    for target in TARGETS:
        y = df[target]
        y_train, y_test = y.iloc[idx_train], y.iloc[idx_test]
        models[target] = train_single(X_train, y_train, target, output_dir)

        preds = models[target].predict(X_test)
        rho, _ = spearmanr(y_test, preds)
        rmse = np.sqrt(np.mean((y_test - preds) ** 2))
        print(f"{target}: Spearman rho = {rho:.3f}, RMSE = {rmse:.3f}")

    return models
```

The same train/test split is used across all three targets for fair comparison. The 15% held-out test set is touched exactly once per target, after all tuning is done.

## Size Considerations

Three independent ONNX models need to fit within a total budget of ~150KB gzipped for browser delivery. Each model may end up with different tree counts after per-target tuning.

| Per-model config | Per-model raw | Per-model gzipped | 3-model total |
|---|---|---|---|
| 50 trees, depth 4 | ~60 KB | ~28 KB | ~85 KB |
| 40 trees, depth 4 | ~48 KB | ~22 KB | ~67 KB |
| 75 trees, depth 5 | ~150 KB | ~70 KB | ~210 KB |

The `render_delay` model likely needs the fewest trees, since its target is sparse (mostly zeros with a few high-value domains). It may converge with 30-40 trees while `main_thread_cost` needs 50+. Per-target tuning naturally handles this: Optuna's search over `n_estimators` will find a lower optimal value for sparser targets.

In practice, the primary deployment path is a precomputed lookup table (domain to 3-float vector JSON), so ONNX size is only a constraint for the runtime inference demonstration.

---

## What I Learned

**Independent models are simpler than they sound.** Training three XGBoost models instead of one multi-output model felt redundant at first, but it simplified everything downstream: per-target tuning, per-target SHAP analysis, per-target ONNX export, per-target size optimization. The overhead of a training loop is trivial. The clarity of "one model, one output, one responsibility" is worth it.

**Optimize for the metric you actually care about.** Training with `reg:squarederror` (RMSE) but tuning for Spearman rank correlation was the right call. The loss function that makes training stable isn't always the metric that makes predictions useful. Rank correlation captures what matters: getting the ordering right on each axis.

**Small datasets need heavy regularization.** With ~3,000 samples and 26 features, overfitting is the primary risk, not underfitting. The Optuna search consistently found high values for `min_child_weight` and `reg_lambda` across all three targets. The models need to learn broad patterns (scripts are costlier than pixels on the CPU axis; large transfers are costlier on the network axis), not memorize individual domains.
