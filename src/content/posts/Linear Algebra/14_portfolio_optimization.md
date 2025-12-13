---
title: '14: Portfolio Optimization'
pubDate: '2025-12-13'
---

Modern portfolio theory is linear algebra in disguise. Harry Markowitz's Nobel Prize-winning insight: don't just maximize returns—**minimize variance for a given return**. The math? Quadratic forms, covariance matrices, and constrained optimization.

---

## The Setup

You have $n$ assets with:
- **Expected returns**: $\boldsymbol{\mu} = [\mu_1, \ldots, \mu_n]^T$
- **Covariance matrix**: $\Sigma$ (an $n \times n$ symmetric positive semi-definite matrix)
- **Portfolio weights**: $\mathbf{w} = [w_1, \ldots, w_n]^T$ where $\sum w_i = 1$

The portfolio return is $r_p = \mathbf{w}^T \boldsymbol{\mu}$.

The portfolio variance is $\sigma_p^2 = \mathbf{w}^T \Sigma \mathbf{w}$.

This is a **quadratic form**—the variance depends on how weights interact through the covariance structure.

---

## Why Covariance Matrices Matter

The covariance matrix $\Sigma$ encodes how assets move together:

$$
\Sigma_{ij} = \text{Cov}(r_i, r_j) = E[(r_i - \mu_i)(r_j - \mu_j)]
$$

- Diagonal entries $\Sigma_{ii} = \sigma_i^2$ are individual variances
- Off-diagonal entries capture **correlations**
- $\Sigma$ is always symmetric and positive semi-definite

**Key insight**: Portfolio risk isn't just the sum of individual risks. Correlations can cancel out—this is **diversification**.

---

## The Minimum Variance Portfolio

The simplest problem: find weights that minimize variance with no return target.

**Minimize**: $\mathbf{w}^T \Sigma \mathbf{w}$

**Subject to**: $\mathbf{1}^T \mathbf{w} = 1$ (weights sum to 1)

Using Lagrange multipliers:

$$
\mathcal{L} = \mathbf{w}^T \Sigma \mathbf{w} - \lambda(\mathbf{1}^T \mathbf{w} - 1)
$$

Taking the gradient and setting to zero:

$$
\nabla_\mathbf{w} \mathcal{L} = 2\Sigma \mathbf{w} - \lambda \mathbf{1} = 0
$$

$$
\mathbf{w} = \frac{\lambda}{2} \Sigma^{-1} \mathbf{1}
$$

Using the constraint $\mathbf{1}^T \mathbf{w} = 1$:

$$
\mathbf{w}_{\text{min var}} = \frac{\Sigma^{-1} \mathbf{1}}{\mathbf{1}^T \Sigma^{-1} \mathbf{1}}
$$

The minimum variance portfolio is just the inverse covariance matrix applied to a vector of ones, normalized.

---

## The Efficient Frontier

Now add a return target: minimize variance **for a given expected return** $\mu_p$.

**Minimize**: $\mathbf{w}^T \Sigma \mathbf{w}$

**Subject to**:
- $\mathbf{1}^T \mathbf{w} = 1$
- $\boldsymbol{\mu}^T \mathbf{w} = \mu_p$

The solution traces out the **efficient frontier**—the curve of optimal risk-return tradeoffs.

Using two Lagrange multipliers:

$$
\mathbf{w}^* = \Sigma^{-1}(\lambda_1 \mathbf{1} + \lambda_2 \boldsymbol{\mu})
$$

where $\lambda_1$ and $\lambda_2$ are determined by the constraints. The efficient frontier is a **parabola** in variance-return space (or a hyperbola in standard deviation-return space).

---

## The Role of Eigenvalues

Decompose $\Sigma = V \Lambda V^T$ (spectral decomposition). Then:

$$
\mathbf{w}^T \Sigma \mathbf{w} = \mathbf{w}^T V \Lambda V^T \mathbf{w} = \mathbf{z}^T \Lambda \mathbf{z} = \sum_i \lambda_i z_i^2
$$

where $\mathbf{z} = V^T \mathbf{w}$ are the weights in the eigenvector basis.

**Interpretation**:
- Each eigenvalue $\lambda_i$ is a **principal variance direction**
- Large eigenvalues = high-risk directions in asset space
- Eigenvectors are uncorrelated "principal portfolios"

**Risk decomposition**: Portfolio variance is a weighted sum of eigenvalues, with weights determined by exposure to each principal direction.

---

## Numerical Example

Three assets with:

$$
\boldsymbol{\mu} = \begin{bmatrix} 0.10 \\ 0.05 \\ 0.03 \end{bmatrix}, \quad
\Sigma = \begin{bmatrix} 0.04 & 0.006 & 0.002 \\ 0.006 & 0.01 & 0.004 \\ 0.002 & 0.004 & 0.0064 \end{bmatrix}
$$

The minimum variance portfolio:

1. Compute $\Sigma^{-1}$
2. Apply to $\mathbf{1}$: $\Sigma^{-1} \mathbf{1}$
3. Normalize: divide by $\mathbf{1}^T \Sigma^{-1} \mathbf{1}$

Result: The minimum variance portfolio underweights the high-variance asset and overweights low-variance, low-correlation assets.

---

## Practical Considerations

### Estimation Error

$\Sigma$ and $\boldsymbol{\mu}$ are estimated from historical data. Small errors in $\Sigma$ can cause large errors in $\Sigma^{-1}$—especially if $\Sigma$ is near-singular.

**Solutions**:
- **Shrinkage estimators**: Blend sample covariance with a structured target (e.g., diagonal)
- **Factor models**: Assume $\Sigma = B F B^T + D$ where $F$ is a small factor covariance matrix
- **Regularization**: Add $\lambda I$ to $\Sigma$ before inverting

### Constraints

Real portfolios have constraints:
- No short selling: $w_i \geq 0$
- Position limits: $w_i \leq w_{\max}$
- Sector exposure limits

These turn the problem into **quadratic programming**—still tractable, but no longer closed-form.

---

## Key Takeaways

1. **Portfolio variance is a quadratic form**: $\mathbf{w}^T \Sigma \mathbf{w}$
2. **Covariance matrix is everything**: It encodes diversification potential
3. **Inverse covariance appears everywhere**: Minimum variance, efficient frontier, risk parity
4. **Eigendecomposition reveals risk structure**: Principal directions of portfolio risk
5. **Estimation matters**: $\Sigma^{-1}$ amplifies estimation errors

---

*The Markowitz framework is 70 years old, but the linear algebra hasn't changed. Covariance matrices, quadratic forms, eigendecomposition—these are the tools that turn "don't put all your eggs in one basket" into a precise mathematical statement.*
