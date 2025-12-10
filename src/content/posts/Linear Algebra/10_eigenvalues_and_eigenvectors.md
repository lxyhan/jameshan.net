---
title: 'Eigenvalues and Eigenvectors'
pubDate: '2025-12-08'
---

Most vectors change direction when you apply a matrix to them. But **eigenvectors** don't—they stay on their own line, just getting stretched or compressed. These special directions reveal the "skeleton" of a transformation. The stretch factor is the **eigenvalue**. Together, eigenvalues and eigenvectors tell you what a matrix really does, stripped of coordinate system noise.

Finding eigenvectors means asking: "What directions does this transformation leave invariant?" The answer unlocks everything—stability analysis, matrix powers, differential equations, Google's PageRank. Eigenvectors are the natural coordinates where complicated transformations become simple.

---

## The Definition

### **(Eigenvector and Eigenvalue)**

Let $A$ be an $n \times n$ matrix. A nonzero vector $\mathbf{v}$ is an **eigenvector** of $A$ if there exists a scalar $\lambda$ such that:

$$
A\mathbf{v} = \lambda \mathbf{v}
$$

The scalar $\lambda$ is the **eigenvalue** corresponding to $\mathbf{v}$.

**What this means:** Applying $A$ to $\mathbf{v}$ just scales $\mathbf{v}$—no rotation, no shear, just stretching (or compressing, or flipping) by factor $\lambda$.

---

### **(Why "Eigen"?)**

The German word *eigen* means "characteristic" or "own." Eigenvectors are the matrix's "own vectors"—the directions intrinsic to the transformation itself, independent of any choice of coordinates.

---

## Geometric Intuition

### **(Invariant Directions)**

Think of a transformation as a physical process: stretching rubber, flowing water, rotating machinery. Most directions get mixed—a vector pointing northeast might end up pointing south after transformation.

But **eigenvectors are special**: they point along axes that the transformation respects. Apply the matrix, and the vector stays on its own line.

**Example:** Consider a transformation that:
- Stretches horizontally by factor 3
- Stretches vertically by factor 2

The eigenvectors are $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ (horizontal, $\lambda = 3$) and $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$ (vertical, $\lambda = 2$).

---

### **(Eigenvalues as Stretch Factors)**

The eigenvalue $\lambda$ tells you **how much** the eigenvector gets scaled:
- $\lambda > 1$: Stretch (expansion)
- $0 < \lambda < 1$: Compression
- $\lambda = 1$: No change
- $\lambda = 0$: Collapse to zero
- $\lambda < 0$: Flip direction, then scale by $|\lambda|$

**Example:** $\lambda = -2$ means the eigenvector flips and doubles in length.

---

### **(Visualization in 2D)**

For a $2 \times 2$ matrix, eigenvectors define two special axes. The transformation:
1. Stretches along the first eigenvector by $\lambda_1$
2. Stretches along the second eigenvector by $\lambda_2$

Every other vector is a combination of these eigenvectors, so it gets stretched in a complicated way. But the eigenvectors themselves just scale.

---

## Finding Eigenvalues

### **(The Characteristic Equation)**

Rewrite $A\mathbf{v} = \lambda\mathbf{v}$ as:

$$
A\mathbf{v} = \lambda I \mathbf{v}
$$

$$
(A - \lambda I)\mathbf{v} = \mathbf{0}
$$

For a nontrivial solution $\mathbf{v} \neq \mathbf{0}$ to exist, the matrix $(A - \lambda I)$ must be **singular**:

$$
\det(A - \lambda I) = 0
$$

This is the **characteristic equation**. It's a polynomial equation in $\lambda$.

---

### **(The Characteristic Polynomial)**

Expanding $\det(A - \lambda I)$ gives a polynomial of degree $n$ (for an $n \times n$ matrix):

$$
p(\lambda) = \det(A - \lambda I)
$$

The roots of this polynomial are the eigenvalues.

**Key fact:** An $n \times n$ matrix has exactly $n$ eigenvalues (counting multiplicity), though some may be complex.

---

### **(Example: 2×2 Matrix)**

Find the eigenvalues of:

$$
A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}
$$

**Step 1:** Compute $A - \lambda I$:

$$
A - \lambda I = \begin{bmatrix} 4 - \lambda & 1 \\ 2 & 3 - \lambda \end{bmatrix}
$$

**Step 2:** Find the determinant:

$$
\det(A - \lambda I) = (4 - \lambda)(3 - \lambda) - (1)(2)
$$

$$
= 12 - 4\lambda - 3\lambda + \lambda^2 - 2
$$

$$
= \lambda^2 - 7\lambda + 10
$$

**Step 3:** Solve $\lambda^2 - 7\lambda + 10 = 0$:

$$
(\lambda - 5)(\lambda - 2) = 0
$$

**Eigenvalues:** $\lambda_1 = 5$, $\lambda_2 = 2$.

---

### **(Example: 3×3 Matrix)**

Find the eigenvalues of:

$$
A = \begin{bmatrix} 2 & 0 & 0 \\ 1 & 2 & 0 \\ 0 & 1 & 3 \end{bmatrix}
$$

This is upper triangular, so the eigenvalues are the diagonal entries:

$$
\lambda_1 = 2, \quad \lambda_2 = 2, \quad \lambda_3 = 3
$$

**Key shortcut:** For triangular (or diagonal) matrices, eigenvalues are just the diagonal entries.

---

## Finding Eigenvectors

Once you have an eigenvalue $\lambda$, find its eigenvectors by solving:

$$
(A - \lambda I)\mathbf{v} = \mathbf{0}
$$

This is a homogeneous system—row reduce and find the null space of $(A - \lambda I)$.

---

### **(Example: Eigenvectors for $\lambda_1 = 5$)**

From before, $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$ has $\lambda_1 = 5$.

$$
A - 5I = \begin{bmatrix} -1 & 1 \\ 2 & -2 \end{bmatrix}
$$

Row reduce:

$$
\begin{bmatrix} -1 & 1 \\ 2 & -2 \end{bmatrix} \xrightarrow{R_2 + 2R_1} \begin{bmatrix} -1 & 1 \\ 0 & 0 \end{bmatrix}
$$

From $-v_1 + v_2 = 0$, we get $v_2 = v_1$.

**Eigenvector:** $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (or any nonzero scalar multiple).

**Verify:**

$$
A\mathbf{v}_1 = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}\begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 5 \\ 5 \end{bmatrix} = 5\begin{bmatrix} 1 \\ 1 \end{bmatrix} \quad ✓
$$

---

### **(Example: Eigenvectors for $\lambda_2 = 2$)**

$$
A - 2I = \begin{bmatrix} 2 & 1 \\ 2 & 1 \end{bmatrix}
$$

Row reduce:

$$
\begin{bmatrix} 2 & 1 \\ 2 & 1 \end{bmatrix} \xrightarrow{R_2 - R_1} \begin{bmatrix} 2 & 1 \\ 0 & 0 \end{bmatrix}
$$

From $2v_1 + v_2 = 0$, we get $v_2 = -2v_1$.

**Eigenvector:** $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$.

**Verify:**

$$
A\mathbf{v}_2 = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}\begin{bmatrix} 1 \\ -2 \end{bmatrix} = \begin{bmatrix} 2 \\ -4 \end{bmatrix} = 2\begin{bmatrix} 1 \\ -2 \end{bmatrix} \quad ✓
$$

---

## Eigenspaces

### **(Definition)**

For each eigenvalue $\lambda$, the **eigenspace** $E_\lambda$ is the set of all eigenvectors corresponding to $\lambda$, plus the zero vector:

$$
E_\lambda = \ker(A - \lambda I) = \{\mathbf{v} \mid A\mathbf{v} = \lambda\mathbf{v}\}
$$

The eigenspace is a **subspace** of $\mathbb{R}^n$.

---

### **(Geometric Multiplicity)**

The **geometric multiplicity** of $\lambda$ is:

$$
\text{geometric multiplicity} = \dim(E_\lambda)
$$

This is the number of linearly independent eigenvectors for $\lambda$.

**In the example above:**
- $E_5 = \text{span}\left\{\begin{bmatrix} 1 \\ 1 \end{bmatrix}\right\}$ has dimension 1
- $E_2 = \text{span}\left\{\begin{bmatrix} 1 \\ -2 \end{bmatrix}\right\}$ has dimension 1

---

## Algebraic vs Geometric Multiplicity

