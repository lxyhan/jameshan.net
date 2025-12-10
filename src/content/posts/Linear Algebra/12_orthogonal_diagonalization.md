---
title: '12: Orthogonal Diagonalization and the Spectral Theorem'
pubDate: '2025-12-08'
---

Symmetric matrices have a special property: they can always be diagonalized using orthogonal eigenvectors. This means you can write $A = QDQ^T$ where $Q$ has orthonormal columns. The "orthogonal" part is crucial,instead of computing a full matrix inverse ($O(n^3)$), you just transpose ($O(n^2)$). Geometrically, symmetric matrices can only stretch along perpendicular axes, never rotate. This is the **Spectral Theorem**, and it's why symmetric matrices are the friendliest matrices in linear algebra.

## The Spectral Theorem

### **(Statement)**

Any **symmetric** matrix $A$ (meaning $A^T = A$) can be orthogonally diagonalized:

$$
A = QDQ^T
$$

where:
- $D$ is diagonal (eigenvalues on the diagonal)
- $Q$ is orthogonal (columns are orthonormal eigenvectors)

**Key property:** $Q^{-1} = Q^T$, so you transpose instead of inverting.

---

### **(Why This Matters)**

**Computational savings:**
- Matrix inverse: $O(n^3)$ operations
- Matrix transpose: $O(n^2)$ operations

When $Q^{-1} = Q^T$, all the expensive inversion work disappears.

**Geometric meaning:**
Rotate to the eigenvector basis (via $Q^T$), scale along axes (via $D$), rotate back (via $Q$).

Symmetric matrices **cannot rotate**,they only stretch along orthogonal axes. That's why eigenvectors are automatically perpendicular.

---

## Symmetric Matrices Are Special

### **(Why Eigenvectors Are Orthogonal)**

**Theorem:** If $A$ is symmetric, eigenvectors from different eigenvalues are orthogonal.

**Proof:**

Let $A\mathbf{v}_1 = \lambda_1\mathbf{v}_1$ and $A\mathbf{v}_2 = \lambda_2\mathbf{v}_2$ where $\lambda_1 \neq \lambda_2$.

$$
\lambda_1(\mathbf{v}_1 \cdot \mathbf{v}_2) = (\lambda_1\mathbf{v}_1) \cdot \mathbf{v}_2 = (A\mathbf{v}_1) \cdot \mathbf{v}_2
$$

Since $A$ is symmetric, $(A\mathbf{v}_1) \cdot \mathbf{v}_2 = \mathbf{v}_1 \cdot (A\mathbf{v}_2)$:

$$
= \mathbf{v}_1 \cdot (\lambda_2\mathbf{v}_2) = \lambda_2(\mathbf{v}_1 \cdot \mathbf{v}_2)
$$

So:
$$
\lambda_1(\mathbf{v}_1 \cdot \mathbf{v}_2) = \lambda_2(\mathbf{v}_1 \cdot \mathbf{v}_2)
$$

Since $\lambda_1 \neq \lambda_2$, we must have $\mathbf{v}_1 \cdot \mathbf{v}_2 = 0$. ✓

---

### **(Repeated Eigenvalues)**

When eigenvalues repeat, the corresponding eigenspace might have dimension > 1. But you can always choose an orthonormal basis within that eigenspace using **Gram-Schmidt**.

**Key insight:** For symmetric matrices, there's always enough "room" to find orthogonal eigenvectors, even when eigenvalues repeat. This is why the Spectral Theorem holds for all symmetric matrices.

---

### **(Symmetric Matrices Have Real Eigenvalues)**

**Theorem:** All eigenvalues of a real symmetric matrix are real.

This is crucial,complex eigenvalues would break the geometric interpretation. The proof uses the fact that $A = A^T$ forces eigenvalues to equal their complex conjugates, making them real.

---

## Orthogonal Matrices

### **(Definition)**

A matrix $Q$ is **orthogonal** if:

$$
Q^TQ = I
$$

Equivalently: $Q^{-1} = Q^T$ (transpose equals inverse).

**In terms of columns:** If $Q = [\mathbf{q}_1 \mid \cdots \mid \mathbf{q}_n]$, then the columns form an **orthonormal set**:

$$
\mathbf{q}_i \cdot \mathbf{q}_j = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \neq j \end{cases}
$$

---

### **(Properties of Orthogonal Matrices)**

**1. Preserve lengths:**

$$
\|Q\mathbf{v}\| = \|\mathbf{v}\|
$$

**Proof:** $\|Q\mathbf{v}\|^2 = (Q\mathbf{v})^T(Q\mathbf{v}) = \mathbf{v}^TQ^TQ\mathbf{v} = \mathbf{v}^T\mathbf{v} = \|\mathbf{v}\|^2$

**2. Preserve angles:**

$$
(Q\mathbf{u}) \cdot (Q\mathbf{v}) = \mathbf{u} \cdot \mathbf{v}
$$

**3. Preserve dot products:** Same as preserving angles.

