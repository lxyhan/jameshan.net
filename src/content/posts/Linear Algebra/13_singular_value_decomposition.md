---
title: '13: Singular Value Decomposition'
pubDate: '2025-12-10'
---

Eigendecomposition is elegant, but it has a problem: it only works for square matrices, and even then, only when you have enough eigenvectors. **Singular Value Decomposition (SVD)** is the generalization that works for *any* matrix,rectangular, singular, whatever. Every matrix has an SVD.

The idea is beautiful: every linear transformation can be broken into three simple steps,**rotate, stretch, rotate**. That's it. No matter how complicated the transformation, it's just two rotations with some scaling in between.

---

## The Decomposition

Any $m \times n$ matrix $A$ can be written as:

$$
A = U\Sigma V^T
$$

where:
- $U$ is an $m \times m$ **orthogonal matrix** (rotation/reflection in the output space)
- $\Sigma$ is an $m \times n$ **diagonal matrix** (scaling along axes)
- $V$ is an $n \times n$ **orthogonal matrix** (rotation/reflection in the input space)

The diagonal entries of $\Sigma$ are called **singular values**, written $\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_r > 0$ where $r$ is the rank of $A$.

---

## Geometric Interpretation

Think of $A$ as a transformation from $\mathbb{R}^n$ to $\mathbb{R}^m$. The SVD says you can decompose this into:

1. **$V^T$**: Rotate the input space to align with the "natural axes" of $A$
2. **$\Sigma$**: Stretch along these axes (singular values tell you how much)
3. **$U$**: Rotate the result into the output space

The columns of $V$ (called **right singular vectors**) are the directions in the input space that $A$ acts on most cleanly. The columns of $U$ (called **left singular vectors**) are where those directions end up in the output space.

### Example: $2 \times 2$ matrix

Consider a matrix that stretches by 3 along one direction and by 2 along another:

$$
A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}
$$

The SVD reveals:
- $V$ rotates to align with $A$'s "principal directions"
- $\Sigma$ stretches by $\sigma_1 = 3$ and $\sigma_2 = 1$
- $U$ rotates back to the output orientation

Even though $A$ looks like it mixes $x$ and $y$, the SVD finds the hidden coordinate system where $A$ is just scaling.

---

## Why Not Just Use Eigendecomposition?

Eigendecomposition ($A = PDP^{-1}$) requires:
1. $A$ is **square** ($n \times n$)
2. $A$ has **$n$ linearly independent eigenvectors**

SVD requires **nothing**. It works for:
- Rectangular matrices ($m \times n$)
- Singular matrices (rank-deficient)
- Non-diagonalizable matrices
- Matrices with no real eigenvalues

Plus, $U$ and $V$ are **orthogonal**, so their inverses are just transposes,no need to compute $P^{-1}$.

---

## Connection to Eigenvalues

There's a beautiful relationship:
- The **singular values** of $A$ are the square roots of the **eigenvalues** of $A^TA$ (or $AA^T$)
- The **right singular vectors** (columns of $V$) are the **eigenvectors** of $A^TA$
- The **left singular vectors** (columns of $U$) are the **eigenvectors** of $AA^T$

This is why SVD always works: $A^TA$ is symmetric and positive semi-definite, so it *always* has real, non-negative eigenvalues and an orthonormal eigenbasis (by the Spectral Theorem).

### Derivation sketch

Start with $A = U\Sigma V^T$. Then:

$$
A^TA = (U\Sigma V^T)^T(U\Sigma V^T) = V\Sigma^T U^T U\Sigma V^T = V\Sigma^2 V^T
$$

This is an eigendecomposition of $A^TA$! The eigenvalues are $\sigma_i^2$ and the eigenvectors are the columns of $V$.

---

## Computing the SVD

**Algorithm:**

1. Compute $A^TA$ (an $n \times n$ symmetric matrix)
2. Find its eigenvalues $\lambda_1, \ldots, \lambda_n$ and eigenvectors $\mathbf{v}_1, \ldots, \mathbf{v}_n$
3. The singular values are $\sigma_i = \sqrt{\lambda_i}$
4. The columns of $V$ are the eigenvectors $\mathbf{v}_i$
5. Compute the columns of $U$ as $\mathbf{u}_i = \frac{1}{\sigma_i}A\mathbf{v}_i$ (for $\sigma_i \neq 0$)

(In practice, numerical libraries use more sophisticated algorithms like the Golub-Reinsch algorithm to avoid explicitly forming $A^TA$, which can be numerically unstable.)

---

## The Four Fundamental Subspaces

The SVD cleanly separates the **four fundamental subspaces**:

