---
title: '11: Diagonalization and Similarity'
pubDate: '2025-12-08'
---

Diagonalization converts a complicated matrix into the simplest possible form: a diagonal matrix. When you can diagonalize a matrix $A$, you've found the "eigenvector coordinate system" where $A$ just stretches along axes. This makes everything easier,computing powers, solving differential equations, understanding long-term behavior. The key is finding enough eigenvectors to build a new basis.

## What is Diagonalization?

### **(The Goal)**

A square $n \times n$ matrix $A$ is **diagonalizable** if it can be written as:

$$
A = PDP^{-1}
$$

where:
- $D$ is a diagonal matrix (eigenvalues on the diagonal)
- $P$ is an invertible matrix (eigenvectors as columns)

**Geometric meaning:** In the eigenvector basis, $A$ is just a scaling transformation. The columns of $P$ define this special coordinate system, $D$ tells you the scaling factors, and $P^{-1}$ converts back.

---

### **(Why This Matters)**

Once you have $A = PDP^{-1}$, everything becomes easier:

**Powers:**
$$
A^k = PD^kP^{-1}
$$

Computing $D^k$ is trivial,just raise each diagonal entry to the $k$-th power.

**Matrix exponential:**
$$
e^{At} = Pe^{Dt}P^{-1}
$$

where $e^{Dt}$ has $e^{\lambda_i t}$ on the diagonal.

**Long-term behavior:** The dominant eigenvalue (largest $|\lambda|$) determines if $A^k \to 0$, explodes, or oscillates.

---

## Eigenvalues and Eigenvectors

### **(Definition)**

A scalar $\lambda$ is an **eigenvalue** of $A$ if there exists a nonzero vector $\mathbf{v}$ such that:

$$
A\mathbf{v} = \lambda \mathbf{v}
$$

The vector $\mathbf{v}$ is an **eigenvector** corresponding to $\lambda$.

**Interpretation:** Eigenvectors are the special directions where $A$ acts like pure scaling,no rotation, just stretch or compression by factor $\lambda$.

---

### **(Finding Eigenvalues)**

Rewrite $A\mathbf{v} = \lambda \mathbf{v}$ as:

$$
(A - \lambda I)\mathbf{v} = \mathbf{0}
$$

For a nontrivial solution to exist, $A - \lambda I$ must be singular:

$$
\det(A - \lambda I) = 0
$$

This is the **characteristic equation**. Expanding it gives a polynomial of degree $n$ in $\lambda$,the **characteristic polynomial**.

---

### **(Example: Finding Eigenvalues)**

$$
A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}
$$

Compute $\det(A - \lambda I)$:

$$
\det\begin{bmatrix} 4-\lambda & 1 \\ 2 & 3-\lambda \end{bmatrix} = (4-\lambda)(3-\lambda) - 2 = \lambda^2 - 7\lambda + 10
$$

$$
= (\lambda - 5)(\lambda - 2) = 0
$$

Eigenvalues: $\lambda_1 = 5$, $\lambda_2 = 2$.

---

### **(Finding Eigenvectors)**

For each eigenvalue $\lambda$, solve $(A - \lambda I)\mathbf{v} = \mathbf{0}$ to find the corresponding eigenvector(s).

**For $\lambda_1 = 5$:**

$$
(A - 5I)\mathbf{v} = \begin{bmatrix} -1 & 1 \\ 2 & -2 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \mathbf{0}
$$

Row reduce: Both rows give $-v_1 + v_2 = 0$, so $v_2 = v_1$.

Eigenvector: $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (or any nonzero scalar multiple)

**For $\lambda_2 = 2$:**

$$
(A - 2I)\mathbf{v} = \begin{bmatrix} 2 & 1 \\ 2 & 1 \end{bmatrix}\begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \mathbf{0}
$$

Row reduce: $2v_1 + v_2 = 0$, so $v_2 = -2v_1$.

Eigenvector: $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$

---

## The Diagonalization Process

### **(Diagonalization Theorem)**

An $n \times n$ matrix $A$ is diagonalizable if and only if $A$ has $n$ linearly independent eigenvectors.

When this holds:
1. Let $P = [\mathbf{v}_1 \mid \mathbf{v}_2 \mid \cdots \mid \mathbf{v}_n]$ (eigenvectors as columns)
2. Let $D = \text{diag}(\lambda_1, \lambda_2, \ldots, \lambda_n)$ (corresponding eigenvalues)

Then:
$$
A = PDP^{-1} \quad \text{or equivalently} \quad AP = PD
$$

---

### **(Why This Works)**

The equation $AP = PD$ says:

$$
A[\mathbf{v}_1 \mid \mathbf{v}_2 \mid \cdots \mid \mathbf{v}_n] = [\lambda_1\mathbf{v}_1 \mid \lambda_2\mathbf{v}_2 \mid \cdots \mid \lambda_n\mathbf{v}_n]
$$

