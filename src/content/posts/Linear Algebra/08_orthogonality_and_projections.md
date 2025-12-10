---
title: '8: Orthogonality and Projections'
pubDate: '2025-12-08'
---

Orthogonality is the geometric idea of "perpendicularity" extended to any dimension. Two vectors are orthogonal when their dot product is zero,they point in completely independent directions. This concept unlocks powerful tools: projections decompose vectors into components, orthogonal bases simplify computations, and the Gram-Schmidt process converts any basis into an orthonormal one. Orthogonality turns complicated geometric problems into simple, coordinate-wise calculations.

## The Dot Product

### **(Definition)**

For vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$:

$$
\mathbf{u} \cdot \mathbf{v} = u_1v_1 + u_2v_2 + \cdots + u_nv_n = \sum_{i=1}^{n} u_iv_i
$$

**Matrix notation:** $\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^T\mathbf{v}$ (row times column).

**Geometric interpretation:** The dot product measures how much two vectors "align":
- Large positive value: vectors point in similar directions
- Zero: vectors are perpendicular (orthogonal)
- Large negative value: vectors point in opposite directions

---

### **(Properties)**

The dot product is:

1. **Commutative:** $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$
2. **Distributive:** $\mathbf{u} \cdot (\mathbf{v} + \mathbf{w}) = \mathbf{u} \cdot \mathbf{v} + \mathbf{u} \cdot \mathbf{w}$
3. **Homogeneous:** $(c\mathbf{u}) \cdot \mathbf{v} = c(\mathbf{u} \cdot \mathbf{v})$
4. **Positive definite:** $\mathbf{v} \cdot \mathbf{v} \geq 0$, with equality iff $\mathbf{v} = \mathbf{0}$

---

### **(Length and Angle)**

The **length** (or **norm**) of a vector:

$$
\|\mathbf{v}\| = \sqrt{\mathbf{v} \cdot \mathbf{v}} = \sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}
$$

The **angle** between nonzero vectors $\mathbf{u}$ and $\mathbf{v}$:

$$
\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}
$$

**Key insight:** The dot product is $\|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$,it captures both magnitude and directional alignment.

---

### **(Example)**

$$
\mathbf{u} = \begin{bmatrix} 3 \\ 4 \end{bmatrix}, \quad \mathbf{v} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}
$$

$$
\mathbf{u} \cdot \mathbf{v} = 3(1) + 4(2) = 11
$$

$$
\|\mathbf{u}\| = \sqrt{9 + 16} = 5, \quad \|\mathbf{v}\| = \sqrt{1 + 4} = \sqrt{5}
$$

$$
\cos\theta = \frac{11}{5\sqrt{5}} = \frac{11\sqrt{5}}{25} \approx 0.9839
$$

The angle is $\theta \approx 10.3°$,nearly aligned.

---

## Orthogonality

### **(Definition)**

Vectors $\mathbf{u}$ and $\mathbf{v}$ are **orthogonal** (written $\mathbf{u} \perp \mathbf{v}$) if:

$$
\mathbf{u} \cdot \mathbf{v} = 0
$$

**Geometric meaning:** Orthogonal vectors are perpendicular,they point in completely independent directions.

**Note:** The zero vector $\mathbf{0}$ is orthogonal to every vector (by convention).

---

### **(Orthogonal Sets)**

A set of vectors $\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\}$ is **orthogonal** if:

$$
\mathbf{v}_i \cdot \mathbf{v}_j = 0 \quad \text{for all } i \neq j
$$

**Key fact:** Nonzero orthogonal vectors are automatically **linearly independent**.

**Proof:** Suppose $c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k = \mathbf{0}$. Dot both sides with $\mathbf{v}_i$:

$$
c_1(\mathbf{v}_1 \cdot \mathbf{v}_i) + \cdots + c_i(\mathbf{v}_i \cdot \mathbf{v}_i) + \cdots + c_k(\mathbf{v}_k \cdot \mathbf{v}_i) = 0
$$

All terms vanish except $c_i\|\mathbf{v}_i\|^2 = 0$. Since $\mathbf{v}_i \neq \mathbf{0}$, we have $c_i = 0$. This holds for all $i$, so the set is independent. ✓

---

### **(Orthonormal Sets)**

A set is **orthonormal** if it's orthogonal and every vector has length 1:

$$
\mathbf{v}_i \cdot \mathbf{v}_j = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \neq j \end{cases}
$$

This is written compactly as $\mathbf{v}_i \cdot \mathbf{v}_j = \delta_{ij}$ (Kronecker delta).

