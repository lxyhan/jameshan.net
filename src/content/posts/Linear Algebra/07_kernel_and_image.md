---
title: '7: Kernel and Image'
pubDate: '2025-12-06'
---

Every linear transformation has two fundamental subspaces attached to it: the **kernel** (what gets destroyed) and the **image** (what gets produced). Understanding these reveals what a transformation does geometrically,where it collapses, where it stretches, and what it can reach.

## The Image

### **(Image of a Linear Transformation)**

Let $T: V \to W$ be a linear transformation. The **image** (or **range**) of $T$ is the set of all outputs:

$$
\text{im}(T) = \{T(v) \mid v \in V\} = \{w \in W \mid w = T(v) \text{ for some } v \in V\}
$$

**Key fact:** The image is always a subspace of $W$.

**Proof:**
1. $T(\mathbf{0}) = \mathbf{0}$, so $\mathbf{0} \in \text{im}(T)$
2. If $w_1 = T(v_1)$ and $w_2 = T(v_2)$, then $w_1 + w_2 = T(v_1) + T(v_2) = T(v_1 + v_2) \in \text{im}(T)$
3. If $w = T(v)$, then $cw = cT(v) = T(cv) \in \text{im}(T)$

---

### **(Image for Matrices: Column Space)**

For a matrix transformation $T(\mathbf{x}) = A\mathbf{x}$ where $A$ is $m \times n$:

$$
\text{im}(T) = \text{col}(A) = \text{span}\{\text{columns of } A\}
$$

**Why?** Write $A = [\mathbf{a}_1 \mid \mathbf{a}_2 \mid \cdots \mid \mathbf{a}_n]$ in column form. Then:

$$
A\mathbf{x} = x_1\mathbf{a}_1 + x_2\mathbf{a}_2 + \cdots + x_n\mathbf{a}_n
$$

Every output is a linear combination of the columns,so the image is exactly the span of the columns.

**Interpretation:** The column space tells you **what vectors can be reached** by the transformation. If $\mathbf{b} \in \text{col}(A)$, then $A\mathbf{x} = \mathbf{b}$ has a solution. If $\mathbf{b} \notin \text{col}(A)$, the system is inconsistent.

---

## The Kernel

### **(Kernel of a Linear Transformation)**

Let $T: V \to W$ be a linear transformation. The **kernel** (or **null space**) of $T$ is the set of all inputs that map to zero:

$$
\ker(T) = \{v \in V \mid T(v) = \mathbf{0}\}
$$

**Key fact:** The kernel is always a subspace of $V$.

**Proof:**
1. $T(\mathbf{0}) = \mathbf{0}$, so $\mathbf{0} \in \ker(T)$
2. If $T(v_1) = \mathbf{0}$ and $T(v_2) = \mathbf{0}$, then $T(v_1 + v_2) = T(v_1) + T(v_2) = \mathbf{0}$
3. If $T(v) = \mathbf{0}$, then $T(cv) = cT(v) = c\mathbf{0} = \mathbf{0}$

---

### **(Kernel for Matrices: Null Space)**

For a matrix transformation $T(\mathbf{x}) = A\mathbf{x}$:

$$
\ker(T) = \text{null}(A) = \{\mathbf{x} \in \mathbb{R}^n \mid A\mathbf{x} = \mathbf{0}\}
$$

The null space is the solution set to the homogeneous system $A\mathbf{x} = \mathbf{0}$.

**Interpretation:** The kernel captures all the **redundancy** in the transformation,the directions that get completely flattened to nothing.

---

### **(Computing the Kernel)**

To find a basis for $\ker(A)$:

1. Row reduce $A$ to $\text{rref}(A)$
2. Identify the **free variables** (columns without pivots)
3. For each free variable, set it to $1$ and all others to $0$, then solve
4. These solutions form a basis for the kernel

**Example:** Find $\ker(A)$ for