Column by column, this is exactly $A\mathbf{v}_i = \lambda_i\mathbf{v}_i$,the defining property of eigenvectors.

Multiplying on the right by $P^{-1}$ gives $A = PDP^{-1}$.

---

### **(Example: Diagonalizing a Matrix)**

From before: $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$ with:
- $\lambda_1 = 5$, $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$
- $\lambda_2 = 2$, $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -2 \end{bmatrix}$

Build $P$ and $D$:

$$
P = \begin{bmatrix} 1 & 1 \\ 1 & -2 \end{bmatrix}, \quad D = \begin{bmatrix} 5 & 0 \\ 0 & 2 \end{bmatrix}
$$

Compute $P^{-1}$:

$$
P^{-1} = \frac{1}{-3}\begin{bmatrix} -2 & -1 \\ -1 & 1 \end{bmatrix} = \begin{bmatrix} 2/3 & 1/3 \\ 1/3 & -1/3 \end{bmatrix}
$$

Verify:

$$
PDP^{-1} = \begin{bmatrix} 1 & 1 \\ 1 & -2 \end{bmatrix}\begin{bmatrix} 5 & 0 \\ 0 & 2 \end{bmatrix}\begin{bmatrix} 2/3 & 1/3 \\ 1/3 & -1/3 \end{bmatrix}
$$

$$
= \begin{bmatrix} 5 & 2 \\ 5 & -4 \end{bmatrix}\begin{bmatrix} 2/3 & 1/3 \\ 1/3 & -1/3 \end{bmatrix} = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix} = A \quad ✓
$$

---

## Similar Matrices

### **(Definition)**

Two matrices $A$ and $B$ are **similar** if there exists an invertible matrix $P$ such that:

$$
B = P^{-1}AP
$$

**Interpretation:** Similar matrices represent the same linear transformation in different bases. They have the same intrinsic properties but different coordinate representations.

---

### **(Properties Preserved by Similarity)**

If $A$ and $B$ are similar, they share:

1. **Determinant:** $\det(B) = \det(A)$
2. **Trace:** $\text{tr}(B) = \text{tr}(A)$ (sum of diagonal entries)
3. **Eigenvalues:** Same characteristic polynomial, same eigenvalues (with multiplicity)
4. **Rank:** $\text{rank}(B) = \text{rank}(A)$
5. **Invertibility:** $A$ invertible $\iff$ $B$ invertible

**Why?** All these properties are basis-independent,they depend only on the transformation itself, not the coordinate system.

---

### **(Diagonalization as Similarity)**

When $A = PDP^{-1}$, we're saying $A$ is similar to a diagonal matrix $D$.

**Key insight:** Diagonalizable matrices are exactly those that are similar to diagonal matrices. The "nicest" matrices are those you can represent diagonally in some basis.

---

## When Is a Matrix Diagonalizable?

### **(Sufficient Condition: Distinct Eigenvalues)**

**Theorem:** If an $n \times n$ matrix has $n$ distinct eigenvalues, it is diagonalizable.

**Why?** Eigenvectors from different eigenvalues are automatically linearly independent. So $n$ distinct eigenvalues gives you $n$ independent eigenvectors.

**Example:** $A = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}$ has eigenvalues $3$ and $-1$ (distinct), so it's diagonalizable.

---

### **(Repeated Eigenvalues: It Depends)**

When eigenvalues repeat, diagonalizability depends on whether there are enough eigenvectors.

**Algebraic vs Geometric Multiplicity:**

For an eigenvalue $\lambda$:
- **Algebraic multiplicity:** How many times $\lambda$ appears as a root of the characteristic polynomial
- **Geometric multiplicity:** $\dim(\ker(A - \lambda I))$,the number of linearly independent eigenvectors for $\lambda$

**Key fact:** Always: geometric multiplicity $\leq$ algebraic multiplicity

**Diagonalizability condition:** $A$ is diagonalizable if and only if **for every eigenvalue**, geometric multiplicity equals algebraic multiplicity.

---

### **(Example: Diagonalizable with Repeated Eigenvalue)**

$$
A = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 3 \end{bmatrix}
$$

Eigenvalue $\lambda = 2$ has algebraic multiplicity 2.

Check geometric multiplicity:

$$
A - 2I = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

$\dim(\ker(A - 2I)) = 2$ (the first two basis vectors are eigenvectors).

Since geometric = algebraic for all eigenvalues, $A$ is diagonalizable (it's already diagonal!).

---

### **(Example: Not Diagonalizable)**

$$
A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
$$

Eigenvalue: $\lambda = 2$ with algebraic multiplicity 2.

$$
A - 2I = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}
$$

$\dim(\ker(A - 2I)) = 1$,only one independent eigenvector $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$.

Since geometric (1) < algebraic (2), $A$ is **not diagonalizable**.

---

## Computing Powers of Matrices

### **(The Power Formula)**

If $A = PDP^{-1}$, then:

$$
A^k = PD^kP^{-1}
$$

where $D^k = \text{diag}(\lambda_1^k, \lambda_2^k, \ldots, \lambda_n^k)$.

**Why this works:**

$$
A^2 = (PDP^{-1})(PDP^{-1}) = PD(P^{-1}P)DP^{-1} = PD^2P^{-1}
$$

By induction, $A^k = PD^kP^{-1}$.

---

### **(Example)**

Compute $A^{10}$ for $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$.

We found:

$$
P = \begin{bmatrix} 1 & 1 \\ 1 & -2 \end{bmatrix}, \quad D = \begin{bmatrix} 5 & 0 \\ 0 & 2 \end{bmatrix}, \quad P^{-1} = \begin{bmatrix} 2/3 & 1/3 \\ 1/3 & -1/3 \end{bmatrix}
$$

$$
D^{10} = \begin{bmatrix} 5^{10} & 0 \\ 0 & 2^{10} \end{bmatrix} = \begin{bmatrix} 9765625 & 0 \\ 0 & 1024 \end{bmatrix}
$$

$$
A^{10} = PD^{10}P^{-1}
$$

Computing this is far easier than multiplying $A$ ten times!

---

### **(Long-Term Behavior)**

As $k \to \infty$, $A^k$ is dominated by the **largest eigenvalue** (in absolute value).

- If $|\lambda_{\max}| < 1$: $A^k \to 0$ (everything decays)
- If $|\lambda_{\max}| = 1$: Bounded behavior (might oscillate)
- If $|\lambda_{\max}| > 1$: $A^k$ explodes (growth along dominant eigenvector)

**Application:** In Markov chains, Leslie models, discrete dynamical systems,eigenvalues control the long-term fate.

---

## Change of Basis Perspective

### **(What $P$ Does)**

The matrix $P$ performs a **change of basis** from the standard basis to the eigenvector basis.

**In the eigenvector basis:**
- Coordinates: $[\mathbf{x}]_{\mathcal{B}} = P^{-1}\mathbf{x}$
- Transformation: $[A]_{\mathcal{B}} = D$ (diagonal!)
- The transformation is just scaling along each eigenvector direction

**In the standard basis:**
- Coordinates: $\mathbf{x}$
- Transformation: $A$
- The transformation looks complicated because we're using the "wrong" coordinates

**The diagonalization formula:**

$$
A = PDP^{-1}
$$

can be read as:
1. $P^{-1}$: Convert from standard to eigenvector basis
2. $D$: Apply the simple diagonal transformation
3. $P$: Convert back to standard basis

---

## Applications

### **(Differential Equations)**

The system $\frac{d\mathbf{x}}{dt} = A\mathbf{x}$ has solution:

$$
\mathbf{x}(t) = e^{At}\mathbf{x}(0)
$$

If $A = PDP^{-1}$:

$$
e^{At} = Pe^{Dt}P^{-1} = P\begin{bmatrix} e^{\lambda_1 t} & & \\ & \ddots & \\ & & e^{\lambda_n t} \end{bmatrix}P^{-1}
$$

The eigenvectors give you the "modes" of the system, and eigenvalues tell you whether each mode grows or decays.

---

### **(Fibonacci Numbers)**

The Fibonacci recurrence $F_{n+1} = F_n + F_{n-1}$ can be written as:

$$
\begin{bmatrix} F_{n+1} \\ F_n \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}\begin{bmatrix} F_n \\ F_{n-1} \end{bmatrix}
$$

Diagonalizing $A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$ gives eigenvalues $\phi = \frac{1+\sqrt{5}}{2}$ (golden ratio) and $\hat{\phi} = \frac{1-\sqrt{5}}{2}$.

This leads to Binet's formula:

$$
F_n = \frac{\phi^n - \hat{\phi}^n}{\sqrt{5}}
$$

---

## Summary: The Diagonalization Playbook

To diagonalize an $n \times n$ matrix $A$:

1. **Find eigenvalues:** Solve $\det(A - \lambda I) = 0$
2. **Find eigenvectors:** For each $\lambda$, solve $(A - \lambda I)\mathbf{v} = \mathbf{0}$
3. **Check linear independence:** You need $n$ independent eigenvectors
4. **Build $P$ and $D$:**
   - $P = [\mathbf{v}_1 \mid \cdots \mid \mathbf{v}_n]$ (eigenvectors as columns)
   - $D = \text{diag}(\lambda_1, \ldots, \lambda_n)$ (eigenvalues in matching order)
5. **Verify:** $AP = PD$

If you can't find $n$ independent eigenvectors, the matrix is not diagonalizable,but you might still use the **Jordan normal form** (a nearly-diagonal form with 1's above some diagonal entries).

Diagonalization reveals the coordinate system where a transformation is simplest,just scaling, no mixing. It's the key to understanding matrix powers, exponentials, and the long-term behavior of linear systems.
