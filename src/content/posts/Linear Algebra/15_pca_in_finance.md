---
title: '15: PCA in Finance'
pubDate: '2025-12-13'
---

Principal Component Analysis is the SVD applied to data. In finance, it answers a fundamental question: **what are the hidden factors driving asset returns?** The math reveals that a few eigenvectors often explain most of the variance in hundreds of correlated assets.

---

## The Setup

You have a returns matrix $X$ of shape $T \times n$:
- $T$ time periods (rows)
- $n$ assets (columns)
- Each entry $X_{ti}$ is the return of asset $i$ at time $t$

Assets are correlated. The goal: find **uncorrelated factors** that explain the variance.

---

## PCA Algorithm

1. **Center the data**: Subtract the mean return from each column
   $$\tilde{X}_{ti} = X_{ti} - \bar{X}_i$$

2. **Compute the covariance matrix**:
   $$\Sigma = \frac{1}{T-1} \tilde{X}^T \tilde{X}$$

3. **Eigendecompose**: $\Sigma = V \Lambda V^T$
   - Columns of $V$ are **principal components** (eigenvectors)
   - Diagonal of $\Lambda$ are **eigenvalues** (variance explained)

4. **Project data**: $Z = \tilde{X} V$ gives factor exposures

Alternatively, use SVD directly: $\tilde{X} = U \Sigma V^T$. The right singular vectors $V$ are the principal components.

---

## Interpretation in Finance

### Principal Components as Factors

Each principal component $\mathbf{v}_i$ is a **portfolio**—a linear combination of assets. The first few PCs often have clear interpretations:

**Equity markets** (e.g., S&P 500 stocks):
- **PC1**: Market factor (all stocks move together)—explains ~50-70% of variance
- **PC2**: Often size or value (small vs. large, growth vs. value)
- **PC3+**: Sector or style factors

**Fixed income** (yield curve):
- **PC1**: Level (parallel shifts)—explains ~90% of variance
- **PC2**: Slope (steepening/flattening)
- **PC3**: Curvature (butterfly)

### Variance Explained

The eigenvalue $\lambda_i$ is the variance of the $i$-th principal component. The **fraction of variance explained**:

$$
\text{FVE}_i = \frac{\lambda_i}{\sum_j \lambda_j}
$$

The **cumulative variance explained** tells you how many PCs you need:

$$
\text{CVE}_k = \frac{\sum_{i=1}^k \lambda_i}{\sum_j \lambda_j}
$$

If the first 3 PCs explain 80% of variance, the other $n-3$ dimensions are mostly noise.

---

## Dimensionality Reduction

### Factor Models

Instead of modeling $n$ correlated returns, model $k \ll n$ uncorrelated factors:

$$
\mathbf{r}_t = B \mathbf{f}_t + \boldsymbol{\epsilon}_t
$$

where:
- $\mathbf{f}_t$ is the $k$-dimensional factor return vector (the PCs)
- $B$ is the $n \times k$ factor loading matrix (columns of $V_k$)
- $\boldsymbol{\epsilon}_t$ is idiosyncratic noise

This is the **statistical factor model**. It reduces a $n \times n$ covariance matrix to:

$$
\Sigma \approx V_k \Lambda_k V_k^T + D
$$

where $D$ is diagonal (idiosyncratic variances).

### Benefits

1. **Fewer parameters**: Estimating $n(n+1)/2$ covariances vs. $nk + k$ factor loadings
2. **More stable**: Less overfitting to noise
3. **Interpretable**: Factors often have economic meaning

---

## Example: Yield Curve PCA

Consider monthly changes in Treasury yields at maturities: 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y.

Typical results:

| PC | Variance Explained | Interpretation |
|----|--------------------|----------------|
| 1 | ~90% | Level (all yields move together) |
| 2 | ~8% | Slope (short vs. long end) |
| 3 | ~2% | Curvature (belly vs. wings) |

**PC1 loadings**: All positive, roughly equal—a parallel shift.

**PC2 loadings**: Negative for short maturities, positive for long—a steepening/flattening.

**PC3 loadings**: Positive at short and long ends, negative in the middle—a butterfly.

Three numbers describe 99%+ of yield curve movements!

---

## Risk Management Applications

### Factor Risk Decomposition

Portfolio variance decomposes by factor:

$$
\sigma_p^2 = \mathbf{w}^T \Sigma \mathbf{w} = \sum_{i=1}^k (\mathbf{w}^T \mathbf{v}_i)^2 \lambda_i + \text{idiosyncratic}
$$

The term $(\mathbf{w}^T \mathbf{v}_i)^2 \lambda_i$ is the **risk contribution** from factor $i$.

### Stress Testing

To stress test against a factor shock:
1. Identify the relevant PC (e.g., PC1 for market crash)
2. Compute portfolio exposure: $\beta_i = \mathbf{w}^T \mathbf{v}_i$
3. Multiply by shock size: $\Delta P = \beta_i \times \text{shock}$

### De-correlating Portfolios

Transform returns to PC space: $\mathbf{z}_t = V^T \mathbf{r}_t$. Now:
- Components are uncorrelated
- Variances are eigenvalues
- Risk budgeting becomes simple

---

## Practical Considerations

### Stationarity

PCA assumes the covariance structure is stable. In reality:
- Correlations spike during crises
- Factor structure can change over time

**Solution**: Rolling-window PCA, regime-switching models, or robust covariance estimators.

### Sign and Scale Ambiguity

Eigenvectors are determined up to sign. $\mathbf{v}$ and $-\mathbf{v}$ are both valid. Choose signs for interpretability (e.g., PC1 loadings all positive for "market").

### Number of Factors

How many PCs to keep? Common approaches:
- **Scree plot**: Look for an "elbow" in eigenvalue decay
- **Variance threshold**: Keep enough for 80-90% cumulative variance
- **Cross-validation**: Test predictive performance

---

## PCA vs. Factor Models

| | PCA | Economic Factor Models |
|--|-----|----------------------|
| Factors | Statistical (eigenvectors) | Pre-specified (market, size, value) |
| Orthogonality | Guaranteed | Not generally |
| Interpretability | Often unclear | Built-in |
| Estimation | Data-driven | Requires factor definitions |

PCA finds factors that maximize variance explained. Economic factors are chosen for interpretability. Often they overlap significantly (PC1 ≈ market factor).

---

## Key Takeaways

1. **PCA = eigendecomposition of covariance**: Finds uncorrelated directions of maximum variance
2. **Few factors explain most variance**: Especially in correlated markets
3. **Interpretable in finance**: Level/slope/curvature for rates, market/size/value for equities
4. **Enables dimensionality reduction**: Model $k$ factors instead of $n$ assets
5. **Risk decomposes by factor**: Understand where portfolio risk comes from

---

*When you see 500 stocks moving in sync, you're seeing PC1—the market factor. PCA reveals that behind the apparent complexity of financial markets, a handful of common factors drive most of the action. The rest is noise.*