### **(Algebraic Multiplicity)**

The **algebraic multiplicity** of $\lambda$ is how many times $\lambda$ appears as a root of the characteristic polynomial.

**Example:** If $p(\lambda) = (\lambda - 3)^2(\lambda - 1)$, then:
- $\lambda = 3$ has algebraic multiplicity 2
- $\lambda = 1$ has algebraic multiplicity 1

---

### **(Key Inequality)**

For any eigenvalue $\lambda$:

$$
1 \leq \text{geometric multiplicity} \leq \text{algebraic multiplicity}
$$

**When they're equal:** The matrix behaves "nicely" for that eigenvalue—there are enough eigenvectors to span the eigenspace fully.

**When they differ:** The matrix is **defective** for that eigenvalue—there aren't enough independent eigenvectors.

---

### **(Example: Defective Matrix)**

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
$$

**Characteristic polynomial:**

$$
\det(A - \lambda I) = (2 - \lambda)^2 = 0
$$

$\lambda = 2$ has **algebraic multiplicity 2**.

**Find eigenvectors:**

$$
A - 2I = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}
$$

From $v_2 = 0$, the eigenspace is:

$$
E_2 = \text{span}\left\{\begin{bmatrix} 1 \\ 0 \end{bmatrix}\right\}
$$

**Geometric multiplicity:** 1 (only one independent eigenvector).

Since geometric < algebraic, this matrix is **defective** and cannot be diagonalized.

---

## Properties of Eigenvalues and Eigenvectors

### **(Linearity of Eigenspaces)**

If $\mathbf{v}_1$ and $\mathbf{v}_2$ are eigenvectors with the **same** eigenvalue $\lambda$, then any linear combination $c_1\mathbf{v}_1 + c_2\mathbf{v}_2$ is also an eigenvector with eigenvalue $\lambda$.

**Proof:**

$$
A(c_1\mathbf{v}_1 + c_2\mathbf{v}_2) = c_1A\mathbf{v}_1 + c_2A\mathbf{v}_2 = c_1\lambda\mathbf{v}_1 + c_2\lambda\mathbf{v}_2 = \lambda(c_1\mathbf{v}_1 + c_2\mathbf{v}_2)
$$

This is why eigenspaces are subspaces.

---

### **(Independence Across Eigenvalues)**

**Theorem:** Eigenvectors corresponding to **distinct** eigenvalues are linearly independent.

**Why this matters:** If you have $n$ distinct eigenvalues for an $n \times n$ matrix, you automatically have $n$ independent eigenvectors—the matrix is diagonalizable.

---

### **(Eigenvalues of Special Matrices)**

**1. Triangular matrices:** Eigenvalues are the diagonal entries.

**2. Identity matrix:** $\lambda = 1$ with multiplicity $n$ (every vector is an eigenvector).

**3. Zero matrix:** $\lambda = 0$ with multiplicity $n$.

**4. Projection matrix:** Eigenvalues are 0 and 1 only.

**5. Rotation matrix (by angle $\theta \neq 0, \pi$):** Complex eigenvalues $e^{i\theta}$ and $e^{-i\theta}$ (no real eigenvectors—rotations have no invariant directions in 2D).

---

## The Trace and Determinant

### **(Sum of Eigenvalues = Trace)**

The **trace** of $A$ (sum of diagonal entries) equals the sum of eigenvalues:

$$
\text{tr}(A) = \lambda_1 + \lambda_2 + \cdots + \lambda_n
$$

**Example:** $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$ has eigenvalues 5 and 2.

$$
\text{tr}(A) = 4 + 3 = 7 = 5 + 2 \quad ✓
$$

---

### **(Product of Eigenvalues = Determinant)**

The determinant of $A$ equals the product of eigenvalues:

$$
\det(A) = \lambda_1 \lambda_2 \cdots \lambda_n
$$

**Example:**

$$
\det(A) = 4(3) - 1(2) = 10 = 5 \times 2 \quad ✓
$$

**Why this matters:** If $\det(A) = 0$, then at least one eigenvalue is zero, meaning $A$ is singular.

---

## Complex Eigenvalues

### **(Real Matrices Can Have Complex Eigenvalues)**

Even if $A$ has all real entries, its eigenvalues might be complex.