$$
A = \begin{bmatrix} 1 & 2 & 1 & 0 \\ 2 & 4 & 0 & 2 \\ 1 & 2 & -1 & 2 \end{bmatrix}
$$

Row reduce:

$$
\text{rref}(A) = \begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 0 & 0 \end{bmatrix}
$$

Pivots in columns 1 and 3. Free variables: $x_2$ and $x_4$.

Setting $x_2 = 1, x_4 = 0$:
- From row 2: $x_3 = 0$
- From row 1: $x_1 = -2$
- Solution: $(-2, 1, 0, 0)$

Setting $x_2 = 0, x_4 = 1$:
- From row 2: $x_3 = 1$
- From row 1: $x_1 = -1$
- Solution: $(-1, 0, 1, 1)$

**Basis for $\ker(A)$:**

$$
\left\{ \begin{bmatrix} -2 \\ 1 \\ 0 \\ 0 \end{bmatrix}, \begin{bmatrix} -1 \\ 0 \\ 1 \\ 1 \end{bmatrix} \right\}
$$

The kernel is a 2-dimensional subspace of $\mathbb{R}^4$.

---

## The Rank-Nullity Theorem

### **(Rank and Nullity)**

For a linear transformation $T: V \to W$:

- The **rank** of $T$ is $\dim(\text{im}(T))$
- The **nullity** of $T$ is $\dim(\ker(T))$

For a matrix $A$, rank$(A) = \dim(\text{col}(A))$ equals the number of pivot columns.

---

### **(The Rank-Nullity Theorem)**

For any linear transformation $T: V \to W$ where $V$ is finite-dimensional:

$$
\dim(V) = \text{rank}(T) + \text{nullity}(T)
$$

For an $m \times n$ matrix $A$:

$$
n = \text{rank}(A) + \dim(\ker(A))
$$

**Interpretation:** The dimension of the input space is split between:
- Dimensions that survive and get mapped somewhere meaningful (the rank)
- Dimensions that get crushed to zero (the nullity)

This is conservation of dimension,you can't create or destroy dimensions, only redistribute them.

---

### **(Proof Sketch)**

Let $\{v_1, \ldots, v_k\}$ be a basis for $\ker(T)$. Extend this to a basis $\{v_1, \ldots, v_k, u_1, \ldots, u_r\}$ for $V$.

Claim: $\{T(u_1), \ldots, T(u_r)\}$ is a basis for $\text{im}(T)$.

*Spanning:* Any $w = T(v) \in \text{im}(T)$ can be written as:

$$
v = c_1v_1 + \cdots + c_kv_k + d_1u_1 + \cdots + d_ru_r
$$

so $T(v) = d_1T(u_1) + \cdots + d_rT(u_r)$ (since $T(v_i) = \mathbf{0}$).

*Linear independence:* If $d_1T(u_1) + \cdots + d_rT(u_r) = \mathbf{0}$, then $T(d_1u_1 + \cdots + d_ru_r) = \mathbf{0}$, so $d_1u_1 + \cdots + d_ru_r \in \ker(T)$. This means it's a combination of $v_1, \ldots, v_k$, forcing all $d_i = 0$ by independence.

Thus $\dim(V) = k + r = \text{nullity}(T) + \text{rank}(T)$.

---

## Injectivity and Surjectivity Revisited

The kernel and image directly characterize injectivity and surjectivity:

### **(Kernel and Injectivity)**

$$
T \text{ is injective (one-to-one)} \iff \ker(T) = \{\mathbf{0}\}
$$

**Why?** If $\ker(T) = \{\mathbf{0}\}$ and $T(v_1) = T(v_2)$, then $T(v_1 - v_2) = \mathbf{0}$, so $v_1 - v_2 \in \ker(T)$, meaning $v_1 = v_2$.

**For matrices:** $A$ is injective iff $\text{null}(A) = \{\mathbf{0}\}$ iff there's a pivot in every column iff rank$(A) = n$.

---

### **(Image and Surjectivity)**

