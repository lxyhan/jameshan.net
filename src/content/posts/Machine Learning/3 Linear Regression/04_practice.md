---
title: '3.4: Practice Problems'
pubDate: '2025-01-28'
---

Practice problems for linear regression and gradient descent.

---

## Problem 1: Nonlinear Relationships

**Question:** True or False: Linear regression can only model linear relationships between input features and output.

<details>
<summary>Answer</summary>

**False**. While the model is linear in the **weights**, we can capture nonlinear relationships through feature engineering. For example:
- Adding polynomial features: $x_1, x_1^2, x_1^3$
- Including interaction terms: $x_1 x_2$
- Creating transformed features: $\sin(x_1), \log(x_2)$

The key insight: the model $y = w_1 x_1 + w_2 x_1^2 + b$ is still **linear in the weights** $\mathbf{w}$, even though it represents a nonlinear (quadratic) relationship in the original feature $x_1$.

</details>

---

## Problem 2: Alternative Cost Functions

**Question:** True or False: We could use $L(y^{(i)}, t^{(i)}) = \frac{1}{(y^{(i)} - t^{(i)})^2}$ as a valid cost function.

<details>
<summary>Answer</summary>

**False**. This cost function is problematic because:
1. **Minimizing** $\frac{1}{\text{residual}^2}$ actually **maximizes** the residual (the denominator)
2. As the error gets larger, the loss gets smaller, the opposite of what we want
3. Division by zero when prediction is perfect

A valid cost function should **decrease** as predictions improve, not increase.

</details>

---

## Problem 3: Exponential Loss

**Question:** True or False: We could use $L(y^{(i)}, t^{(i)}) = e^{(y^{(i)} - t^{(i)})^2}$ as a cost function.

<details>
<summary>Answer</summary>

**True**. This is a valid cost function because:
- It's always positive: $e^{(\cdot)^2} > 0$
- It increases with larger errors
- It's differentiable everywhere
- Minimum occurs at zero error

**However**, this loss is **very aggressive**, it exponentially penalizes outliers, making the model extremely sensitive to large residuals. In practice, squared error is preferred for its mathematical convenience and balanced behavior.

</details>

---

## Problem 4: Pros and Cons of Linear Regression

**Question:** List key advantages and disadvantages of linear regression.

<details>
<summary>Answer</summary>

**Advantages:**
1. **Interpretability**, Weights directly show feature importance and direction of influence
2. **Computational efficiency**, Fast to train on moderate datasets
3. **Closed-form solution**, Direct solution via normal equations (no iteration needed)
4. **Good baseline**, Establishes performance floor for complex models
5. **Well-understood theory**, Statistical properties thoroughly studied

**Disadvantages:**
1. **Assumes linearity**, Poor fit for inherently nonlinear relationships (without feature engineering)
2. **Sensitive to outliers**, Squared error heavily penalizes large residuals
3. **Multicollinearity**, Performance degrades when features are highly correlated
4. **Requires numerical features**, Categorical variables need encoding
5. **High bias**, May underfit complex data (simple model hypothesis class)
6. **Computational cost of direct solution**, $O(D^3)$ for matrix inversion when $D$ is large

</details>

---

## Problem 5: Number of Parameters

**Question:** True or False: The number of parameters in a linear regression model equals the number of training examples $N$.

<details>
<summary>Answer</summary>

**False**. The number of parameters equals $D+1$ (or just $D$ if we count the bias separately):
- $D$ weights for the features: $w_1, w_2, \ldots, w_D$
- $1$ bias term: $b$ (or $w_0$ when absorbed)

The number of training examples $N$ determines how much data we have to estimate these parameters, but doesn't affect how many parameters exist. In fact, we typically want $N \gg D$ to avoid overfitting.

</details>

---

## Problem 6: Gradient Vector Shape

**Question:** Makayla computed the gradient as:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = (\mathbf{X}\mathbf{w} - \mathbf{t})^{\top} \mathbf{X}
$$

Is this correct? What is the shape of her result?

<details>
<summary>Answer</summary>