1. **Row space of $A$**: spanned by the first $r$ columns of $V$ (where $r = \text{rank}(A)$)
2. **Column space of $A$**: spanned by the first $r$ columns of $U$
3. **Null space of $A$**: spanned by the last $n - r$ columns of $V$ (singular values are zero)
4. **Left null space of $A$**: spanned by the last $m - r$ columns of $U$

The singular values tell you how "important" each direction is. Large singular values correspond to directions where $A$ stretches space significantly. Small (or zero) singular values correspond to directions where $A$ compresses or collapses space.

---

## Applications

### 1. **Low-Rank Approximation**

Suppose you want the "best" rank-$k$ approximation to $A$. Take the SVD and keep only the $k$ largest singular values:

$$
A_k = U_k \Sigma_k V_k^T
$$

where $U_k$ and $V_k$ contain only the first $k$ columns, and $\Sigma_k$ is the $k \times k$ diagonal matrix of the largest singular values.

**Eckart-Young Theorem**: $A_k$ is the closest rank-$k$ matrix to $A$ in both Frobenius and spectral norms.

This is the basis for **data compression**,you can store a huge matrix by keeping only the top singular values and vectors.

### 2. **Principal Component Analysis (PCA)**

In statistics and machine learning, PCA finds the directions of maximum variance in data. The algorithm:
1. Center your data matrix $X$ (subtract the mean)
2. Compute the SVD: $X = U\Sigma V^T$
3. The columns of $V$ are the **principal components**,the directions of maximum variance

The singular values $\sigma_i^2$ tell you how much variance is explained by each component.

### 3. **Pseudoinverse**

For non-square or singular matrices, the usual inverse doesn't exist. The **Moore-Penrose pseudoinverse** is:

$$
A^+ = V\Sigma^+ U^T
$$

where $\Sigma^+$ is formed by taking the reciprocal of each non-zero singular value.

This gives you the "best" solution to $A\mathbf{x} = \mathbf{b}$ in the least-squares sense when $A$ is not invertible.

### 4. **Image Compression**

Images are just matrices of pixel values. Take the SVD and keep only the top $k$ singular values. For a grayscale image, you've reduced storage from $m \times n$ numbers to $k(m + n + 1)$ numbers (storing $U_k$, $\Sigma_k$, and $V_k$).

For large images and small $k$, this is massive compression,and the image still looks recognizable because the largest singular values capture the "important" structure.

---

## Example: $3 \times 2$ Matrix

Let $A = \begin{bmatrix} 1 & 2 \\ 2 & 1 \\ 2 & 2 \end{bmatrix}$. This maps $\mathbb{R}^2 \to \mathbb{R}^3$.

**Step 1**: Compute $A^TA$:

$$
A^TA = \begin{bmatrix} 9 & 8 \\ 8 & 9 \end{bmatrix}
$$

**Step 2**: Find eigenvalues and eigenvectors of $A^TA$:

Characteristic polynomial: $\det(A^TA - \lambda I) = (9-\lambda)^2 - 64 = \lambda^2 - 18\lambda + 17 = (\lambda - 17)(\lambda - 1)$

Eigenvalues: $\lambda_1 = 17$, $\lambda_2 = 1$

Eigenvectors (normalized):
$$
\mathbf{v}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \end{bmatrix}, \quad \mathbf{v}_2 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -1 \end{bmatrix}
$$

**Step 3**: Singular values: $\sigma_1 = \sqrt{17}$, $\sigma_2 = 1$

**Step 4**: Compute $U$:

$$
\mathbf{u}_1 = \frac{1}{\sigma_1}A\mathbf{v}_1 = \frac{1}{\sqrt{17}} \begin{bmatrix} 3 \\ 3 \\ 4 \end{bmatrix} = \frac{1}{\sqrt{34}}\begin{bmatrix} 3 \\ 3 \\ 4\sqrt{2} \end{bmatrix}
$$

(I'll spare you the full calculation,this is tedious by hand, but straightforward.)

The result: $A = U\Sigma V^T$ where $\Sigma = \begin{bmatrix} \sqrt{17} & 0 \\ 0 & 1 \\ 0 & 0 \end{bmatrix}$.

---

## Why SVD Matters

SVD is arguably the most important matrix decomposition:
- **Always exists** (no restrictions on $A$)
- **Numerically stable** (orthogonal matrices have condition number 1)
- **Reveals structure** (rank, subspaces, importance of directions)
- **Enables approximation** (optimal low-rank approximations)

Eigendecomposition is cleaner for square matrices, but SVD is the tool that works on everything. It's the Swiss Army knife of linear algebra.

---

*Every matrix has a story,where it stretches, where it collapses, what structure it preserves. SVD tells you that story in the clearest possible way: rotate to the natural coordinates, scale by singular values, rotate back. Once you see it, you can't unsee it.*