$$
T: V \to W \text{ is surjective (onto)} \iff \text{im}(T) = W
$$

**For matrices:** $A$ ($m \times n$) is surjective iff $\text{col}(A) = \mathbb{R}^m$ iff there's a pivot in every row iff rank$(A) = m$.

---

### **(The Counting Argument)**

For an $m \times n$ matrix $A$:

- **Injective requires** rank$(A) = n$ (all columns are pivots)
- **Surjective requires** rank$(A) = m$ (all rows have pivots)
- **Bijective requires** rank$(A) = m = n$ (square and full rank)

Since rank$(A) \leq \min(m, n)$:
- If $n > m$: Cannot be injective (not enough room for pivots in every column)
- If $m > n$: Cannot be surjective (not enough columns to pivot in every row)

---

## The Row Space

There's a fourth fundamental subspace hiding in every matrix.

### **(Row Space)**

The **row space** of $A$, denoted $\text{row}(A)$, is the span of the rows of $A$:

$$
\text{row}(A) = \text{span}\{\text{rows of } A\} = \text{col}(A^T)
$$

This is a subspace of $\mathbb{R}^n$ (same as the domain).

---

### **(Key Property)**

Row operations **preserve** the row space. So:

$$
\text{row}(A) = \text{row}(\text{rref}(A))
$$

This means the nonzero rows of $\text{rref}(A)$ form a basis for $\text{row}(A)$.

**Note:** This is different from column space! Row operations change column relationships but preserve row span.

---

### **(Row Space and Null Space are Orthogonal)**

For any matrix $A$:

$$
\text{row}(A) \perp \ker(A)
$$

Every vector in the row space is orthogonal to every vector in the null space.

**Why?** If $\mathbf{x} \in \ker(A)$, then $A\mathbf{x} = \mathbf{0}$. This means each row $\mathbf{r}_i$ satisfies $\mathbf{r}_i \cdot \mathbf{x} = 0$. So $\mathbf{x}$ is orthogonal to every row, hence to every linear combination of rows.

---

## The Four Fundamental Subspaces

Every $m \times n$ matrix $A$ defines four fundamental subspaces:

| Subspace | Notation | Lives in | Dimension |
|----------|----------|----------|-----------|
| Column space (image) | $\text{col}(A)$ | $\mathbb{R}^m$ | $r$ |
| Null space (kernel) | $\ker(A)$ | $\mathbb{R}^n$ | $n - r$ |
| Row space | $\text{row}(A)$ | $\mathbb{R}^n$ | $r$ |
| Left null space | $\ker(A^T)$ | $\mathbb{R}^m$ | $m - r$ |

where $r = \text{rank}(A)$.

---

### **(Orthogonal Complements)**

These subspaces pair up as orthogonal complements:

- In $\mathbb{R}^n$: $\text{row}(A) \perp \ker(A)$, and together they span $\mathbb{R}^n$
- In $\mathbb{R}^m$: $\text{col}(A) \perp \ker(A^T)$, and together they span $\mathbb{R}^m$

**Dimensions check:**
- $\dim(\text{row}(A)) + \dim(\ker(A)) = r + (n - r) = n$ ✓
- $\dim(\text{col}(A)) + \dim(\ker(A^T)) = r + (m - r) = m$ ✓

---

## Geometric Summary

The kernel and image tell you exactly how a transformation reshapes space:

**The image** is the "shadow" of the domain in the codomain,all the places you can reach. Its dimension (the rank) is how many independent directions survive the transformation.

**The kernel** is the "blind spot" in the domain,all the inputs that become invisible. Its dimension (the nullity) is how many directions get flattened.

$$
\underbrace{\text{Domain}}_{\dim = n} = \underbrace{\text{Kernel}}_{\text{crushed}} \oplus \underbrace{\text{Complement}}_{\text{survives} \to \text{Image}}
$$

The rank-nullity theorem says the domain splits cleanly: some directions die, some survive, and nothing is lost in the accounting.
