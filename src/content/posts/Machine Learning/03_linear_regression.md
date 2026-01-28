---
title: '3: Linear Regression'
pubDate: '2025-01-27'
---

Linear regression is one of the simplest and most fundamental machine learning algorithms. Despite its simplicity, it serves as an excellent baseline model and foundation for understanding more complex algorithms.

---

## Regression Problem Setup

In regression, we aim to learn a function $f: \mathbb{R}^D \mapsto \mathbb{R}$ that maps input features to continuous output values.

**Dataset:** $N$ training examples $\{(\mathbf{x}^{(1)}, t^{(1)}), (\mathbf{x}^{(2)}, t^{(2)}), \ldots, (\mathbf{x}^{(N)}, t^{(N)})\}$

For each example $i$:
- $\mathbf{x}^{(i)} \in \mathbb{R}^D$ is the **input feature vector** (D features)
- $t^{(i)} \in \mathbb{R}$ is the **scalar target** (ground truth)

**Goal:** Learn $f$ such that $t^{(i)} \approx y^{(i)} = f(\mathbf{x}^{(i)})$ for all training examples.

### Examples of Regression Problems

| Problem | Input $\mathbf{x}^{(i)}$ | Target $t^{(i)}$ |
|---------|----------|----------|
| **Housing prices** | Square footage, location, # bedrooms/bathrooms | House price |
| **Weather prediction** | Temperature, humidity, wind speed | Amount of rainfall |
| **Revenue forecasting** | Previous sales data | Company revenue |

---

## The Linear Model

The simplest assumption we can make is that the relationship between inputs and outputs is **linear**.

### Model Definition

$$
y^{(i)} = w_1 x_1^{(i)} + w_2 x_2^{(i)} + \cdots + w_D x_D^{(i)} + b
$$


Or in compact form:

$$
y^{(i)} = \sum_{j=1}^{D} w_j x_j^{(i)} + b
$$


Where:
- $w_j$ are the **weights** (model parameters)
- $b$ is the **bias** term (intercept)

**Why linear?** Linear models are:
- Simple to understand and interpret
- Computationally efficient to train
- Serve as good baseline models
- Can be extended with feature engineering (polynomial features, etc.)

**Why a bias term?** The bias allows the model to fit data that doesn't pass through the origin. Without it, we force $f(\mathbf{0}) = 0$.

### Vectorized Form

We can express this more compactly using vectors:

$$
y^{(i)} = \mathbf{w}^\top \mathbf{x}^{(i)}
$$


where $\mathbf{w} = \begin{bmatrix} w_1 \\ w_2 \\ \vdots \\ w_D \end{bmatrix}$ and $\mathbf{x}^{(i)} = \begin{bmatrix} x_1^{(i)} \\ x_2^{(i)} \\ \vdots \\ x_D^{(i)} \end{bmatrix}$

### Absorbing the Bias

To simplify notation, we absorb the bias $b$ into the weight vector by adding a **dummy feature** $x_0^{(i)} = 1$:

$$
\mathbf{w} = \begin{bmatrix} b \\ w_1 \\ \vdots \\ w_D \end{bmatrix}, \quad \mathbf{x}^{(i)} = \begin{bmatrix} 1 \\ x_1^{(i)} \\ \vdots \\ x_D^{(i)} \end{bmatrix}
$$


Now our model becomes simply:

$$
y^{(i)} = \mathbf{w}^\top \mathbf{x}^{(i)}
$$


### Predictions for All Training Examples

Define the **design matrix** $\mathbf{X}$ (rows are transposed feature vectors):

$$
\mathbf{X} = \begin{bmatrix} \mathbf{x}^{(1)\top} \\ \mathbf{x}^{(2)\top} \\ \vdots \\ \mathbf{x}^{(N)\top} \end{bmatrix} = \begin{bmatrix}
1 & x_1^{(1)} & \cdots & x_D^{(1)} \\
1 & x_1^{(2)} & \cdots & x_D^{(2)} \\
\vdots & \vdots & \ddots & \vdots \\
1 & x_1^{(N)} & \cdots & x_D^{(N)}
\end{bmatrix}
$$