**4. Determinant is $\pm 1$:**

$$
\det(Q^TQ) = \det(Q^T)\det(Q) = (\det Q)^2 = \det(I) = 1
$$

So $\det(Q) = \pm 1$.

---

### **(Geometric Interpretation)**

Orthogonal matrices represent:
- **Rotations:** $\det(Q) = 1$
- **Reflections:** $\det(Q) = -1$
- **Combinations:** Rotations and reflections preserve lengths and angles,that's exactly what orthogonal matrices do

**Key distinction:** Transpose reverses rotations/reflections, but doesn't undo stretching. That's why $Q^T = Q^{-1}$ only works for orthogonal matrices (no stretching component).

---

## The Spectral Decomposition

### **(The Formula)**

For a symmetric matrix $A$:

$$
A = QDQ^T = \sum_{i=1}^{n} \lambda_i \mathbf{q}_i\mathbf{q}_i^T
$$

where $\lambda_i$ are eigenvalues and $\mathbf{q}_i$ are orthonormal eigenvectors.

**Outer product form:** Each term $\mathbf{q}_i\mathbf{q}_i^T$ is a rank-1 projection matrix. The spectral decomposition says:

> *A symmetric matrix is a weighted sum of projections onto its eigenvectors, with weights equal to the eigenvalues.*

---

### **(Example: Spectral Decomposition)**

$$
A = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}
$$

**Find eigenvalues:**

$$
\det(A - \lambda I) = \det\begin{bmatrix} 3-\lambda & 1 \\ 1 & 3-\lambda \end{bmatrix} = (3-\lambda)^2 - 1 = \lambda^2 - 6\lambda + 8
$$

$$
= (\lambda - 4)(\lambda - 2) = 0
$$

Eigenvalues: $\lambda_1 = 4$, $\lambda_2 = 2$.

**Find eigenvectors:**

For $\lambda_1 = 4$:
$$
(A - 4I)\mathbf{v} = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}\mathbf{v} = \mathbf{0}
$$

Eigenvector: $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$, normalize: $\mathbf{q}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \end{bmatrix}$

For $\lambda_2 = 2$:
$$
(A - 2I)\mathbf{v} = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\mathbf{v} = \mathbf{0}
$$

Eigenvector: $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$, normalize: $\mathbf{q}_2 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -1 \end{bmatrix}$

**Build $Q$ and $D$:**

$$
Q = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \quad D = \begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix}
$$

**Verify:**

$$
QDQ^T = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix}\frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}
$$

$$
= \frac{1}{2}\begin{bmatrix} 4 & 2 \\ 4 & -2 \end{bmatrix}\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix} = \frac{1}{2}\begin{bmatrix} 6 & 2 \\ 2 & 6 \end{bmatrix} = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix} = A \quad ✓
$$

---

## Quadratic Forms and Principal Axes

### **(Quadratic Forms)**

A **quadratic form** is an expression:

$$
Q(\mathbf{x}) = \mathbf{x}^TA\mathbf{x}
$$

where $A$ is a symmetric matrix.

**Example in $\mathbb{R}^2$:**

$$
Q(x, y) = ax^2 + 2bxy + cy^2 = \begin{bmatrix} x & y \end{bmatrix}\begin{bmatrix} a & b \\ b & c \end{bmatrix}\begin{bmatrix} x \\ y \end{bmatrix}
$$

---

### **(Geometric Interpretation: Ellipsoids)**

The level set $\mathbf{x}^TA\mathbf{x} = 1$ defines a quadric surface:
- **Ellipsoid** if all eigenvalues are positive
- **Hyperboloid** if eigenvalues have mixed signs
- **Degenerate** if any eigenvalue is zero

The **eigenvectors** of $A$ are the **principal axes** of this quadric,they point along the directions of maximum and minimum stretching.

---

### **(Diagonalizing Quadratic Forms)**

Using $A = QDQ^T$, substitute $\mathbf{x} = Q\mathbf{y}$:

$$
\mathbf{x}^TA\mathbf{x} = (Q\mathbf{y})^TQD Q^T(Q\mathbf{y}) = \mathbf{y}^TQ^TQ D Q^TQ\mathbf{y} = \mathbf{y}^TD\mathbf{y}
$$

$$
= \lambda_1 y_1^2 + \lambda_2 y_2^2 + \cdots + \lambda_n y_n^2
$$

**In the eigenvector basis**, the quadratic form has no cross terms,it's just a sum of squares with weights $\lambda_i$.

**Example:** The ellipse $3x^2 + 2xy + 3y^2 = 1$ (from our earlier $A$) becomes $4u^2 + 2v^2 = 1$ in the eigenvector coordinates, where axes are rotated by $45°$.

---

## Why Transpose ≠ Inverse (Usually)

For a general matrix $A$:

$$
A^T \neq A^{-1}
$$

**Why?** Transpose reverses the direction of a transformation (rotations/reflections) but **doesn't undo stretching**.

