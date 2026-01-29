---
title: '3.3: Lab - Linear Regression with Gradient Descent'
pubDate: '2025-01-28'
---

Notes from CSC311 Lab 3: implementing linear regression from scratch using gradient descent, then comparing it to sklearn's built-in solution.

---

## Overview

**Goal:** Predict pond air temperature at UTM using forest measurements.

**Approach:**
1. Implement linear regression from scratch using gradient descent
2. Compare to sklearn's closed-form solution
3. Understand the practical differences

---

## Part 1: Data and NumPy Basics

### NumPy Array Shapes

The number of dimensions is how many numbers are in the shape tuple, not the values themselves:

```python
(5,)      # 1D array - just 5 numbers in a row
(n, 5)    # 2D array - n rows, 5 columns
(n, 5, 3) # 3D array - like a stack of tables
```

So `(n, 5)` means "n by 5" - n rows and 5 columns. It's **not** a 5D array.

**The difference between `(n,)` and `(n, 1)`:**
- `(n,)` is a 1D array - a flat list of numbers
- `(n, 1)` is a 2D array - a column vector

They hold the same data but NumPy treats them differently for operations like concatenation.

### Building the Data Matrix

For the bias term, we need to add a column of 1s:

```python
ones = np.ones((n, 1))  # shape (n, 1) - NOT (n,)!
X = np.concatenate([X_features, ones], axis=1)
```

The 1s column lets us fold the bias into the weight vector instead of adding it separately.

### Why Split Data by Date?

Instead of random split, we used:
- **Training:** Sept-Oct 2016
- **Validation:** Sept 2017
- **Test:** Oct 2017

**Why this is better:**
1. In real life, we'd predict *future* temperatures, not past ones
2. Weather data points close in time are correlated - random split would let the model "cheat" by interpolating
3. Testing on the most recent data simulates real deployment

---

## Part 2: Implementing the Model

### Prediction Function

Super simple - just matrix multiplication:

```python
def pred(w, X):
    return X @ w  # or np.dot(X, w)
```

`X` is `(N, 5)`, `w` is `(5,)`, result is `(N,)` - one prediction per sample.

### Mean Squared Error

```python
def mse(w, X, t):
    n = X.shape[0]
    y = pred(w, X)
    err = y - t
    return np.sum(err ** 2) / (2 * n)
```

The `2` in the denominator cancels out when we take the derivative.

### The Gradient

The gradient is a vector of partial derivatives - one for each weight:

$$
\nabla \text{MSE} = \frac{1}{N} \mathbf{X}^\top (\mathbf{y} - \mathbf{t})
$$

```python
def grad(w, X, t):
    return np.dot(X.T, (pred(w, X) - t)) / len(X)
```

**Why X transpose?**
- `X.T` is `(5, N)`
- `(y - t)` is `(N,)`
- Result is `(5,)` - one gradient per weight

### Gradient Checking with Finite Differences

To verify the gradient implementation, use the definition of derivative:

$$
\frac{\partial \text{MSE}}{\partial w_j} \approx \frac{\text{MSE}(w_j + h) - \text{MSE}(w_j)}{h}
$$

```python
h = 0.0001
for j in range(5):
    perturbed_w = np.copy(w)
    perturbed_w[j] += h
    estimate = (mse(perturbed_w, X, t) - mse(w, X, t)) / h
    print(f"grad[{j}]: {grad(w, X, t)[j]}, estimate: {estimate}")
```

The values should be very close (not exact because finite difference is an approximation).

---

## Part 3: Gradient Descent

### The Algorithm

```python
def solve_via_gradient_descent(alpha, niter, X_train, t_train):
    w = np.zeros(X_train.shape[1])

    for it in range(niter):
        w = w - alpha * grad(w, X_train, t_train)

    return w
```

We **subtract** because the gradient points uphill (toward higher error), and we want to go downhill.

### Learning Rate Effects

**Too low:** Takes tiny steps, barely makes progress. Would eventually converge but takes forever.

**Too high:** Steps so big you overshoot the minimum. Error explodes instead of decreasing.

**Just right:** Error drops quickly at first (steep curve), then levels off as it approaches the minimum.

### Early Stopping Implementation

Instead of guessing iterations, stop when validation MSE stops improving:

```python
def solve_with_early_stopping(alpha, max_iter, patience):
    w = np.zeros(X_train.shape[1])
    best_val_mse = float('inf')
    best_weights = w.copy()
    iters_without_improvement = 0

    for i in range(max_iter):
        w = w - alpha * grad(w, X_train, t_train)
        val_mse = mse(w, X_valid, t_valid)

        if val_mse < best_val_mse:
            best_val_mse = val_mse
            best_weights = w.copy()
            iters_without_improvement = 0
        else:
            iters_without_improvement += 1

        if iters_without_improvement >= patience:
            break

    return best_weights  # Return BEST, not final!
```

**Patience** is how many iterations we wait without improvement before stopping.

### Hyperparameter Tuning

Search over different alpha values:

```python
for alpha in np.linspace(0.00005, 0.0005, 20):
    w, val_mse, best_iter = solve_with_early_stopping(alpha=alpha, ...)
```

Pattern observed:
- Low alpha: converges slowly but stably
- High alpha: overshoots immediately (stops at iter 0)
- Sweet spot in between

**Best result:** `alpha = 0.000168`, stopped at iteration 9170, validation MSE = 0.56

---

## Part 4: sklearn Comparison

### The Closed-Form Solution

sklearn's `LinearRegression` solves directly:

$$
\mathbf{w} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{t}
$$

No iterations, no learning rate, no hyperparameters. Just one matrix calculation.

```python
from sklearn.linear_model import LinearRegression

lr = LinearRegression(fit_intercept=False)
lr.fit(X_train, t_train)

print("Validation MSE:", mse(lr.coef_, X_valid, t_valid))
# Output: 0.53
```

### Results Comparison

| Method | Validation MSE |
|--------|----------------|
| Our gradient descent | 0.56 |
| sklearn closed-form | 0.53 |

sklearn is better because it finds the **exact** optimal weights, while gradient descent approximates:
1. Fixed step size causes oscillation around the minimum
2. We stopped based on validation MSE, not full training convergence

The difference is small in practice (~0.7-0.8°C RMSE for both).

### When Gradient Descent Matters

For linear regression, just use the closed-form solution. But gradient descent is essential for models that **don't have a closed-form solution** (neural networks, etc.).

---

## Part 5: Test Set Philosophy

### Why Not Use Test Set to Choose Models?

The test set should only be touched **once** at the very end.

If you use it to decide between models, it's no longer truly "unseen" data. You're indirectly fitting to it by making choices based on it.

**The workflow:**
1. Use training data to fit models
2. Use validation data to tune hyperparameters and pick the best model
3. Use test data **ONCE** to report final performance

### Test Results

| Set | MSE |
|-----|-----|
| Validation | 0.53 |
| Test | 2.15 |

Test MSE is much worse because test data (Oct 2017) is from a different time period than training (Sept-Oct 2016). October weather patterns differ from what the model learned.

This is the point of date-based splitting - it shows realistic performance on truly future data, which is often worse than validation suggests. RMSE of $\sqrt{2.15} \approx 1.47°C$.

---

## Key Takeaways

1. **Gradient descent is iterative approximation** - gets close but never exactly there with a fixed learning rate

2. **Early stopping prevents overfitting** and removes the need to guess iterations

3. **Validation data is for making decisions** (hyperparameters, model selection) - test data is only for final evaluation

4. **Date-based splits are more realistic** for time series data than random splits

5. **sklearn's closed-form solution is better for linear regression** - gradient descent is for when there's no closed form

6. **NumPy shapes are crucial** - understand `(n,)` vs `(n, 1)`

7. **Hyperparameter tuning is trial and error** - try values, see what works, pick the best

---

## Formulas to Remember

**Linear regression prediction:**
$$\mathbf{y} = \mathbf{X} \mathbf{w}$$

**Mean squared error:**
$$\text{MSE} = \frac{1}{2N} \sum_{i=1}^{N} (y^{(i)} - t^{(i)})^2$$

**Gradient of MSE:**
$$\nabla \text{MSE} = \frac{1}{N} \mathbf{X}^\top (\mathbf{y} - \mathbf{t})$$

**Gradient descent update:**
$$\mathbf{w} \leftarrow \mathbf{w} - \alpha \cdot \nabla \text{MSE}$$

**Closed-form solution:**
$$\mathbf{w} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{t}$$
