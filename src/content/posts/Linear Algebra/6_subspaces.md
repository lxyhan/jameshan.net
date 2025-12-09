---
title: 'Subspaces'
pubDate: '2025-12-3'
---

Subspaces are the building blocks of linear algebra—they're the sets where vector operations stay contained, and understanding them reveals the geometry hidden inside matrices.

## Basic Definitions

### **(Subspace)**
A subset $S \subseteq \mathbb{R}^n$ is a *subspace* of $\mathbb{R}^n$ if and only if it satisfies three conditions:

1. **Contains the zero vector**: $\mathbf{0} \in S$
2. **Closed under addition**: If $u, v \in S$, then $u + v \in S$
3. **Closed under scalar multiplication**: If $v \in S$ and $c \in \mathbb{R}$, then $cv \in S$

In other words, a subspace is a set that "behaves like a vector space" within $\mathbb{R}^n$.

---

### **(Why These Three Conditions?)**

The intuition: a subspace must be **self-contained** under the operations that define vector spaces.

- The zero vector ensures you have a natural "origin"
- Closure under addition means you can combine vectors freely
- Closure under scalar multiplication means you can scale vectors freely

Together, these guarantee that all linear combinations of vectors in $S$ stay inside $S$.

---

## Examples

### **Example 1: The Trivial Subspaces**

For any $n$:

- $S = \{\mathbf{0}\}$ is always a subspace (the *trivial subspace*)
- $S = \mathbb{R}^n$ is always a subspace (the *whole space*)

### **Example 2: Lines Through the Origin**

The set

$$
S = \{t \cdot v \mid t \in \mathbb{R}\}
$$

where $v \neq \mathbf{0}$ is a subspace of $\mathbb{R}^n$.

This is the line through the origin in the direction of $v$.

**Why?**

- Contains $\mathbf{0}$: Set $t = 0$
- Closed under addition: $t_1 v + t_2 v = (t_1 + t_2)v \in S$
- Closed under scalar multiplication: $c(tv) = (ct)v \in S$

### **Example 3: Planes Through the Origin**

The set

$$
S = \{c_1 v_1 + c_2 v_2 \mid c_1, c_2 \in \mathbb{R}\}
$$

where $v_1, v_2$ are linearly independent is a subspace.

This is the plane spanned by $v_1$ and $v_2$.

### **Example 4: Not a Subspace**

The set

$$
S = \{(x, y) \in \mathbb{R}^2 \mid x + y = 1\}
$$

is **not** a subspace because:

- It doesn't contain $\mathbf{0}$ (since $0 + 0 \neq 1$)
- It's not closed under addition: $(1, 0)$ and $(0, 1)$ are in $S$, but their sum $(1, 1)$ is not

This is a line, but it **doesn't.  pass through the origin**—so it fails to be a subspace.

---

## Key Result: Span is Always a Subspace

**Theorem**: For any collection of vectors $v_1, \dots, v_k \in \mathbb{R}^n$, the span

$$
\operatorname{span}\{v_1, \dots, v_k\}
$$

is a subspace of $\mathbb{R}^n$.

**Proof**:

1. **Contains $\mathbf{0}$**: Take all coefficients $c_i = 0$, then $0v_1 + \cdots + 0v_k = \mathbf{0}$.

2. **Closed under addition**: If $u = c_1 v_1 + \cdots + c_k v_k$ and $w = d_1 v_1 + \cdots + d_k v_k$, then

   $$
   u + w = (c_1 + d_1)v_1 + \cdots + (c_k + d_k)v_k \in \operatorname{span}\{v_1, \dots, v_k\}.
   $$

3. **Closed under scalar multiplication**: If $u = c_1 v_1 + \cdots + c_k v_k$ and $a \in \mathbb{R}$, then

   $$
   au = (ac_1)v_1 + \cdots + (ac_k)v_k \in \operatorname{span}\{v_1, \dots, v_k\}.
   $$

This is why span is so important—it's the canonical way to construct subspaces.

---

## Column Space and Null Space