**Incorrect**. Makayla's result has the wrong shape:

**Her computation:**
- $(\mathbf{X}\mathbf{w} - \mathbf{t})^{\top}$ has shape $1 \times N$ (row vector)
- $\mathbf{X}$ has shape $N \times (D+1)$
- Product: $(1 \times N) \times (N \times (D+1)) = 1 \times (D+1)$, a **row vector**

**Problem:** The gradient must be a **column vector** with shape $(D+1) \times 1$ to match the shape of $\mathbf{w}$ for gradient descent updates: $\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})$.

**Correct gradient:**

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^{\top} (\mathbf{X}\mathbf{w} - \mathbf{t})
$$

This gives:
- $\mathbf{X}^{\top}$ has shape $(D+1) \times N$
- $(\mathbf{X}\mathbf{w} - \mathbf{t})$ has shape $N \times 1$ (column vector)
- Product: $((D+1) \times N) \times (N \times 1) = (D+1) \times 1$, **correct shape**

</details>

---

## Problem 7: Absorbing the Bias

**Question:** Why do we absorb the bias term $b$ into the weight vector? Show how this simplifies the model equation.

<details>
<summary>Answer</summary>

**Original formulation:**

$$
y^{(i)} = w_1 x_1^{(i)} + w_2 x_2^{(i)} + \cdots + w_D x_D^{(i)} + b
$$

This requires treating $b$ separately in all computations.

**After absorbing bias:**

Define augmented vectors with a dummy feature $x_0^{(i)} = 1$:

$$
\mathbf{w} = \begin{bmatrix} b \\ w_1 \\ w_2 \\ \vdots \\ w_D \end{bmatrix}, \quad \mathbf{x}^{(i)} = \begin{bmatrix} 1 \\ x_1^{(i)} \\ x_2^{(i)} \\ \vdots \\ x_D^{(i)} \end{bmatrix}
$$

Now the model becomes simply:

$$
y^{(i)} = \mathbf{w}^{\top} \mathbf{x}^{(i)} = b \cdot 1 + w_1 x_1^{(i)} + \cdots + w_D x_D^{(i)}
$$

**Benefits:**
1. **Unified notation**, No special case for bias in equations
2. **Simpler code**, Vectorized operations handle bias automatically
3. **Cleaner gradient**, Single formula for all parameters
4. **Standard convention**, Matches most ML libraries

The cost: each data point and weight vector increases in dimension by 1 (from $D$ to $D+1$).

</details>

---

## Worked Example: Single-Feature Linear Regression

**Problem:** Consider the linear regression model with one feature:

$$
y = wx + b
$$

The cost function is:

$$
\mathcal{E}(w, b) = \frac{1}{2N} \sum_{i=1}^{N} ((wx^{(i)} + b) - t^{(i)})^2
$$

**(a) Derive the partial derivatives $\frac{\partial \mathcal{E}}{\partial w}$ and $\frac{\partial \mathcal{E}}{\partial b}$.**

**(b) Solve for $w$ and $b$ that minimize the cost function.**

<details>
<summary>Solution</summary>

### Part (a): Deriving the Gradients

For each training example, the residual is:

$$
r^{(i)} = wx^{(i)} + b - t^{(i)}
$$

**Derivative with respect to $w$:**

Using the chain rule on $(r^{(i)})^2$:

$$
\frac{\partial}{\partial w} \left[ \frac{1}{2}(r^{(i)})^2 \right] = r^{(i)} \cdot \frac{\partial r^{(i)}}{\partial w} = r^{(i)} \cdot x^{(i)}
$$

Summing over all examples and dividing by $N$:

$$
\frac{\partial \mathcal{E}}{\partial w} = \frac{1}{N} \sum_{i=1}^{N} (wx^{(i)} + b - t^{(i)}) \cdot x^{(i)}
$$

**Derivative with respect to $b$:**

Similarly:

$$
\frac{\partial}{\partial b} \left[ \frac{1}{2}(r^{(i)})^2 \right] = r^{(i)} \cdot \frac{\partial r^{(i)}}{\partial b} = r^{(i)} \cdot 1
$$