**Example:** The standard basis $\{\mathbf{e}_1, \mathbf{e}_2, \ldots, \mathbf{e}_n\}$ is orthonormal.

---

### **(Why Orthonormal Bases Are Perfect)**

If $\{\mathbf{q}_1, \ldots, \mathbf{q}_n\}$ is an orthonormal basis, then for any vector $\mathbf{v}$:

$$
\mathbf{v} = (\mathbf{v} \cdot \mathbf{q}_1)\mathbf{q}_1 + (\mathbf{v} \cdot \mathbf{q}_2)\mathbf{q}_2 + \cdots + (\mathbf{v} \cdot \mathbf{q}_n)\mathbf{q}_n
$$

The coefficients are just dot products,no need to solve a system of equations!

**Why this works:** Dot both sides with $\mathbf{q}_i$:

$$
\mathbf{v} \cdot \mathbf{q}_i = (\mathbf{v} \cdot \mathbf{q}_1)(\mathbf{q}_1 \cdot \mathbf{q}_i) + \cdots + (\mathbf{v} \cdot \mathbf{q}_i)(\mathbf{q}_i \cdot \mathbf{q}_i) + \cdots
$$

All terms vanish except $(\mathbf{v} \cdot \mathbf{q}_i) \cdot 1 = \mathbf{v} \cdot \mathbf{q}_i$. ✓

---

## Projections

### **(Scalar Projection)**

The **scalar projection** of $\mathbf{v}$ onto $\mathbf{u}$ is:

$$
\text{comp}_{\mathbf{u}} \mathbf{v} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|}
$$

This is the signed length of the projection,positive if $\mathbf{v}$ points roughly in the direction of $\mathbf{u}$, negative otherwise.

---

### **(Vector Projection)**

The **vector projection** (or **orthogonal projection**) of $\mathbf{v}$ onto $\mathbf{u}$ is:

$$
\text{proj}_{\mathbf{u}} \mathbf{v} = \frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{u} \cdot \mathbf{u}} \mathbf{u} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|^2} \mathbf{u}
$$

**Geometric meaning:** The component of $\mathbf{v}$ that points in the direction of $\mathbf{u}$.

**Key property:** $\text{proj}_{\mathbf{u}} \mathbf{v}$ is parallel to $\mathbf{u}$.

---

### **(Orthogonal Component)**

The **orthogonal component** (or **rejection**) is:

$$
\mathbf{v} - \text{proj}_{\mathbf{u}} \mathbf{v}
$$

This is the part of $\mathbf{v}$ that's perpendicular to $\mathbf{u}$.

**Decomposition:** Every vector $\mathbf{v}$ splits into:

$$
\mathbf{v} = \underbrace{\text{proj}_{\mathbf{u}} \mathbf{v}}_{\parallel \text{ to } \mathbf{u}} + \underbrace{(\mathbf{v} - \text{proj}_{\mathbf{u}} \mathbf{v})}_{\perp \text{ to } \mathbf{u}}
$$

---

### **(Example: Projection)**

Project $\mathbf{v} = \begin{bmatrix} 2 \\ 3 \end{bmatrix}$ onto $\mathbf{u} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$.

$$
\mathbf{u} \cdot \mathbf{v} = 1(2) + 1(3) = 5
$$

$$
\mathbf{u} \cdot \mathbf{u} = 1 + 1 = 2
$$

$$
\text{proj}_{\mathbf{u}} \mathbf{v} = \frac{5}{2}\begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 2.5 \\ 2.5 \end{bmatrix}
$$

Orthogonal component:

$$
\mathbf{v} - \text{proj}_{\mathbf{u}} \mathbf{v} = \begin{bmatrix} 2 \\ 3 \end{bmatrix} - \begin{bmatrix} 2.5 \\ 2.5 \end{bmatrix} = \begin{bmatrix} -0.5 \\ 0.5 \end{bmatrix}
$$

**Verify orthogonality:**

$$
\mathbf{u} \cdot \begin{bmatrix} -0.5 \\ 0.5 \end{bmatrix} = 1(-0.5) + 1(0.5) = 0 \quad ✓
$$

---

## Orthogonal Complements

### **(Definition)**

For a subspace $W \subseteq \mathbb{R}^n$, the **orthogonal complement** $W^\perp$ is:

$$
W^\perp = \{\mathbf{v} \in \mathbb{R}^n \mid \mathbf{v} \cdot \mathbf{w} = 0 \text{ for all } \mathbf{w} \in W\}
$$

