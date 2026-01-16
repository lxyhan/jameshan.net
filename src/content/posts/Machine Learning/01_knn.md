---
title: '1: K-Nearest Neighbors'
pubDate: '2025-12-31'
---

K-Nearest Neighbors (KNN) is one of the simplest and most intuitive machine learning algorithms. It's a great starting point for understanding supervised learning because it requires no training phase—you just store the data and make predictions at inference time.

---

## Supervised Learning

Before diving into KNN, let's establish the supervised learning framework.

**Objective:** Learn a function that maps an input to an output based on given input-output pairs.

- Given a **training set** (labeled examples)
- Produce a **hypothesis/model** (function mapping inputs to outputs)
- To perform **predictions** on unseen data

### The Setup

**Input** is a vector $\mathbf{x} \in \mathbb{R}^D$:

$$
\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_D \end{bmatrix}
$$

Each scalar $x_i$ is a **feature** describing a characteristic of the input. Many data types (text, images, audio) can be represented as vectors.

**Output** types:
- **Classification**: $t$ is discrete (categorical)
- **Regression**: $t$ is continuous (real number)
- **Structured prediction**: $t$ is structured (e.g., text, image)

### Training Set Notation

The training set has $N$ labeled examples:

$$
\{(\mathbf{x}^{(1)}, t^{(1)}), (\mathbf{x}^{(2)}, t^{(2)}), \cdots, (\mathbf{x}^{(N)}, t^{(N)})\}
$$

**Notation convention:**
- Superscript $(i)$ = index of data point in dataset
- Subscript $j$ = index of feature in input vector

So $x_{12}^{(35)}$ means the 12th feature of the 35th data point.

### Evaluation

For classification, we measure **accuracy** as the fraction of correct predictions:

$$
\text{Accuracy} = \frac{\sum_{i=1}^{N} \mathbb{I}[t^{(i)} = y^{(i)}]}{N}
$$

where $\mathbb{I}[e] = 1$ if condition $e$ is true, 0 otherwise.

---

## Nearest Neighbours

The simplest approach: find the closest training point to your query and copy its label.

### Algorithm

1. Calculate distance between every training point $\mathbf{x}^{(i)}$ and new point $\mathbf{x}$
2. Find the training point $(\mathbf{x}^{(c)}, t^{(c)})$ closest to $\mathbf{x}$:
$$
\mathbf{x}^{(c)} = \arg\min_{\mathbf{x}^{(i)} \in \text{training set}} \text{distance}(\mathbf{x}^{(i)}, \mathbf{x})
$$
3. Predict $y = t^{(c)}$

### Distance Metrics

**Euclidean distance** ($L^2$ distance) — the default choice:

$$
\|\mathbf{x}^{(a)} - \mathbf{x}^{(b)}\|_2 = \sqrt{\sum_{j=1}^{D} (x_j^{(a)} - x_j^{(b)})^2}
$$

**Cosine similarity** — measures angle between vectors:

$$
\text{cosine}(\mathbf{x}^{(a)}, \mathbf{x}^{(b)}) = \frac{\mathbf{x}^{(a)} \cdot \mathbf{x}^{(b)}}{\|\mathbf{x}^{(a)}\|_2 \|\mathbf{x}^{(b)}\|_2}
$$

---

## Decision Boundaries

A **decision boundary** is the region where the classifier switches from predicting one class to another.

For nearest neighbors, decision boundaries are:
- **Perpendicular bisectors** between points of different classes
- Form a **Voronoi diagram** partitioning the space

The problem: 1-NN is extremely sensitive to noise. A single mislabeled point creates an "island" of wrong predictions around it.

---

## K-Nearest Neighbours

Instead of using just the closest point, use $K$ closest points and take a **majority vote**.

### Algorithm

1. Find the $K$ closest training points to $\mathbf{x}$
2. Predict by majority vote among $K$ nearest neighbours

### Choosing K

$K$ is a **hyperparameter**—a setting chosen before training that governs model behavior.

| $K$ too small | $K$ too large |
|---------------|---------------|
| Complex decision boundary | Smooth decision boundary |
| Captures fine-grained patterns | Misses local patterns |
| Sensitive to noise | Stable predictions |
| May **overfit** (high variance) | May **underfit** (high bias) |

Common heuristic: $K < \sqrt{N}$

---

## Training, Validation, and Test Sets

We split data into three sets for different purposes:

| Set | Purpose |
|-----|---------|
| **Training** | Learn model parameters |
| **Validation** | Tune hyperparameters, choose between models |
| **Test** | Measure generalization error (use only once, at the end) |

### Workflow with KNN

1. Split dataset into train/validation/test
2. For each $K \in \{1, 2, 3, ...\}$, "train" KNN on training set
3. Compute accuracy on validation set
4. Select $K$ with best validation accuracy
5. Report final accuracy on test set

**Critical:** Never use the test set for hyperparameter tuning. That defeats its purpose as an unbiased estimate of generalization.

---

## Limitations of KNN

### Curse of Dimensionality

As dimensions grow, data space expands **exponentially**. Points become very far apart—the "nearest" neighbor isn't meaningfully closer than any other point.

**Problem:** KNN struggles with high-dimensional data.

**Solutions:** Add more data or reduce dimensionality (PCA, feature selection).

### Sensitivity to Feature Scale

KNN relies on distance calculations. A feature with larger range dominates the distance.

**Example:** If one feature ranges 0-1 and another 0-1000, the second feature overwhelms the first.

**Solution:** Normalize features to mean = 0 and variance = 1:

$$
x_{\text{norm}} = \frac{x - \mu}{\sigma}
$$

### Computational Cost

- **Training:** $O(1)$ — just store the data
- **Inference:** $O(ND)$ — compute distance to all $N$ training points

For large datasets, this makes KNN impractical. Solutions include KD-trees, ball trees, or approximate nearest neighbor methods.

### No Learned Representation

KNN doesn't learn anything—it just memorizes. This means:
- No compression of knowledge
- Can't extrapolate beyond training data
- No insight into what makes classes different

---

## Summary

KNN is a **non-parametric**, **instance-based** learning algorithm:
- No training phase (lazy learning)
- Predictions based on local neighborhood
- Simple to understand and implement
- Works well for low-dimensional data with sufficient samples

Key decisions:
- Choice of $K$ (use validation set)
- Distance metric (Euclidean is default)
- Feature normalization (almost always necessary)

Despite its simplicity, KNN establishes important concepts we'll revisit: decision boundaries, bias-variance tradeoff, hyperparameter tuning, and the train/validation/test split.