Then predictions for all examples:

$$
\mathbf{y} = \mathbf{X}\mathbf{w}
$$


where $\mathbf{y} = \begin{bmatrix} y^{(1)} \\ y^{(2)} \\ \vdots \\ y^{(N)} \end{bmatrix}$

---

## Loss and Cost Functions

### Loss Function

The **loss function** $L(y^{(i)}, t^{(i)})$ quantifies how bad a prediction is for a single example.

We use **squared error loss**:

$$
L(y^{(i)}, t^{(i)}) = \frac{1}{2}(y^{(i)} - t^{(i)})^2 = \frac{1}{2}(\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)})^2
$$


Why this form?
- The square ensures we minimize the **magnitude of the residual** $(y^{(i)} - t^{(i)})$
- The factor of $\frac{1}{2}$ makes derivative calculations convenient (cancels with the power of 2)

### Cost Function

The **cost function** $\mathcal{E}(\mathbf{w})$ is the **average loss** across all training examples:

$$
\mathcal{E}(\mathbf{w}) = \frac{1}{N} \sum_{i=1}^{N} L(y^{(i)}, t^{(i)})
$$


Expanding with squared error:

$$
\mathcal{E}(\mathbf{w}) = \frac{1}{2N} \sum_{i=1}^{N} (y^{(i)} - t^{(i)})^2 = \frac{1}{2N} \sum_{i=1}^{N} (\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)})^2
$$


> **Note:** In practice, "loss" and "cost" are often used interchangeably.

### Vectorized Cost Function

Define the target vector: $\mathbf{t} = \begin{bmatrix} t^{(1)} \\ t^{(2)} \\ \vdots \\ t^{(N)} \end{bmatrix}$

Then:

$$
\mathcal{E}(\mathbf{w}) = \frac{1}{2N} \sum_{i=1}^{N} (y^{(i)} - t^{(i)})^2 = \frac{1}{2N} (\mathbf{y} - \mathbf{t})^\top (\mathbf{y} - \mathbf{t})
$$


$$
= \frac{1}{2N} (\mathbf{X}\mathbf{w} - \mathbf{t})^\top (\mathbf{X}\mathbf{w} - \mathbf{t}) = \frac{1}{2N} \|\mathbf{X}\mathbf{w} - \mathbf{t}\|_2^2
$$


This is called the **Mean Squared Error (MSE)** cost function.

---

## Why Vectorize?

Vectorized computations offer several advantages:

1. **Speed:** Operations run in parallel on CPU/GPU → reduced computation time
2. **Cleaner code:** No explicit loops → easier to read and maintain
3. **Memory efficiency:** Better handling of large datasets
4. **Optimized support:** Libraries (NumPy, PyTorch, etc.) are built for vectorized operations

---

## Computing the Gradient

To find optimal weights, we minimize the cost function:

$$
\min_{\mathbf{w}} \mathcal{E}(\mathbf{w})
$$


Strategy:
1. Take derivatives of $\mathcal{E}(\mathbf{w})$ with respect to $\mathbf{w}$
2. Set derivatives to zero
3. Solve for $\mathbf{w}$

### Gradient of the Loss Function

Since the cost is the average of losses, we first compute $\nabla_{\mathbf{w}} L(\mathbf{w})$.

For a single example:

$$
L(y^{(i)}, t^{(i)}) = \frac{1}{2}(y^{(i)} - t^{(i)})^2 = \frac{1}{2}(\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)})^2
$$


Using the chain rule:

$$
\frac{\partial L}{\partial w_j} = \frac{\partial L}{\partial y^{(i)}} \cdot \frac{\partial y^{(i)}}{\partial w_j}
$$


where:
- $\frac{\partial L}{\partial y^{(i)}} = y^{(i)} - t^{(i)}$ (derivative of squared error)
- $\frac{\partial y^{(i)}}{\partial w_j} = x_j^{(i)}$ (derivative of linear model)

Therefore:

$$
\frac{\partial L}{\partial w_j} = (y^{(i)} - t^{(i)}) x_j^{(i)} = (\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)}) x_j^{(i)}
$$


The full gradient vector:

$$
\nabla_{\mathbf{w}} L(\mathbf{w}) = \begin{bmatrix} \frac{\partial L}{\partial w_0} \\ \frac{\partial L}{\partial w_1} \\ \vdots \\ \frac{\partial L}{\partial w_D} \end{bmatrix} = (\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)}) \mathbf{x}^{(i)}
$$


### Gradient of the Cost Function

The cost is the average of losses:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \sum_{i=1}^{N} \nabla_{\mathbf{w}} L(\mathbf{w}) = \frac{1}{N} \sum_{i=1}^{N} (\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)}) \mathbf{x}^{(i)}
$$


### Vectorized Gradient

To vectorize $\sum_{i=1}^{N} (\mathbf{w}^\top \mathbf{x}^{(i)} - t^{(i)}) \mathbf{x}^{(i)}$:

Define residuals: $\mathbf{r} = \mathbf{X}\mathbf{w} - \mathbf{t}$ (an $N \times 1$ vector)

Then:

$$
\sum_{i=1}^{N} r^{(i)} \mathbf{x}^{(i)} = \mathbf{X}^\top \mathbf{r} = \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t})
$$


Therefore, the **vectorized gradient**:

$$
\boxed{\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t})}
$$


---

## Direct Solution (Normal Equations)

Set the gradient to zero and solve:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t}) = 0
$$


$$
\Rightarrow \mathbf{X}^\top \mathbf{X} \mathbf{w} = \mathbf{X}^\top \mathbf{t}
$$


$$
\Rightarrow \mathbf{w} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{t}
$$


This is called the **normal equations** or **closed-form solution**.

### Advantages and Disadvantages

**Advantages:**
- No iteration required — computes optimal weights in one step
- Guaranteed to find the global minimum (for convex problems)

**Disadvantages:**
- Computing $(\mathbf{X}^\top \mathbf{X})^{-1}$ is expensive: $O(D^3)$ complexity
- Requires $\mathbf{X}^\top \mathbf{X}$ to be invertible
- Does not generalize to other models or loss functions
- Impractical when $D$ (number of features) is very large

---

## Linear Regression Properties

### Advantages

- **Interpretable:** Weights directly show feature importance
- **Efficient:** Fast to train on moderate-sized datasets
- **Good baseline:** Establishes performance floor for more complex models

### Limitations

- **Assumes linearity:** Cannot capture nonlinear relationships without feature engineering
- **Sensitive to outliers:** Squared error heavily penalizes large residuals
- **Continuous features:** Requires numerical inputs (categorical features need encoding)
- **Multicollinearity:** Performance degrades when features are highly correlated
- **High bias:** May underfit complex data (simple model)

---

## Summary

| Component | Formula |
|-----------|---------|
| **Linear Model** | $y^{(i)} = \mathbf{w}^\top \mathbf{x}^{(i)}$ <br> $\mathbf{y} = \mathbf{X}\mathbf{w}$ |
| **Loss Function** | $L(y^{(i)}, t^{(i)}) = \frac{1}{2}(y^{(i)} - t^{(i)})^2$ |
| **Cost Function (MSE)** | $\mathcal{E}(\mathbf{w}) = \frac{1}{2N} \|\mathbf{X}\mathbf{w} - \mathbf{t}\|_2^2$ |
| **Gradient** | $\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^\top (\mathbf{X}\mathbf{w} - \mathbf{t})$ |
| **Direct Solution** | $\mathbf{w} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{t}$ |

**Direct Solution Properties:**
- ✅ No iteration required
- ❌ Computationally expensive ($O(D^3)$)
- ❌ Does not generalize to other models

---

## Next Steps

- **Gradient Descent:** Iterative optimization alternative to the direct solution
- **Regularization:** Prevent overfitting with L2 (ridge) or L1 (lasso) penalties
- **Feature Engineering:** Polynomial features to capture nonlinearity
- **Variants:** Ridge regression, lasso, elastic net

---

## Practice Problems

### Problem 1: Nonlinear Relationships

**Question:** True or False: Linear regression can only model linear relationships between input features and output.