If $A$ stretches by factor $\sigma$ in some direction, then:
- $A^T$ still stretches by $\sigma$ in the corresponding direction (transpose doesn't change singular values)
- $A^{-1}$ compresses by factor $1/\sigma$ (actually inverts the stretching)

**When they're equal:** $A^T = A^{-1}$ precisely when $A$ has no stretching component,when it's a pure rotation or reflection. These are the **orthogonal matrices**.

---

## Connection to SVD

### **(The Setup)**

For a **non-square** matrix $A$ ($m \times n$), you can't do eigendecomposition directly. But the matrix $A^TA$ ($n \times n$) is symmetric, so it has orthonormal eigenvectors.

These eigenvectors of $A^TA$ are the **right singular vectors** of $A$,the optimal input directions.

---

### **(Singular Values from $A^TA$)**

For an eigenvector $\mathbf{v}$ of $A^TA$ with eigenvalue $\lambda$:

$$
\|A\mathbf{v}\|^2 = (A\mathbf{v})^T(A\mathbf{v}) = \mathbf{v}^TA^TA\mathbf{v} = \mathbf{v}^T(\lambda\mathbf{v}) = \lambda\|\mathbf{v}\|^2
$$

If $\mathbf{v}$ is normalized ($\|\mathbf{v}\| = 1$):

$$
\|A\mathbf{v}\| = \sqrt{\lambda}
$$

The **singular values** $\sigma_i$ are defined as:

$$
\sigma_i = \sqrt{\lambda_i}
$$

where $\lambda_i$ are the eigenvalues of $A^TA$.

---

### **(SVD Mechanics)**

To build the **Singular Value Decomposition** $A = U\Sigma V^T$:

1. **Compute $A^TA$** (symmetric, $n \times n$)
2. **Find eigenvalues** $\lambda_1, \ldots, \lambda_r$ (rank $r$)
3. **Compute singular values:** $\sigma_i = \sqrt{\lambda_i}$
4. **Find eigenvectors** of $A^TA$ → normalize → columns of $V$
5. **Apply $A$ to eigenvectors:** $\mathbf{u}_i = \frac{1}{\sigma_i}A\mathbf{v}_i$ → columns of $U$
6. **Assemble:** $A = U\Sigma V^T$

**Key formulas:**

$$
\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^T\mathbf{v} \quad \text{(dot product as matrix multiplication)}
$$

$$
(A\mathbf{v})^T = \mathbf{v}^TA^T \quad \text{(transpose distributes in reverse)}
$$

$$
\|A\mathbf{v}\|^2 = \mathbf{v}^TA^TA\mathbf{v} \quad \text{(length via } A^TA \text{)}
$$

---

## Special Matrices

### **(Involutions: $A^2 = I$)**

Matrices satisfying $A^2 = I$ are called **involutions**,applying them twice returns to the original.

**Examples:**
- Reflections across a line or plane
- Swap matrices (permutations that swap pairs)

For symmetric involutions, eigenvalues are $\pm 1$.

---

### **(Finite Order: $A^n = I$)**

Matrices where $A^n = I$ for some integer $n$ have **finite order**.

**Examples:**
- Rotation by $360°/n$ (order $n$)
- Cyclic permutations

Eigenvalues are $n$-th roots of unity: $e^{2\pi i k / n}$ for $k = 0, 1, \ldots, n-1$.

---

## Applications

### **(Principal Component Analysis)**

PCA finds the directions of maximum variance in data. Given a covariance matrix $C$ (symmetric!), the eigenvectors are the **principal components**, and eigenvalues measure variance along each component.

The spectral decomposition directly gives you the optimal low-rank approximation.

---

### **(Vibrational Modes)**

In physics, symmetric matrices appear as **stiffness** or **inertia** matrices. Eigenvectors represent vibrational modes (standing waves), and eigenvalues give frequencies.

---

### **(Stability Analysis)**

For the system $\frac{d\mathbf{x}}{dt} = A\mathbf{x}$ where $A$ is symmetric:
- Negative eigenvalues → stable (exponential decay)
- Positive eigenvalues → unstable (exponential growth)
- Zero eigenvalue → neutral stability

The orthogonal eigenvectors decouple the system into independent modes.

---

## Summary: Why Symmetric Matrices Are Perfect

Symmetric matrices are the gold standard because:

1. **Always diagonalizable** (Spectral Theorem)
2. **Real eigenvalues** (no complex numbers)
3. **Orthogonal eigenvectors** (automatic perpendicularity)
4. **Efficient inversion** ($Q^T$ instead of $Q^{-1}$)
5. **Geometric clarity** (stretch along perpendicular axes, no rotation)
6. **Numerical stability** (orthogonal transformations preserve conditioning)

The Spectral Theorem says symmetric matrices live in the simplest possible world: they're diagonal in the right coordinate system, and finding that system is straightforward. Whenever you see $A = A^T$, you know the geometry is clean, the computation is efficient, and the eigenvectors will behave.