Two fundamental subspaces arise from any matrix $A \in \mathbb{R}^{m \times n}$:

### **(Column Space)**

The *column space* of $A$, denoted $\operatorname{col}(A)$, is the span of the columns of $A$:

$$
\operatorname{col}(A) = \operatorname{span}\{\text{columns of } A\}.
$$

This is a subspace of $\mathbb{R}^m$.

**Interpretation**: $\operatorname{col}(A)$ is the set of all possible outputs $Ax$ as $x$ ranges over $\mathbb{R}^n$.

$$
\operatorname{col}(A) = \{Ax \mid x \in \mathbb{R}^n\}.
$$

### **(Null Space)**

The *null space* (or *kernel*) of $A$, denoted $\operatorname{null}(A)$ or $\ker(A)$, is the set of all solutions to $Ax = \mathbf{0}$:

$$
\operatorname{null}(A) = \{x \in \mathbb{R}^n \mid Ax = \mathbf{0}\}.
$$

This is a subspace of $\mathbb{R}^n$.

**Why is it a subspace?**

1. $A\mathbf{0} = \mathbf{0}$, so $\mathbf{0} \in \operatorname{null}(A)$
2. If $Au = \mathbf{0}$ and $Av = \mathbf{0}$, then $A(u + v) = Au + Av = \mathbf{0}$
3. If $Au = \mathbf{0}$, then $A(cu) = c(Au) = c\mathbf{0} = \mathbf{0}$

**Interpretation**: The null space captures all the "redundancy" in the matrix—the directions that get collapsed to zero.

---

## Dimension and Basis

### **(Basis)**

A *basis* for a subspace $S$ is a linearly independent set of vectors whose span equals $S$.

Equivalently, a basis is a **minimal spanning set** or a **maximal independent set**.

### **(Dimension)**

The *dimension* of a subspace $S$, denoted $\dim(S)$, is the number of vectors in any basis for $S$.

**Key fact**: All bases for a given subspace have the same size.

### **Examples**

- $\dim(\{\mathbf{0}\}) = 0$
- $\dim(\mathbb{R}^n) = n$
- A line through the origin has dimension $1$
- A plane through the origin has dimension $2$

---

## The Rank-Nullity Theorem

For any $m \times n$ matrix $A$:

$$
\dim(\operatorname{col}(A)) + \dim(\operatorname{null}(A)) = n.
$$

Or equivalently:

$$
\operatorname{rank}(A) + \dim(\operatorname{null}(A)) = n.
$$

**Interpretation**: The dimension of the input space ($n$) is split between:

- The dimension of directions that get mapped somewhere non-trivial (the rank)
- The dimension of directions that collapse to zero (the nullity)

This is one of the most important equations in linear algebra.

---

## Computing Subspaces from RREF

Given a matrix $A$, we can compute both $\operatorname{col}(A)$ and $\operatorname{null}(A)$ from $\operatorname{rref}(A)$.

### **Finding a Basis for $\operatorname{col}(A)$**

1. Compute $\operatorname{rref}(A)$
2. Identify the **pivot columns** in $\operatorname{rref}(A)$
3. The corresponding columns **from the original matrix $A$** form a basis for $\operatorname{col}(A)$

**Why the original columns?** Because row operations preserve the column space relationships but change the actual vectors. The pivot positions tell you which original columns are independent.

### **Finding a Basis for $\operatorname{null}(A)$**

1. Compute $\operatorname{rref}(A)$
2. Identify the **free variables** (columns without pivots)
3. For each free variable, set it to $1$ and all other free variables to $0$, then solve for the basic variables
4. Each solution vector forms a basis vector for $\operatorname{null}(A)$

The dimension of $\operatorname{null}(A)$ equals the number of free variables.

---

## Why Subspaces Matter

Subspaces are the geometric objects that linear algebra studies.

- Solutions to linear systems live in subspaces
- Eigenvectors span eigenspaces (which are subspaces)
- Projections map onto subspaces
- Least-squares problems minimize distance to subspaces

Understanding subspaces means understanding the **structure** of $\mathbb{R}^n$, not just individual vectors.