**Answer:** **False**. While the model is linear in the **weights**, we can capture nonlinear relationships through feature engineering. For example:
- Adding polynomial features: $x_1, x_1^2, x_1^3$
- Including interaction terms: $x_1 x_2$
- Creating correlated features: $\sin(x_1), \log(x_2)$

The key insight: the model $y = w_1 x_1 + w_2 x_1^2 + b$ is still **linear in the weights** $\mathbf{w}$, even though it represents a nonlinear (quadratic) relationship in the original feature $x_1$.

### Problem 2: Alternative Cost Functions

**Question:** True or False: We could use $L(y^{(i)}, t^{(i)}) = \frac{1}{(y^{(i)} - t^{(i)})^2}$ as a valid cost function.

**Answer:** **False**. This cost function is problematic because:
1. **Minimizing** $\frac{1}{\text{residual}^2}$ actually **maximizes** the residual (the denominator)
2. As the error gets larger, the loss gets smaller — the opposite of what we want
3. Division by zero when prediction is perfect

A valid cost function should **decrease** as predictions improve, not increase.

### Problem 3: Exponential Loss

**Question:** True or False: We could use $L(y^{(i)}, t^{(i)}) = e^{(y^{(i)} - t^{(i)})^2}$ as a cost function.

**Answer:** **True**. This is a valid cost function because:
- It's always positive: $e^{(\cdot)^2} > 0$
- It increases with larger errors
- It's differentiable everywhere
- Minimum occurs at zero error

**However**, this loss is **very aggressive** — it exponentially penalizes outliers, making the model extremely sensitive to large residuals. In practice, squared error is preferred for its mathematical convenience and balanced behavior.

### Problem 4: Pros and Cons of Linear Regression

**Question:** List key advantages and disadvantages of linear regression.

**Answer:**

**Advantages:**
1. **Interpretability** — Weights directly show feature importance and direction of influence
2. **Computational efficiency** — Fast to train on moderate datasets
3. **Closed-form solution** — Direct solution via normal equations (no iteration needed)
4. **Good baseline** — Establishes performance floor for complex models
5. **Well-understood theory** — Statistical properties thoroughly studied

**Disadvantages:**
1. **Assumes linearity** — Poor fit for inherently nonlinear relationships (without feature engineering)
2. **Sensitive to outliers** — Squared error heavily penalizes large residuals
3. **Multicollinearity** — Performance degrades when features are highly correlated
4. **Requires numerical features** — Categorical variables need encoding
5. **High bias** — May underfit complex data (simple model hypothesis class)
6. **Computational cost of direct solution** — $O(D^3)$ for matrix inversion when $D$ is large

### Problem 5: Number of Parameters

**Question:** True or False: The number of parameters in a linear regression model equals the number of training examples $N$.

**Answer:** **False**. The number of parameters equals $D+1$ (or just $D$ if we count the bias separately):
- $D$ weights for the features: $w_1, w_2, \ldots, w_D$
- $1$ bias term: $b$ (or $w_0$ when absorbed)

The number of training examples $N$ determines how much data we have to estimate these parameters, but doesn't affect how many parameters exist. In fact, we typically want $N \gg D$ to avoid overfitting.

### Problem 6: Gradient Vector Shape

**Question:** Makayla computed the gradient as:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = (\mathbf{X}\mathbf{w} - \mathbf{t})^{\top} \mathbf{X}
$$
Is this correct? What is the shape of her result?

**Answer:** **Incorrect**. Makayla's result has the wrong shape:

**Her computation:**
- $(\mathbf{X}\mathbf{w} - \mathbf{t})^{\top}$ has shape $1 \times N$ (row vector)
- $\mathbf{X}$ has shape $N \times (D+1)$
- Product: $(1 \times N) \times (N \times (D+1)) = 1 \times (D+1)$ — a **row vector**

**Problem:** The gradient must be a **column vector** with shape $(D+1) \times 1$ to match the shape of $\mathbf{w}$ for gradient descent updates: $\mathbf{w} \leftarrow \mathbf{w} - \alpha \nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})$.

