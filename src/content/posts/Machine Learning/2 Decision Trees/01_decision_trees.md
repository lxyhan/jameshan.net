---
title: '2.1: Decision Trees'
pubDate: '2025-12-31'
---

Decision trees are simple but powerful learning algorithms widely used in practice, including Kaggle competitions. They mimic human decision-making processes and can achieve excellent performance.

## Learning Objectives

By the end of this topic, you should be able to:
- Classify a new data point using a decision tree
- Draw the decision boundaries defined by a decision tree
- Calculate the entropy of a distribution
- Calculate the expected information gain of splitting on a feature
- Construct a decision tree by recursively selecting features that maximize information gain
- Describe the advantages and limitations of decision trees

---

## Components of a Decision Tree

A decision tree consists of three main components:

1. **Internal nodes**: Each internal node tests a feature
2. **Branches**: The feature test determines which branch to follow
3. **Leaf nodes**: Each leaf node contains a prediction

### Example: Citrus Fruit Classification

Consider a dataset of citrus fruits with weight and height features:

| Weight | Height | Fruit  |
|--------|--------|--------|
| 6.0    | 4.0    | Orange |
| 6.0    | 8.0    | Lemon  |
| 7.0    | 8.0    | Orange |
| 7.0    | 9.0    | Orange |
| 8.0    | 9.0    | Orange |
| 7.0    | 10.0   | Lemon  |
| 6.5    | 9.0    | Lemon  |

A decision tree for this data might first test `Height <= 9.5`, then `Weight <= 6.75`, creating regions that separate lemons from oranges.

### Classifying a Data Point

To classify a new point, start at the root and follow the branches based on feature tests until reaching a leaf node. The leaf's prediction is the classification.

For example, given $\mathbf{x}^{(1)} = \begin{bmatrix} 7 \\ 6 \end{bmatrix}$ (weight=7, height=6):
- Height 6 <= 9.5? Yes → go left
- Weight 7 > 6.75? Yes → go right
- Prediction: **Orange**

### Decision Boundaries

Decision trees create axis-aligned decision boundaries. Each split divides the feature space with a line parallel to one of the axes. The resulting regions form rectangles in 2D.

---

## Classification vs. Regression Trees

Decision trees can handle both classification and regression tasks:

**Classification Tree**: At each leaf node, the prediction is the **most common target value** among all data points that reach that leaf.

**Regression Tree**: At each leaf node, the prediction is the **mean target value** among all data points that reach that leaf.

---

## Building a Useful Tree

### Why Not Find the Optimal Tree?

The optimal tree classifies all training examples correctly, but:
- This can require one leaf per example and won't generalize
- Finding the smallest such tree is **NP-complete**
- Decision trees are universal function approximators (can represent any function)

Instead, we aim to learn a **useful** tree using a greedy strategy.

### Greedy Feature Selection

At each step, choose the feature (and split) that **most reduces a loss function**.

Common loss functions:
- **Uncertainty** (entropy)
- **Impurity** (Gini index)
- **Squared error** (for regression)

---

## Measuring Uncertainty with Entropy

**Entropy** quantifies the uncertainty inherent in a distribution's possible outcomes.

### Formula

For a random variable $X$ with possible values $\mathcal{X}$:

$$H(X) = -\sum_{x \in \mathcal{X}} p(x) \log_2 p(x)$$

### Properties of Entropy

**High Entropy**:
- Uniform-like distribution
- Flat histogram
- Sampled values are less predictable

**Low Entropy**:
- Concentrated on a few outcomes
- Peaked histogram
- Sampled values are more predictable

### Binary Distribution Examples

For a binary distribution $(p, 1-p)$:

| Distribution | Entropy |
|-------------|---------|
| (0.5, 0.5)  | 1.0     |
| (0.3, 0.7)  | 0.881   |
| (0.1, 0.9)  | 0.469   |
| (0.01, 0.99)| 0.081   |

Maximum entropy occurs at $p = 0.5$ (most uncertain), and entropy approaches 0 as the distribution becomes more skewed (more certain).

---

## Information Gain

We want to know about a target variable $Y$, but instead of observing $Y$ directly, we observe a feature $X$. **Information gain** measures how much observing $X$ reduces our uncertainty about $Y$.

### Formulas

**Entropy of Y (before observing X)**:
$$H(Y) = -\sum_{y \in Y} p(y) \log_2 p(y)$$

**Expected Conditional Entropy (after observing X)**:
$$H(Y|X) = -\sum_{x \in X} p(x) \sum_{y \in Y} p(y|x) \log_2 p(y|x)$$

**Information Gain** (also called mutual information):
$$IG(Y|X) = H(Y) - H(Y|X)$$

### Worked Example: Fruit Classification

