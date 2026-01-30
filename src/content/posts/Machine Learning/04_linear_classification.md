---
title: '4: Feature Mapping, Regularization, and Linear Classification'
pubDate: '2025-01-29'
---

This lecture covers how to extend linear models to capture non-linear relationships through feature mapping, how to prevent overfitting using regularization, and how to adapt linear models for classification tasks.

---

## Feature Mapping (Basis Expansion)

What if the relationship between inputs and outputs is **not linear**? We can still use linear regression by transforming the inputs!

### The Key Idea

1. **Transform the inputs:** Map original features $\mathbf{x} \in \mathbb{R}^D$ to a new feature space $\mathbb{R}^{D'}$
   $$\psi(\mathbf{x}): \mathbb{R}^D \rightarrow \mathbb{R}^{D'}$$

2. **Fit a linear model:** Run linear regression with the new features as inputs

The key insight: **Create new features so that the non-linear relationship becomes linear in the transformed space.**

Typically $D' > D$ (we expand to a higher-dimensional space).

### Example: Polynomial Feature Mapping

**Goal:** Learn a polynomial function $y = w_0 + w_1 x + w_2 x^2 + \cdots + w_M x^M$

The relationship $y$ is **not linear in $x$**, but we can make it linear by defining:

**Polynomial feature map:**
$$\psi(x): \mathbb{R} \mapsto \mathbb{R}^{M+1}, \quad \psi(x) = \begin{bmatrix} 1 \\ x \\ x^2 \\ \vdots \\ x^M \end{bmatrix}$$

Now $y = \mathbf{w}^\top \psi(x)$ **is linear in $\psi(x)$**. The model is linear with respect to the parameters, even though it's non-linear in the original input $x$.

### Polynomial Degree and Model Complexity

| Degree $M$ | Feature Map | Hypothesis | Behavior |
|------------|-------------|------------|----------|
| $M = 1$ | $\psi(x) = [1, x]^\top$ | $y = w_0 + w_1 x$ | Simple line (underfitting) |
| $M = 3$ | $\psi(x) = [1, x, x^2, x^3]^\top$ | $y = w_0 + w_1 x + w_2 x^2 + w_3 x^3$ | Good fit |
| $M = 9$ | $\psi(x) = [1, x, \ldots, x^9]^\top$ | $y = w_0 + \cdots + w_9 x^9$ | Overfitting |

### Model Complexity and Generalization

As the polynomial degree $M$ increases:

| $M$ | Training Error | Test Error | Diagnosis |
|-----|----------------|------------|-----------|
| Low | High | High | **Underfitting** - model too simple |
| Optimal | Low | Low | **Good generalization** |
| High | Very low (near 0) | High | **Overfitting** - model too complex |

**Key observations:**
- Training error **decreases monotonically** as model complexity increases
- Test error **decreases initially, then increases** (U-shaped curve)
- **Weight magnitudes grow** as $M$ increases (motivates regularization)

---

## Regularization

### Why Regularize?

When overfitting occurs:
- Weights become very large (finely tuned to training data)
- The function oscillates wildly between data points
- Small changes in input cause large changes in output

### Controlling Model Complexity

Two approaches to prevent overfitting:

1. **Tune $M$ as a hyperparameter** using a validation set
   - Decreases the number of parameters

2. **Use regularization** to enforce simpler solutions
   - Keep the number of parameters large, but constrain their values

### The $L^2$ Regularizer

$$R(\mathbf{w}) = \frac{1}{2} \|\mathbf{w}\|_2^2 = \frac{1}{2} \sum_j w_j^2$$

This is the **squared Euclidean norm** of the weight vector.

### Regularized Cost Function

$$\mathcal{E}_{\text{reg}}(\mathbf{w}) = \mathcal{E}(\mathbf{w}) + \lambda R(\mathbf{w}) = \mathcal{E}(\mathbf{w}) + \frac{\lambda}{2} \|\mathbf{w}\|_2^2$$

This creates a **tradeoff**:
- Smaller $\mathcal{E}$ → better fit to training data
- Smaller $R$ → smaller weights (simpler model)
- $\lambda$ controls the tradeoff between the two

### Tuning $\lambda$

| $\lambda$ | Effect on Weights | Effect on Fit | Risk |
|-----------|-------------------|---------------|------|
| Too large ($\lambda \to \infty$) | All weights small | Poor fit to training data | **Underfitting** |
| Too small ($\lambda \to 0$) | Some weights large | Great fit to training data | **Overfitting** |
| Optimal | Balanced | Good generalization | - |

**Intuition:**
- $\lambda$ too large: $\mathcal{E}_{\text{reg}} \approx \lambda R(\mathbf{w})$, model tries only to keep weights small
- $\lambda$ too small: $\mathcal{E}_{\text{reg}} \approx \mathcal{E}(\mathbf{w})$, model ignores regularization

### Why Penalize Large Weights?

- A large weight → prediction is very sensitive to that feature
- We expect output to depend on a **combination** of features
- Large weights often indicate the model is fitting noise

---

## A Modular Approach to Machine Learning

| Component | Purpose |
|-----------|---------|
| **Model** | Describes relationships between variables |
| **Loss/Cost Function** | Quantifies how badly a hypothesis fits the data |
| **Regularizer** | Expresses preferences over different hypotheses |
| **Optimization Algorithm** | Fit a model that minimizes loss and satisfies regularization |

---

## Binary Linear Classification

### From Regression to Classification

In classification, the target is **discrete** rather than continuous.

**Classification setup:**
- Dataset: $\{(\mathbf{x}^{(1)}, t^{(1)}), (\mathbf{x}^{(2)}, t^{(2)}), \ldots, (\mathbf{x}^{(N)}, t^{(N)})\}$
- Each target $t^{(i)}$ is discrete
- **Binary classification:** $t^{(i)} \in \{0, 1\}$
  - $t^{(i)} = 1$: positive example
  - $t^{(i)} = 0$: negative example

### Linear Model for Binary Classification

**Step 1:** Compute a linear combination
$$z = \mathbf{w}^\top \mathbf{x} + b$$

**Step 2:** Apply threshold to generate prediction
$$y = \begin{cases} 1, & \text{if } z \geq r \\ 0, & \text{if } z < r \end{cases}$$

where $r$ is the threshold.

### Simplifying the Model

**Eliminating the threshold $r$:**

Since $\mathbf{w}^\top \mathbf{x} + b \geq r \iff \mathbf{w}^\top \mathbf{x} + (b - r) \geq 0$, we can absorb $r$ into the bias:

$$z = \mathbf{w}^\top \mathbf{x} + b_0, \quad y = \begin{cases} 1, & \text{if } z \geq 0 \\ 0, & \text{if } z < 0 \end{cases}$$

**Eliminating the bias $b_0$:**

Add a dummy feature $x_0 = 1$ and let $b_0$ be its weight:

$$z = \mathbf{w}^\top \mathbf{x}, \quad y = \begin{cases} 1, & \text{if } z \geq 0 \\ 0, & \text{if } z < 0 \end{cases}$$

### Decision Boundary

The **decision boundary** is the set of points where $z = 0$:
$$\mathbf{w}^\top \mathbf{x} = 0$$

This defines a **hyperplane** that separates the two classes.

### Example: Modeling the AND Function

Goal: Learn weights to classify the logical AND function perfectly.

| $x_0$ | $x_1$ | $x_2$ | $t$ |
|-------|-------|-------|-----|
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 |

**System of inequalities for perfect classification:**

The model predicts $y = 1$ if $w_1 x_1 + w_2 x_2 + w_0 \geq 0$:

- $(0,0)$: $w_0 < 0$ (predict 0)
- $(0,1)$: $w_2 + w_0 < 0$ (predict 0)
- $(1,0)$: $w_1 + w_0 < 0$ (predict 0)
- $(1,1)$: $w_1 + w_2 + w_0 \geq 0$ (predict 1)

**One solution:** $w_1 = 1, w_2 = 1, w_0 = -1.5$

The decision boundary is: $x_1 + x_2 - 1.5 = 0$, or equivalently $x_2 = -x_1 + 1.5$

### Linearly Separable Data

- If data is **linearly separable**, we can find weights that classify every point correctly
- In practice, data is **rarely** linearly separable
- A linear model will inevitably make mistakes
- We need a way to **measure errors** and adjust the model → leads to **loss functions**

---

## Summary

### Feature Mapping

| Concept | Description |
|---------|-------------|
| **Goal** | Model non-linear relationships using linear regression |
| **Method** | Create new features $\psi(\mathbf{x})$ so model is linear in transformed space |
| **Tradeoff** | Higher-degree features → more expressive but risk overfitting |

### Regularization

| Concept | Formula |
|---------|---------|
| **$L^2$ Regularizer** | $R(\mathbf{w}) = \frac{1}{2}\|\mathbf{w}\|_2^2$ |
| **Regularized Cost** | $\mathcal{E}_{\text{reg}}(\mathbf{w}) = \mathcal{E}(\mathbf{w}) + \frac{\lambda}{2}\|\mathbf{w}\|_2^2$ |
| **Hyperparameter** | $\lambda$ controls fit vs. simplicity tradeoff |

### Binary Linear Classification

| Component | Formula |
|-----------|---------|
| **Linear Model** | $z = \mathbf{w}^\top \mathbf{x}$ |
| **Threshold Activation** | $y = \begin{cases} 1, & \text{if } z \geq 0 \\ 0, & \text{if } z < 0 \end{cases}$ |
| **Decision Boundary** | Hyperplane $\mathbf{w}^\top \mathbf{x} = 0$ |