**Correct gradient:**

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^{\top} (\mathbf{X}\mathbf{w} - \mathbf{t})
$$
This gives:
- $\mathbf{X}^{\top}$ has shape $(D+1) \times N$
- $(\mathbf{X}\mathbf{w} - \mathbf{t})$ has shape $N \times 1$ (column vector)
- Product: $((D+1) \times N) \times (N \times 1) = (D+1) \times 1$ — **correct shape**

### Problem 7: Absorbing the Bias

**Question:** Why do we absorb the bias term $b$ into the weight vector? Show how this simplifies the model equation.

**Answer:**

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
1. **Unified notation** — No special case for bias in equations
2. **Simpler code** — Vectorized operations handle bias automatically
3. **Cleaner gradient** — Single formula for all parameters
4. **Standard convention** — Matches most ML libraries

The cost: each data point and weight vector increases in dimension by 1 (from $D$ to $D+1$).

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

---

### Solution

#### Part (a): Deriving the Gradients

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
---

#### Part (b): Solving for Optimal Parameters

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
\sum_{i=1}^{N} wx^{(i)} \cdot x^{(i)} + \sum_{i=1}^{N} b \cdot x^{(i)} - \sum_{i=1}^{N} t^{(i)} \cdot x^{(i)} = 0
$$
$$
w \sum_{i=1}^{N} (x^{(i)})^2 + b \sum_{i=1}^{N} x^{(i)} - \sum_{i=1}^{N} t^{(i)} x^{(i)} = 0
$$
Substitute $b = \bar{t} - w\bar{x}$:

$$
w \sum_{i=1}^{N} (x^{(i)})^2 + (\bar{t} - w\bar{x}) \sum_{i=1}^{N} x^{(i)} - \sum_{i=1}^{N} t^{(i)} x^{(i)} = 0
$$
Since $\sum_{i=1}^{N} x^{(i)} = N\bar{x}$:

$$
w \sum_{i=1}^{N} (x^{(i)})^2 + \bar{t} \cdot N\bar{x} - w\bar{x} \cdot N\bar{x} - \sum_{i=1}^{N} t^{(i)} x^{(i)} = 0
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

The numerator measures how $x$ and $t$ co-vary:

$$
\sum_{i=1}^{N} (t^{(i)} - \bar{t})(x^{(i)} - \bar{x}) = \sum_{i=1}^{N} t^{(i)} x^{(i)} - N\bar{t}\bar{x}
$$
The denominator is the variance of $x$ times $N$:

$$
N \cdot \text{Var}(x) = \sum_{i=1}^{N} (x^{(i)} - \bar{x})^2 = \sum_{i=1}^{N} (x^{(i)})^2 - N\bar{x}^2
$$
So:

$$
w = \frac{\text{Cov}(x, t)}{\text{Var}(x)}
$$
This is the classic formula for the slope of the best-fit line.

---

### Problem 8: Step-by-Step Gradient Derivation

**Question:** Derive the gradient $\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w})$ for the cost function $\mathcal{E}(\mathbf{w}) = \frac{1}{2N} \|\mathbf{X}\mathbf{w} - \mathbf{t}\|_2^2$ using the chain rule.

**Solution:**

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
**Wait—wrong shape!** This gives a row vector $(1 \times (D+1))$, but we need a column vector $((D+1) \times 1)$.

**Correct form:** Take the transpose:

$$
\nabla_{\mathbf{w}} \mathcal{E}(\mathbf{w}) = \frac{1}{N} \mathbf{X}^{\top} \mathbf{r} = \frac{1}{N} \mathbf{X}^{\top} (\mathbf{X}\mathbf{w} - \mathbf{t})
$$
**Dimension check:**
- $\mathbf{X}^{\top}$ is $(D+1) \times N$
- $\mathbf{r} = (\mathbf{X}\mathbf{w} - \mathbf{t})$ is $N \times 1$
- Product: $((D+1) \times N) \times (N \times 1) = (D+1) \times 1$ ✓

**Key Insight:** The gradient must be a column vector to match the shape of $\mathbf{w}$ for gradient descent updates. The chain rule naturally gives us $\mathbf{r}^{\top} \mathbf{X}$, but we transpose the entire expression to get the conventional form $\mathbf{X}^{\top} \mathbf{r}$.