Using our citrus dataset, let's calculate the information gain from splitting on `Weight <= 6.75`.

**Step 1: Calculate $H(Y)$**

Count: 3 lemons, 4 oranges (total 7)

$$H(Y) = -\frac{3}{7}\log_2\frac{3}{7} - \frac{4}{7}\log_2\frac{4}{7} = 0.985$$

**Step 2: Build the joint probability table**

|               | Orange | Lemon |
|---------------|--------|-------|
| Weight <= 6.75 | 1/7    | 2/7   |
| Weight > 6.75  | 3/7    | 1/7   |

**Step 3: Calculate conditional entropies**

For `Weight <= 6.75` (3 samples: 1 orange, 2 lemons):
$$H(Y|X = \text{weight} \leq 6.75) = -\frac{1}{3}\log_2\frac{1}{3} - \frac{2}{3}\log_2\frac{2}{3} = 0.918$$

For `Weight > 6.75` (4 samples: 3 oranges, 1 lemon):
$$H(Y|X = \text{weight} > 6.75) = -\frac{3}{4}\log_2\frac{3}{4} - \frac{1}{4}\log_2\frac{1}{4} = 0.811$$

**Step 4: Calculate expected conditional entropy**

$$H(Y|X) = \frac{3}{7}(0.918) + \frac{4}{7}(0.811) = 0.857$$

**Step 5: Calculate information gain**

$$IG(Y|X) = H(Y) - H(Y|X) = 0.985 - 0.857 = 0.128$$

### Properties of Information Gain

| Property | Formula |
|----------|---------|
| Entropy is non-negative | $H(X) \geq 0$ |
| Observing never increases uncertainty | $H(Y|X) \leq H(Y)$ |
| If X and Y are independent | $H(Y) = H(Y|X) \Rightarrow IG(Y|X) = 0$ |
| If X fully determines Y | $H(Y|X) = 0 \Rightarrow IG(Y|X) = H(Y)$ |

---

## Learning a Decision Tree Recursively

### Algorithm

```
function BuildTree(data):
    if should_stop_splitting(data):
        return create_leaf_node(data)

    best_feature, best_split = find_best_split(data)  # maximize info gain
    left_data, right_data = split_data(data, best_feature, best_split)

    left_child = BuildTree(left_data)
    right_child = BuildTree(right_data)

    return create_internal_node(best_feature, best_split, left_child, right_child)
```

### Stopping Criteria

We stop splitting when:
- All examples have the same label (entropy = 0)
- No features left to split on
- A **depth limit** is reached
- The loss stops decreasing enough (minimum information gain threshold)
- Too few examples remain in a node

---

## Preventing Overfitting

Decision trees are prone to overfitting, especially when grown to full depth.

### Pruning Strategies

- **Pre-pruning**: Set maximum depth, minimum samples per leaf, minimum information gain
- **Post-pruning**: Grow full tree, then remove nodes that don't improve validation performance

### Hyperparameter Selection

Use a **validation set** to select:
- Stopping criteria
- Split thresholds
- Maximum depth

### Ensemble Methods

Combining multiple trees often improves performance:

**Bagging (Bootstrap Aggregating)**:
- Train many trees on bootstrap samples of the data
- Average predictions (regression) or vote (classification)
- Example: **Random Forests**

**Boosting**:
- Train trees sequentially
- Each tree focuses on examples the previous trees got wrong
- Examples: **AdaBoost**, **Gradient Boosting**, **XGBoost**

---

## Continuous vs. Discrete Features

**Continuous features**: Split using thresholds (e.g., `Height <= 9.5`)
- Need to search for the best threshold
- Common approach: sort values and try splits between adjacent values

**Discrete features**: Can split on equality (e.g., `Color == Red`)
- Binary: creates two branches
- Multi-valued: can create multiple branches or use binary splits

---

## Advantages and Limitations

### Advantages
- Easy to understand and interpret
- Handles both numerical and categorical features
- Requires little data preprocessing
- Implicit feature selection
- Can capture non-linear relationships

### Limitations
- Prone to overfitting
- Can be unstable (small data changes lead to different trees)
- Axis-aligned boundaries may not fit data well
- Greedy algorithm doesn't guarantee global optimum

---

## Summary

| Concept | Key Formula/Idea |
|---------|-----------------|
| Entropy | $H(X) = -\sum p(x) \log_2 p(x)$ |
| Conditional Entropy | $H(Y|X) = \sum p(x) H(Y|X=x)$ |
| Information Gain | $IG(Y|X) = H(Y) - H(Y|X)$ |
| Tree Building | Greedily maximize information gain |
| Stopping | Depth limit, min samples, min gain |
| Overfitting Prevention | Pruning, ensembles |