Summing over all examples:

$$
\frac{\partial \mathcal{E}}{\partial b} = \frac{1}{N} \sum_{i=1}^{N} (wx^{(i)} + b - t^{(i)})
$$

### Part (b): Solving for Optimal Parameters

Set both partial derivatives to zero.

**From $\frac{\partial \mathcal{E}}{\partial b} = 0$:**

$$
\frac{1}{N} \sum_{i=1}^{N} (wx^{(i)} + b - t^{(i)}) = 0
$$

Multiply both sides by $N$:

$$
\sum_{i=1}^{N} wx^{(i)} + \sum_{i=1}^{N} b - \sum_{i=1}^{N} t^{(i)} = 0
$$

Factor out constants:

$$
w \sum_{i=1}^{N} x^{(i)} + Nb - \sum_{i=1}^{N} t^{(i)} = 0
$$

Note that $\sum_{i=1}^{N} x^{(i)} = N\bar{x}$ and $\sum_{i=1}^{N} t^{(i)} = N\bar{t}$ where $\bar{x}$ and $\bar{t}$ are the means. Dividing by $N$:

$$
w\bar{x} + b = \bar{t}
$$

Solving for $b$:

$$
\boxed{b = \bar{t} - w\bar{x}}
$$

**Geometric interpretation:** The regression line passes through the centroid $(\bar{x}, \bar{t})$ of the data.

---

**From $\frac{\partial \mathcal{E}}{\partial w} = 0$:**

$$
\sum_{i=1}^{N} (wx^{(i)} + b - t^{(i)}) \cdot x^{(i)} = 0
$$

Expand:

$$
w \sum_{i=1}^{N} (x^{(i)})^2 + b \sum_{i=1}^{N} x^{(i)} - \sum_{i=1}^{N} t^{(i)} x^{(i)} = 0
$$

Substitute $b = \bar{t} - w\bar{x}$:

$$
w \sum_{i=1}^{N} (x^{(i)})^2 + (\bar{t} - w\bar{x}) \cdot N\bar{x} - \sum_{i=1}^{N} t^{(i)} x^{(i)} = 0
$$

Group terms with $w$:

$$
w \left[ \sum_{i=1}^{N} (x^{(i)})^2 - N\bar{x}^2 \right] = \sum_{i=1}^{N} t^{(i)} x^{(i)} - N\bar{t}\bar{x}
$$

Therefore:

$$
\boxed{w = \frac{\sum_{i=1}^{N} t^{(i)} x^{(i)} - N\bar{t}\bar{x}}{\sum_{i=1}^{N} (x^{(i)})^2 - N\bar{x}^2}}
$$

**Alternative form using covariance and variance:**

$$
w = \frac{\text{Cov}(x, t)}{\text{Var}(x)}
$$

This is the classic formula for the slope of the best-fit line.

</details>

---

## Problem 8: Step-by-Step Gradient Derivation

**Question:** Derive the gradient $\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})$ for the cost function $\mathcal{E}(\mathbf{w}) = \frac{1}{2N} \|\mathbf{X}\mathbf{w} - \mathbf{t}\|_2^2$ using the chain rule.

<details>
<summary>Solution</summary>

We'll work through this systematically using intermediate variables and the chain rule.

**(a) Define the prediction vector:**

$$
\mathbf{y} = \mathbf{X}\mathbf{w}
$$

Taking the derivative:

$$
\frac{\partial \mathbf{y}}{\partial \mathbf{w}} = \mathbf{X}
$$

This makes sense dimensionally: $\mathbf{y}$ is $N \times 1$, $\mathbf{w}$ is $(D+1) \times 1$, so the Jacobian must be $N \times (D+1)$, which is exactly $\mathbf{X}$.

**(b) Define the residual vector:**

$$
\mathbf{r} = \mathbf{y} - \mathbf{t} = \mathbf{X}\mathbf{w} - \mathbf{t}
$$

Since $\mathbf{t}$ is constant with respect to $\mathbf{w}$:

$$
\frac{\partial \mathbf{r}}{\partial \mathbf{w}} = \frac{\partial \mathbf{y}}{\partial \mathbf{w}} = \mathbf{X}
$$

**(c) Define the squared norm:**

$$
s = \|\mathbf{r}\|_2^2 = \mathbf{r}^{\top} \mathbf{r} = \sum_{i=1}^{N} (r^{(i)})^2
$$

This is a scalar. Taking the derivative with respect to the vector $\mathbf{r}$:

$$
\frac{\partial s}{\partial \mathbf{r}} = 2\mathbf{r}^{\top}
$$

**Explanation:** For each component $r_j$, we have $\frac{\partial s}{\partial r_j} = 2r_j$ (from the chain rule on $(r_j)^2$). Stacking these gives $2\mathbf{r}^{\top}$ (a row vector).

**(d) Define the cost function:**

$$
\mathcal{E}(\mathbf{w}) = \frac{1}{2N} s = \frac{1}{2N} \|\mathbf{X}\mathbf{w} - \mathbf{t}\|_2^2
$$

The derivative with respect to $s$:

$$
\frac{\partial \mathcal{E}}{\partial s} = \frac{1}{2N}
$$

**(e) Apply the chain rule:**

Now we chain everything together:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{\partial \mathcal{E}}{\partial s} \cdot \frac{\partial s}{\partial \mathbf{r}} \cdot \frac{\partial \mathbf{r}}{\partial \mathbf{w}}
$$

Substituting:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{2N} \cdot 2\mathbf{r}^{\top} \cdot \mathbf{X}
$$

Simplifying:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{r}^{\top} \mathbf{X}
$$

**Wait, wrong shape!** This gives a row vector $(1 \times (D+1))$, but we need a column vector $((D+1) \times 1)$.

**Correct form:** Take the transpose:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^{\top} \mathbf{r} = \frac{1}{N} \mathbf{X}^{\top} (\mathbf{X}\mathbf{w} - \mathbf{t})
$$

**Dimension check:**
- $\mathbf{X}^{\top}$ is $(D+1) \times N$
- $\mathbf{r} = (\mathbf{X}\mathbf{w} - \mathbf{t})$ is $N \times 1$
- Product: $((D+1) \times N) \times (N \times 1) = (D+1) \times 1$ ✓

**Key Insight:** The gradient must be a column vector to match the shape of $\mathbf{w}$ for gradient descent updates. The chain rule naturally gives us $\mathbf{r}^{\top} \mathbf{X}$, but we transpose the entire expression to get the conventional form $\mathbf{X}^{\top} \mathbf{r}$.

</details>

---

## Problem 9: Learning Rate Analysis

**Question:** You're training a linear regression model with gradient descent. After 100 iterations, you observe:
- Training loss at iteration 1: 50.0
- Training loss at iteration 100: 49.8

What might be wrong, and how would you fix it?

<details>
<summary>Answer</summary>

The learning rate is **too small**. The loss has barely decreased (only 0.2 over 100 iterations), indicating the steps are too tiny.

**Fixes:**
1. **Increase the learning rate**, try 10x or 100x larger
2. **Use adaptive learning rates**, methods like Adam automatically adjust
3. **Run for more iterations**, though this is inefficient

**How to diagnose:** Plot the training curve. With a proper learning rate, you should see rapid initial decrease that levels off. A nearly flat line suggests the learning rate is too small.

</details>

---

## Problem 10: Gradient Descent Direction

**Question:** At a point where $\frac{\partial \mathcal{E}}{\partial w} = -3$, should we increase or decrease $w$ to reduce the cost?

<details>
<summary>Answer</summary>

We should **increase** $w$.

**Reasoning:**
- The gradient is negative (-3), meaning the cost decreases as $w$ increases
- Gradient descent update: $w \leftarrow w - \alpha \cdot (-3) = w + 3\alpha$
- The negative gradient causes $w$ to increase

**Intuition:** The gradient points toward steepest increase. A negative gradient means "increasing $w$ decreases cost." We move opposite to the gradient, so we move in the direction that decreases cost.

</details>