**Example:** Rotation by $90°$:

$$
A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}
$$

**Characteristic polynomial:**

$$
\det(A - \lambda I) = \det\begin{bmatrix} -\lambda & -1 \\ 1 & -\lambda \end{bmatrix} = \lambda^2 + 1 = 0
$$

**Eigenvalues:** $\lambda = \pm i$ (purely imaginary).

**Interpretation:** Rotations in 2D have no real invariant directions—every vector gets rotated off its line.

---

### **(Complex Eigenvalues Come in Conjugate Pairs)**

For real matrices, complex eigenvalues come in conjugate pairs: if $\lambda = a + bi$ is an eigenvalue, so is $\overline{\lambda} = a - bi$.

---

## Applications

### **(1. Stability Analysis)**

For the differential equation $\frac{d\mathbf{x}}{dt} = A\mathbf{x}$:
- If all eigenvalues have $\text{Re}(\lambda) < 0$: System is **stable** (solutions decay to zero)
- If any eigenvalue has $\text{Re}(\lambda) > 0$: System is **unstable** (solutions explode)
- If eigenvalues have $\text{Re}(\lambda) = 0$: Neutral stability

The eigenvectors give the "modes" of the system—independent directions of behavior.

---

### **(2. Matrix Powers)**

If $\mathbf{v}$ is an eigenvector with eigenvalue $\lambda$, then:

$$
A^k\mathbf{v} = \lambda^k\mathbf{v}
$$

**Why:** $A(A\mathbf{v}) = A(\lambda\mathbf{v}) = \lambda(A\mathbf{v}) = \lambda^2\mathbf{v}$, and so on.

The eigenvector with the largest $|\lambda|$ dominates long-term behavior—this is why PageRank works.

---

### **(3. Google PageRank)**

Google's PageRank treats the web as a giant matrix $A$ where $A_{ij}$ represents links from page $j$ to page $i$. The "importance" of pages is the eigenvector corresponding to the largest eigenvalue (which is 1 for a properly normalized matrix).

---

### **(4. Vibrations and Oscillations)**

In mechanical systems, eigenvalues give frequencies of vibration, and eigenvectors give the vibrational modes (standing wave patterns).

---

### **(5. Principal Component Analysis (PCA)**

In statistics, PCA finds the eigenvectors of the covariance matrix. These eigenvectors point in directions of maximum variance—they're the "principal components" that capture the most information in the data.

---

## Computing Eigenvalues: The Algorithm

For small matrices (2×2, 3×3), you can:
1. Compute $\det(A - \lambda I)$ by hand
2. Solve the characteristic polynomial
3. For each $\lambda$, solve $(A - \lambda I)\mathbf{v} = \mathbf{0}$

For larger matrices, this is computationally impractical (solving degree-$n$ polynomials is hard). Instead, numerical methods are used:
- **QR algorithm:** Iteratively factor $A = QR$, then form $RQ$, repeat
- **Power iteration:** Find the dominant eigenvalue by repeatedly multiplying $A\mathbf{x}$
- **Inverse iteration:** Find specific eigenvalues by inverting $(A - \mu I)$

These methods are what numerical libraries use—they avoid computing the characteristic polynomial directly.

---

## Why Eigenvectors Are Fundamental

Eigenvectors are the **natural coordinates** for a matrix. In the eigenvector basis, the matrix is diagonal—just scaling, no mixing. This is why:

1. **Diagonalization works:** If you have enough eigenvectors, you can change to a basis where $A$ is diagonal.

2. **Long-term behavior is simple:** The eigenvector with the largest eigenvalue dominates as $k \to \infty$ in $A^k$.

3. **Systems decouple:** Differential equations split into independent modes along eigenvectors.

4. **Structure is revealed:** Eigenvalues tell you if a matrix is invertible (no zero eigenvalues), symmetric (real eigenvalues), orthogonal ($|\lambda| = 1$), etc.

Every matrix is "trying" to be diagonal. Eigenvectors show you the coordinate system where this is true.

Next, we'll use eigenvalues and eigenvectors to **diagonalize** matrices—writing $A = PDP^{-1}$ where $D$ is diagonal. This unlocks matrix powers, exponentials, and the ability to solve $A^k$ or $e^{At}$ effortlessly.
