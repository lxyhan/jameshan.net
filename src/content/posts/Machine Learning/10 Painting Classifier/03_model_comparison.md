---
title: 'Model Comparison: Logistic Regression vs Random Forest vs MLP'
pubDate: '2026-03-17'
---

Comparing three model families on a tabular classification task — how we tuned each independently using grouped cross-validation and why the MLP won by a narrow margin.

---

## The Three Models

We chose model families that span a range of complexity and inductive biases, all appropriate for mixed-type tabular data:

### Logistic Regression

A linear probabilistic classifier using softmax for multiclass prediction. Despite its simplicity, it's a principled baseline — regularization prevents overfitting on the high-dimensional TF-IDF block (600 features from text alone). Solved via SAGA with elastic-net penalty.

**Hyperparameter grid (12 configurations):**
- Inverse regularization strength $C \in \{0.05, 0.1, 0.5, 1, 5, 10\}$
- L1 ratio $\in \{0, 1\}$ (pure L2 vs pure L1)

**Best config:** $C = 0.5$, pure L2 — macro-F1 = 0.900

### Random Forest

An ensemble of decision trees that naturally handles mixed feature types and non-linear interactions without explicit normalization. Averaging over many trees reduces variance while maintaining low bias.

**Hyperparameter grid (24 configurations):**
- Number of trees $\in \{100, 200\}$
- Max depth $\in \{5, 10, \text{None}\}$
- Min samples per leaf $\in \{1, 5\}$
- Feature sampling $\in \{\texttt{sqrt}, \texttt{log2}\}$

**Best config:** 100 trees, max depth 10, min samples per leaf 1, sqrt sampling — macro-F1 = 0.895

### Multi-Layer Perceptron

A feedforward neural network that can learn arbitrary non-linear feature interactions. Given the small training set (~1,119 rows), we restricted the search to shallow architectures (1-2 hidden layers) to limit overfitting risk. Early stopping (patience of 20 epochs) provides an additional safeguard.

**Hyperparameter grid (24 configurations):**
- Hidden architecture $\in \{(64), (128), (256), (128, 64)\}$
- Learning rate $\in \{0.001, 0.005, 0.01\}$
- L2 weight decay $\alpha \in \{0.0001, 0.001\}$
- Batch size: 32 (fixed)

**Best config:** single hidden layer of 256 units, lr = 0.001, $\alpha$ = 0.001 — macro-F1 = 0.910

## Validation Strategy

All three models were tuned using **5-fold grouped cross-validation** on the training split (70% of data). The grouping is critical: since each student contributed 3 rows (one per painting), folds are constructed by student ID so all three responses from the same student always fall in the same fold.

For each candidate configuration:
1. Refit the preprocessor from scratch on the CV training fold
2. Transform the held-out fold using those fitted statistics
3. Train the model and evaluate

This means preprocessing statistics (means, TF-IDF vocabularies, etc.) never see validation data — preventing any leakage through the feature pipeline.

## Results

| Model | Val Accuracy | Val Macro-F1 |
|---|---|---|
| Logistic Regression | 90.0% | 0.900 |
| Random Forest | 89.6% | 0.895 |
| **MLP** | **91.1%** | **0.910** |

All three models performed within 1.5 percentage points of each other after tuning. This suggests the feature representation is more important than model choice — once the preprocessing pipeline is solid, even a linear model gets 90% of the way there.

The MLP's advantage likely comes from its ability to learn interactions between the different feature blocks (numerical, ordinal, TF-IDF, multi-hot) that the linear model can't capture and the random forest captures less efficiently.

## Why Macro-F1?

We used macro-averaged F1 as the primary metric rather than accuracy. Macro-F1 computes F1 per class then averages, treating all three paintings equally regardless of sample size. This catches cases where a model does well overall but fails on one specific painting — which matters here because the three paintings have very different emotional characters.

When accuracy and macro-F1 disagreed during tuning, we preferred macro-F1.

## Test Set Access

The test set (30% of data) was held out entirely and accessed **only once**, after model selection was complete. The selected MLP achieved:
- Test accuracy: 80.2%
- Test macro-F1: 0.804

The per-fold validation scores were stable (0.889, 0.893, 0.871, 0.941, 0.867 — std = 0.027), confirming consistent learning with no single outlier fold driving the average.
