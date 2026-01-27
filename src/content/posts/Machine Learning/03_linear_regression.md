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