**Interpretation:** $W^\perp$ contains all vectors perpendicular to everything in $W$.

---

### **(Key Properties)**

1. $W^\perp$ is always a subspace
2. $\dim(W) + \dim(W^\perp) = n$
3. $W \cap W^\perp = \{\mathbf{0}\}$
4. $(W^\perp)^\perp = W$
5. Every vector $\mathbf{v} \in \mathbb{R}^n$ decomposes uniquely as $\mathbf{v} = \mathbf{w} + \mathbf{w}^\perp$ where $\mathbf{w} \in W$ and $\mathbf{w}^\perp \in W^\perp$

**Direct sum notation:** $\mathbb{R}^n = W \oplus W^\perp$

---

### **(Finding $W^\perp$)**

If $W = \text{span}\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$, then $\mathbf{x} \in W^\perp$ iff:

$$
\begin{cases}
\mathbf{v}_1 \cdot \mathbf{x} = 0 \\
\mathbf{v}_2 \cdot \mathbf{x} = 0 \\
\vdots \\
\mathbf{v}_k \cdot \mathbf{x} = 0
\end{cases}
$$

This is a homogeneous system: $A\mathbf{x} = \mathbf{0}$ where the rows of $A$ are $\mathbf{v}_1^T, \ldots, \mathbf{v}_k^T$.

So: $W^\perp = \text{null}(A)$.

---

### **(Example: Orthogonal Complement)**

Find $W^\perp$ where $W = \text{span}\left\{\begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}\right\}$ in $\mathbb{R}^3$.

We need $\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}$ such that:

$$
x_1 + 2x_2 + x_3 = 0
$$

This is a plane through the origin. The general solution:

$$
\mathbf{x} = x_2\begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix} + x_3\begin{bmatrix} -1 \\ 0 \\ 1 \end{bmatrix}
$$

So $W^\perp = \text{span}\left\{\begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix}, \begin{bmatrix} -1 \\ 0 \\ 1 \end{bmatrix}\right\}$.

**Dimension check:** $\dim(W) + \dim(W^\perp) = 1 + 2 = 3 = n$ ✓

---

## The Gram-Schmidt Process

### **(The Problem)**

Given a basis $\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$ for a subspace, we want to construct an **orthogonal** (or orthonormal) basis $\{\mathbf{u}_1, \ldots, \mathbf{u}_k\}$ for the same subspace.

---

### **(The Algorithm)**

Start with the first vector:

$$
\mathbf{u}_1 = \mathbf{v}_1
$$

For each subsequent vector, subtract off the projections onto all previous orthogonal vectors:

$$
\mathbf{u}_2 = \mathbf{v}_2 - \text{proj}_{\mathbf{u}_1} \mathbf{v}_2
$$

$$
\mathbf{u}_3 = \mathbf{v}_3 - \text{proj}_{\mathbf{u}_1} \mathbf{v}_3 - \text{proj}_{\mathbf{u}_2} \mathbf{v}_3
$$

In general:

$$
\mathbf{u}_k = \mathbf{v}_k - \sum_{j=1}^{k-1} \text{proj}_{\mathbf{u}_j} \mathbf{v}_k = \mathbf{v}_k - \sum_{j=1}^{k-1} \frac{\mathbf{u}_j \cdot \mathbf{v}_k}{\mathbf{u}_j \cdot \mathbf{u}_j} \mathbf{u}_j
$$

**Result:** $\{\mathbf{u}_1, \ldots, \mathbf{u}_k\}$ is an orthogonal basis.

**To make it orthonormal:** Normalize each vector:

$$
\mathbf{q}_i = \frac{\mathbf{u}_i}{\|\mathbf{u}_i\|}
$$

---

### **(Why This Works)**

At each step, we take $\mathbf{v}_k$ and remove its components along all previous orthogonal directions. What remains ($\mathbf{u}_k$) is guaranteed to be orthogonal to $\mathbf{u}_1, \ldots, \mathbf{u}_{k-1}$.

**Key insight:** The span of $\{\mathbf{u}_1, \ldots, \mathbf{u}_k\}$ equals the span of $\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$ at each stage,we're just changing the basis vectors, not the subspace.

---

### **(Example: Gram-Schmidt in $\mathbb{R}^3$)**

Orthogonalize the basis:

$$
\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}, \quad \mathbf{v}_3 = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix}
$$

**Step 1:** $\mathbf{u}_1 = \mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$

**Step 2:** Compute $\mathbf{u}_2$:

