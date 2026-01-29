---
title: '1.2: Lab - MNIST Digit Classification'
pubDate: '2025-12-31'
---

Notes from CSC311 Lab 1: implementing k-Nearest Neighbors from scratch to classify handwritten digits using the MNIST dataset.

---

## Overview

**Goal:** Classify handwritten digit images (0-9) using k-NN.

**Dataset:** Subset of MNIST - 28x28 grayscale images of handwritten digits.

**Approach:**
1. Represent images as vectors
2. Implement vectorized distance computation
3. Implement k-NN prediction
4. Tune hyperparameter $k$ using validation set

---

## Part 1: Images as Vectors

### How Images Become Vectors

A 28x28 grayscale image has 784 pixels. Each pixel has an intensity value (0-255). We flatten the 2D image into a 1D vector of length 784.

```python
# Image shape: (28, 28)
# Flattened: (784,)
image_vector = image.flatten()
```

This lets us treat image classification as a standard ML problem where inputs are vectors in $\mathbb{R}^{784}$.

### Loading and Preprocessing

```python
from PIL import Image
import numpy as np

def load_image(path):
    img = Image.open(path)
    return np.array(img).flatten() / 255.0  # Normalize to [0,1]
```

Normalizing pixel values to [0,1] helps with numerical stability.

---

## Part 2: Vectorized Distance Computation

### The Challenge

For k-NN, we need to compute the distance from a query point to **every** training point. With $N$ training examples of dimension $D$, naive loops are too slow.

### Vectorized Euclidean Distance

Given:
- `X`: training data matrix of shape $(N, D)$
- `v`: query vector of shape $(D,)$

We want: distance from `v` to each row of `X`.

**Formula:**
$$
\text{dist}(v, x^{(i)}) = \|v - x^{(i)}\|_2 = \sqrt{\sum_{j=1}^{D} (v_j - x_j^{(i)})^2}
$$

**Vectorized implementation:**

```python
def dist_all(v, X):
    """
    Compute Euclidean distance from v to every row of X.

    Parameters:
        v: query vector of shape (D,)
        X: data matrix of shape (N, D)

    Returns:
        distances: array of shape (N,)
    """
    diff = X - v  # Broadcasting: (N, D) - (D,) = (N, D)
    sq_diff = diff ** 2  # (N, D)
    sum_sq = np.sum(sq_diff, axis=1)  # (N,)
    return np.sqrt(sum_sq)  # (N,)
```

**Key insight:** NumPy broadcasting automatically expands `v` to match `X`'s shape, then performs element-wise operations in parallel.

### Why Vectorization Matters

| Approach | Time for 5000 training points |
|----------|------------------------------|
| Python loops | ~10 seconds |
| NumPy vectorized | ~0.01 seconds |

Vectorization leverages optimized C code and SIMD instructions under the hood.

---

## Part 3: k-NN Prediction

### Algorithm Steps

1. Compute distances from query to all training points
2. Find indices of $k$ smallest distances
3. Get labels of those $k$ neighbors
4. Return most common label (majority vote)

### Implementation

```python
def predict_knn(v, X, t, k):
    """
    Predict label for query v using k-NN.

    Parameters:
        v: query vector of shape (D,)
        X: training data of shape (N, D)
        t: training labels of shape (N,)
        k: number of neighbors

    Returns:
        predicted label
    """
    # Step 1: Compute all distances
    distances = dist_all(v, X)

    # Step 2: Find k nearest neighbors
    # argsort returns indices that would sort the array
    nearest_indices = np.argsort(distances)[:k]

    # Step 3: Get their labels
    nearest_labels = t[nearest_indices]

    # Step 4: Majority vote
    # np.bincount counts occurrences of each integer
    counts = np.bincount(nearest_labels.astype(int))
    return np.argmax(counts)
```

### Computing Accuracy

```python
def compute_accuracy(X_new, t_new, X_train, t_train, k):
    """
    Compute accuracy of k-NN on a dataset.
    """
    correct = 0
    for i in range(len(X_new)):
        pred = predict_knn(X_new[i], X_train, t_train, k)
        if pred == t_new[i]:
            correct += 1
    return correct / len(X_new)
```

---

## Part 4: Hyperparameter Tuning

### Why Tune k?

Different values of $k$ give different bias-variance tradeoffs:

| Small $k$ | Large $k$ |
|-----------|-----------|
| Low bias, high variance | High bias, low variance |
| Sensitive to noise | Smooth predictions |
| May overfit | May underfit |

### Grid Search

Try different values and pick the best based on **validation accuracy**:

```python
ks = range(1, 11)
valid_accuracies = []

for k in ks:
    acc = compute_accuracy(X_valid, t_valid, X_train, t_train, k)
    valid_accuracies.append(acc)
    print(f"k={k}: validation accuracy = {acc:.4f}")

best_k = ks[np.argmax(valid_accuracies)]
print(f"Best k: {best_k}")
```

### Typical Results

The validation accuracy curve often looks like:
- $k=1$: moderate accuracy (too sensitive to noise)
- $k=3-7$: peak accuracy (good balance)
- $k$ large: declining accuracy (too smooth, loses local patterns)

---

## Part 5: Feature Normalization

### The Problem

MNIST pixels are already in [0, 255], so all features have the same scale. But in general datasets, features can have vastly different ranges.

**Example:** If feature A ranges [0, 1] and feature B ranges [0, 1000], then B dominates the Euclidean distance.

### The Solution: Standardization

Normalize each feature to have mean 0 and standard deviation 1:

$$
x_{\text{norm}} = \frac{x - \mu}{\sigma}
$$

```python
# Compute mean and std on TRAINING data only
mean = X_train.mean(axis=0)
std = X_train.std(axis=0)

# Apply to all sets
X_train_norm = (X_train - mean) / std
X_valid_norm = (X_valid - mean) / std
X_test_norm = (X_test - mean) / std
```

**Important:** Compute statistics on training data only, then apply to validation/test. Otherwise you're "peeking" at test data.

---

## Key Takeaways

1. **Images can be vectors** - flatten 2D arrays into 1D, treat pixels as features

2. **Vectorization is essential** - use NumPy broadcasting for fast distance computation

3. **k-NN is simple but limited:**
   - No training phase (lazy learning)
   - Expensive at inference time: $O(ND)$
   - Struggles with high dimensions (curse of dimensionality)

4. **Hyperparameter tuning matters** - use validation set to choose $k$

5. **Never touch the test set** until final evaluation

6. **Normalize features** when they have different scales

---

## Code Summary

```python
# Distance computation
def dist_all(v, X):
    return np.sqrt(np.sum((X - v) ** 2, axis=1))

# k-NN prediction
def predict_knn(v, X, t, k):
    distances = dist_all(v, X)
    nearest_idx = np.argsort(distances)[:k]
    nearest_labels = t[nearest_idx]
    return np.argmax(np.bincount(nearest_labels.astype(int)))

# Accuracy
def compute_accuracy(X_new, t_new, X_train, t_train, k):
    correct = sum(
        predict_knn(X_new[i], X_train, t_train, k) == t_new[i]
        for i in range(len(X_new))
    )
    return correct / len(X_new)
```
