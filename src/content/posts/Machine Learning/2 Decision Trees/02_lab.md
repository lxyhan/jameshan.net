---
title: '2.2: Lab - Heart Disease Prediction'
pubDate: '2025-12-31'
---

Notes from CSC311 Lab 2: using decision trees to predict heart disease from NHANES health survey data, with a focus on hyperparameter tuning and model interpretation.

---

## Overview

**Goal:** Predict heart disease using health survey features.

**Dataset:** NHANES (National Health and Nutrition Examination Survey) - 8000 samples with health/demographic features.

**Key concepts:**
1. Exploratory data analysis
2. Feature encoding (one-hot encoding)
3. Decision tree visualization and interpretation
4. Hyperparameter tuning via grid search
5. Understanding underfitting vs overfitting

---

## Part 1: Data Exploration

### The Dataset

Features include:
- **Demographics:** gender, race/ethnicity, age, family income
- **Health indicators:** BMI, blood pressure, blood cholesterol
- **Behavioral:** drinks alcohol, calories consumed
- **Symptoms:** chest pain history

Target: `target_heart` (1 = has heart disease, 0 = doesn't)

### Why Balance the Dataset?

The real prevalence of heart disease is ~8%. We artificially balanced to 50/50.

**Why?** With 92% negative cases, the model would learn to always predict "no heart disease" and achieve 92% accuracy while being useless for detection. Balanced data forces the model to actually learn distinguishing features.

### Exploratory Analysis

**Informative features** (show clear differences between groups):
- **Age**: Heart disease patients tend to be older
- **Chest pain**: 50% of heart disease cases reported chest pain vs only 20% without

**Less informative features** (similar distributions):
- **Blood cholesterol**: Similar between groups
- **Drink alcohol**: Nearly identical proportions (~70%) in both groups
- **Calories, BMI**: Overlapping distributions

---

## Part 2: Feature Encoding

### Why One-Hot Encoding?

Decision trees split on thresholds like `feature < 2.5`. For categorical variables with arbitrary numeric codes (e.g., race: 1=Mexican American, 2=Hispanic, 3=White...), this creates meaningless groupings.

**Problem:** Split `race < 2.5` groups Mexican American and Hispanic together against everyone else, based purely on arbitrary numbering.

**Solution:** One-hot encoding creates separate binary features:
- `re_hispanic`: 1 if Hispanic, 0 otherwise
- `re_white`: 1 if White, 0 otherwise
- etc.

Now each category is independent.

### Why No Normalization?

Unlike k-NN, decision trees don't need normalization because:
1. Trees split on one feature at a time (features don't compete)
2. Normalization is monotonic (preserves ordering)
3. Split thresholds only care about relative ordering, not magnitude

---

## Part 3: Building and Visualizing Trees

### Using sklearn

```python
from sklearn.tree import DecisionTreeClassifier

tree = DecisionTreeClassifier(
    criterion="entropy",  # or "gini"
    max_depth=3
)
tree.fit(X_train, t_train)

print("Training Accuracy:", tree.score(X_train, t_train))
print("Validation Accuracy:", tree.score(X_valid, t_valid))
```

### Interpreting the Tree

Each node shows:
- **Feature and threshold** being tested
- **Entropy** at that node
- **Samples** reaching the node
- **Value** [count_class_0, count_class_1]
- **Class** prediction (majority)

**To classify a point:** Start at root, follow branches based on feature tests, predict the class at the leaf.

---

## Part 4: Underfitting vs Overfitting

### max_depth

| Setting | Behavior |
|---------|----------|
| `max_depth=1` | **Underfitting** - Only one split, can't capture patterns. Both train and validation accuracy ~68% |
| `max_depth=30` | **Overfitting** - Memorizes training data. Train accuracy 100%, validation ~96% |

### min_samples_split

| Setting | Behavior |
|---------|----------|
| `min_samples_split=5000` | **Underfitting** - Stops splitting early, tree too shallow |
| `min_samples_split=2` | **Overfitting** - Splits until leaves have 2 samples, memorizes noise |

### Diagnosing the Problem

| Symptom | Diagnosis |
|---------|-----------|
| Low train accuracy, low validation accuracy | Underfitting |
| High train accuracy, lower validation accuracy | Overfitting |
| Similar train and validation accuracy | Good fit |

---

## Part 5: Hyperparameter Tuning

### Grid Search

Try all combinations of hyperparameters:

```python
def build_all_models(max_depths, min_samples_splits, criterion):
    results = {}
    for d in max_depths:
        for s in min_samples_splits:
            tree = DecisionTreeClassifier(
                max_depth=d,
                min_samples_split=s,
                criterion=criterion
            )
            tree.fit(X_train, t_train)
            results[(d, s)] = {
                'train': tree.score(X_train, t_train),
                'val': tree.score(X_valid, t_valid)
            }
    return results
```

### Finding Best Parameters

```python
criterions = ["entropy", "gini"]
max_depths = [1, 5, 10, 15, 20, 25, 30, 50, 100]
min_samples_splits = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]

for criterion in criterions:
    results = build_all_models(max_depths, min_samples_splits, criterion)

    best_params = max(results.keys(), key=lambda k: results[k]['val'])
    print(f"Best for {criterion}: {best_params}")
    print(f"Validation accuracy: {results[best_params]['val']}")
```

---

## Part 6: Beyond Accuracy

### The Problem with Accuracy

Two models with 95% accuracy can make very different types of errors:
- **False negatives:** Missing actual heart disease (dangerous!)
- **False positives:** Flagging healthy patients for extra tests (inconvenient)

### In Healthcare

A doctor would prefer a model that:
- Minimizes false negatives (don't miss real cases)
- Accepts more false positives (extra testing is safer than missing disease)

This is why accuracy alone isn't sufficient for evaluating models in high-stakes domains.

---

## Key Takeaways

1. **Balance your dataset** when the minority class is important

2. **One-hot encode categorical variables** to avoid arbitrary numeric ordering

3. **Decision trees don't need normalization** - splits are based on ordering, not magnitude

4. **Visualize your tree** to understand what the model learned

5. **Use validation set for hyperparameter tuning:**
   - `max_depth` controls complexity
   - `min_samples_split` controls when to stop splitting
   - `criterion` (entropy vs gini) usually similar

6. **Accuracy isn't everything** - consider the costs of different error types

7. **Never use test set for model selection** - only for final evaluation

---

## Code Summary

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# One-hot encoding
data_encoded = np.stack([
    data["gender"] == 2,           # female indicator
    data["race"] == 3,             # white indicator
    data["age"],                   # numeric, no change
    # ... more features
], axis=1)

# Train/validation/test split
X_tv, X_test, t_tv, t_test = train_test_split(X, t, test_size=0.19)
X_train, X_valid, t_train, t_valid = train_test_split(X_tv, t_tv, test_size=0.23)

# Grid search
best_val_acc = 0
best_params = None

for depth in [1, 5, 10, 20]:
    for min_split in [2, 8, 32, 128]:
        tree = DecisionTreeClassifier(max_depth=depth, min_samples_split=min_split)
        tree.fit(X_train, t_train)
        val_acc = tree.score(X_valid, t_valid)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_params = (depth, min_split)

# Final evaluation on test set
final_tree = DecisionTreeClassifier(max_depth=best_params[0],
                                     min_samples_split=best_params[1])
final_tree.fit(X_train, t_train)
print("Test accuracy:", final_tree.score(X_test, t_test))
```