$$
\text{proj}_{\mathbf{u}_1} \mathbf{v}_2 = \frac{\mathbf{u}_1 \cdot \mathbf{v}_2}{\mathbf{u}_1 \cdot \mathbf{u}_1} \mathbf{u}_1 = \frac{1 + 0}{1 + 1}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \frac{1}{2}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}
$$

$$
\mathbf{u}_2 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} - \frac{1}{2}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/2 \\ -1/2 \\ 1 \end{bmatrix}
$$

(Can scale by 2: $\mathbf{u}_2 = \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}$)

**Step 3:** Compute $\mathbf{u}_3$:

$$
\text{proj}_{\mathbf{u}_1} \mathbf{v}_3 = \frac{0 + 1}{2}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \frac{1}{2}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}
$$

$$
\text{proj}_{\mathbf{u}_2} \mathbf{v}_3 = \frac{0 - 1 + 2}{1 + 1 + 4}\begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix} = \frac{1}{6}\begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}
$$

$$
\mathbf{u}_3 = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix} - \frac{1}{2}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} - \frac{1}{6}\begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}
$$

$$
= \begin{bmatrix} -1/2 - 1/6 \\ 1/2 + 1/6 \\ 1 - 1/3 \end{bmatrix} = \begin{bmatrix} -2/3 \\ 2/3 \\ 2/3 \end{bmatrix}
$$

(Can scale by 3: $\mathbf{u}_3 = \begin{bmatrix} -2 \\ 2 \\ 2 \end{bmatrix}$ or by $-3/2$: $\mathbf{u}_3 = \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix}$)

**Verify orthogonality:** Check all pairs have dot product zero.

**Normalize for orthonormal basis:**

$$
\mathbf{q}_1 = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{q}_2 = \frac{1}{\sqrt{6}}\begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}, \quad \mathbf{q}_3 = \frac{1}{\sqrt{3}}\begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix}
$$

---

## QR Factorization

### **(The Connection)**

The Gram-Schmidt process gives the **QR factorization** of a matrix.

If $A = [\mathbf{v}_1 \mid \cdots \mid \mathbf{v}_n]$ has linearly independent columns, then:

$$
A = QR
$$

where:
- $Q = [\mathbf{q}_1 \mid \cdots \mid \mathbf{q}_n]$ has orthonormal columns (from Gram-Schmidt)
- $R$ is upper triangular (encodes the projection coefficients)

**Why this matters:** QR factorization is numerically stable and used for solving least squares problems, computing eigenvalues (QR algorithm), and more.

---

## Applications

### **(Least Squares)**

To solve the inconsistent system $A\mathbf{x} = \mathbf{b}$ (more equations than unknowns), find the $\mathbf{x}$ that minimizes $\|A\mathbf{x} - \mathbf{b}\|$.

The solution is the projection of $\mathbf{b}$ onto $\text{col}(A)$:

$$
\mathbf{\hat{x}} = (A^TA)^{-1}A^T\mathbf{b}
$$

If $A = QR$ (orthonormal columns), this simplifies dramatically:

$$
\mathbf{\hat{x}} = R^{-1}Q^T\mathbf{b}
$$

**Why?** $(QR)^T(QR) = R^TQ^TQR = R^TR$ (since $Q^TQ = I$), and $R^TR$ is easy to work with.

---

### **(Orthogonal Decomposition)**

Any vector space splits naturally into orthogonal complements. For example:

$$
\mathbb{R}^n = \text{row}(A) \oplus \text{null}(A)
$$

$$
\mathbb{R}^m = \text{col}(A) \oplus \text{null}(A^T)
$$

These are the **four fundamental subspaces**, paired as orthogonal complements.

---

### **(Signal Processing)**

In Fourier analysis, sine and cosine waves form an orthogonal basis for periodic functions. The Fourier coefficients are just inner products,projections onto each frequency component.

---

## Summary: Why Orthogonality Simplifies Everything

Orthogonality turns geometry into algebra:

1. **Dot products compute angles and lengths** without trigonometry
2. **Orthogonal vectors are automatically independent** (no redundancy)
3. **Orthonormal bases make coordinates trivial** (just dot products)
4. **Projections decompose vectors** into parallel and perpendicular parts
5. **Gram-Schmidt converts any basis** into an orthonormal one
6. **Orthogonal matrices preserve structure** (lengths, angles, volume)

When vectors are orthogonal, you can work component-wise,no cross-terms, no interactions, just clean decomposition. This is why orthonormal bases are the gold standard: they make every calculation as simple as possible while preserving all the geometry.
