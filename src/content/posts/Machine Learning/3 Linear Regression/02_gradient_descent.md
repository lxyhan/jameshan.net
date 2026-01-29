---
title: '3.2: Gradient Descent'
pubDate: '2025-01-28'
---

Gradient descent is an iterative optimization algorithm used to find the minimum of a function. While linear regression has a closed-form solution, gradient descent provides a more general approach that scales better to high dimensions and generalizes to other models.

---

## Why Use Gradient Descent?

| Aspect | Direct Solution | Gradient Descent |
|--------|----------------|------------------|
| **Complexity per step** | $O(D^3)$ for matrix inversion | $O(ND)$ per update |
| **Implementation** | Requires matrix inversion | Simple iterative updates |
| **Generalization** | Only works for specific problems | Works for any differentiable loss |
| **Memory** | Must store and invert $\mathbf{X}^\top\mathbf{X}$ | Only needs gradients |

**Key insight:** Each gradient descent update costs $O(ND)$ rather than $O(D^3)$ for matrix inversion, making it much cheaper when $D$ is large (high-dimensional data).

---

## What is Gradient Descent?

An iterative method to find the minima of a function.

**Procedure:**
1. Start with a random point $\mathbf{w}_0$
2. Apply an update rule iteratively until a stopping condition is met

---

## The Update Rule

### Direction: Which Way to Move?

The gradient $\nabla_\mathbf{w} \mathcal{E}(\mathbf{w})$ points in the direction of **steepest increase**.

To minimize, we move in the **opposite direction**:

- If the derivative is **negative** at some point, we want to **increase** $w$ (move right toward the minimum)
- If the derivative is **positive** at some point, we want to **decrease** $w$ (move left toward the minimum)

**Conclusion:** The sign of the update should be **opposite** to the sign of the gradient.

### Magnitude: How Far to Move?

Each update's size should be **proportional to** the gradient's magnitude:

- When the curve is **steep**, gradient magnitude is **large** → take **large** steps
- When the curve is **flat**, gradient magnitude is **small** → take **small** steps

This is natural: far from the minimum (steep region), take big steps. Near the minimum (flat region), take small steps to avoid overshooting.

### The Update Formula

Combining direction and magnitude:

$$
\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})
$$

Or for each weight individually:

$$
w_0 \leftarrow w_0 - \alpha \frac{\partial \mathcal{E}(\mathbf{w})}{\partial w_0}, \quad \ldots \quad w_D \leftarrow w_D - \alpha \frac{\partial \mathcal{E}(\mathbf{w})}{\partial w_D}
$$

Where:
- $\alpha$ is the **learning rate** (a hyperparameter)
- $\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})$ is the gradient of the cost function

---

## Gradient Descent for Linear Regression

Recall the gradient for MSE loss:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t})
$$

Substituting into the update rule:

$$
\mathbf{w} \leftarrow \mathbf{w} - \frac{\alpha}{N} \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t})
$$

Or equivalently, summing over individual examples:

$$
\mathbf{w} \leftarrow \mathbf{w} - \frac{\alpha}{N} \sum_{i=1}^{N} (\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)}) \mathbf{x}^{(i)}
$$

---

## Choosing the Learning Rate $\alpha$

The learning rate is a critical **hyperparameter**:

| $\alpha$ too small | $\alpha$ too large |
|-------------------|-------------------|
| Takes too long to converge | May oscillate around minimum |
| Many iterations needed | May diverge completely |
| Wastes computation | Training becomes unstable |

**Visualizing the problem:**
- Too small: tiny steps, barely makes progress after many iterations
- Too large: steps so big you overshoot the minimum, error explodes

**In practice:**
- Start with a reasonable value (e.g., 0.01 or 0.001)
- Monitor the cost function, it should decrease
- Use **learning rate schedules** that decrease $\alpha$ over time
- Consider adaptive methods like **Adam**

---

## Termination Criteria

### When to Stop Iterating?

**In theory:** Stop when $\mathbf{w}$ stops changing (convergence)

**In practice:**

1. **Cost threshold:** Stop when $|\mathcal{E}(\mathbf{w}^{(t)}) - \mathcal{E}(\mathbf{w}^{(t-1)})| < \epsilon$ for some small $\epsilon$
2. **Gradient threshold:** Stop when $\|\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})\| < \epsilon$
3. **Maximum iterations:** Stop after a fixed number of iterations ("tired of waiting")
4. **Early stopping:** Stop when validation performance stops improving (prevents overfitting)

---

## Early Stopping

A powerful technique that serves two purposes:
1. Removes the need to guess the number of iterations
2. Acts as a form of regularization to prevent overfitting

**Algorithm:**
```
best_val_loss = infinity
best_weights = None
patience_counter = 0

for each iteration:
    update weights
    compute validation loss

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        best_weights = current_weights
        patience_counter = 0
    else:
        patience_counter += 1

    if patience_counter >= patience:
        break

return best_weights  # Not the final weights!
```

**Key insight:** Return the **best** weights (lowest validation loss), not the final weights.

---

## Gradient Descent vs. Direct Solution

For linear regression specifically, sklearn's `LinearRegression` uses the closed-form solution:

$$
\mathbf{w} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{t}
$$

This finds the **exact** optimal weights in one step.

**Why gradient descent can't match it exactly:**
1. **Fixed step size**, you're always jumping by $\alpha \cdot \text{gradient}$, so you oscillate around the minimum
2. **Early stopping**, we typically stop based on validation, not training convergence

**When to use which:**
- For linear regression: use the closed-form solution (sklearn)
- For models without closed-form solutions (neural networks, etc.): gradient descent is essential

---

## A Modular Approach to ML

Machine learning can be decomposed into three interchangeable components:

| Component | Role | Examples |
|-----------|------|----------|
| **Model** | Describes relationships between variables | Linear model, neural network |
| **Loss/Cost function** | Quantifies how badly the model fits the data | Squared error, cross-entropy |
| **Optimization algorithm** | Fits a model that minimizes the loss | Direct solution, gradient descent, Adam |

This modularity is powerful: you can mix and match components. Gradient descent works with any differentiable loss function and model, making it the workhorse of modern machine learning.

---

## Summary

| Component | Description |
|-----------|-------------|
| **Update rule** | $\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})$ |
| **Direction** | Negative of gradient (steepest descent) |
| **Step size** | Proportional to gradient magnitude, scaled by $\alpha$ |
| **Termination** | Small change in cost, gradient threshold, or max iterations |
| **Learning rate** | Too small → slow; too large → diverge/oscillate |
| **Early stopping** | Stop when validation loss stops improving |

---

## Key Formulas

**Gradient descent update:**
$$
\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})
$$

**For linear regression:**
$$
\mathbf{w} \leftarrow \mathbf{w} - \frac{\alpha}{N} \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t})
$$

**Closed-form solution (for comparison):**
$$
\mathbf{w} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{t}
$$
