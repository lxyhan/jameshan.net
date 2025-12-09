---
title: 'Vectors in Euclidian Space'
pubDate: '2025-11-29'
---

## Basic Definitions

### **(Euclidean Space)**
The **Euclidean space** $\mathbb{R}^n$ is the set of all ordered $n$-tuples of real numbers:

$$
\mathbb{R}^n = \{(x_1, x_2, \ldots, x_n) \mid x_i \in \mathbb{R}\}
$$

Vectors in $\mathbb{R}^n$ can be written as column vectors or row vectors. We typically use column notation:

$$
\mathbf{v} = \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix}
$$

---

## Vector Operations

### **(Vector Addition)**
Given vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$, their **sum** is:

$$
\mathbf{u} + \mathbf{v} = \begin{bmatrix} u_1 + v_1 \\ u_2 + v_2 \\ \vdots \\ u_n + v_n \end{bmatrix}
$$

Vector addition is **commutative** and **associative**:
- $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$
- $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$

### **(Scalar Multiplication)**
Given a scalar $c \in \mathbb{R}$ and vector $\mathbf{v} \in \mathbb{R}^n$:

$$
c\mathbf{v} = \begin{bmatrix} cv_1 \\ cv_2 \\ \vdots \\ cv_n \end{bmatrix}
$$

Scalar multiplication **stretches** or **shrinks** vectors (and reverses direction if $c < 0$).

---

## Linear Combinations

### **(Linear Combination)**
A **linear combination** of vectors $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k$ in $\mathbb{R}^n$ is any vector of the form:

$$
c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k
$$

where $c_1, c_2, \ldots, c_k \in \mathbb{R}$ are **scalars** (called coefficients).

**Example:** In $\mathbb{R}^2$, let $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ and $\mathbf{v}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$.

Then $\begin{bmatrix} 3 \\ -2 \end{bmatrix} = 3\mathbf{v}_1 - 2\mathbf{v}_2$ is a linear combination of $\mathbf{v}_1$ and $\mathbf{v}_2$.

---

### **(Expressing as Linear Combinations)**
Given vectors $\mathbf{v}_1, \ldots, \mathbf{v}_k$ and a target vector $\mathbf{b}$, determining if $\mathbf{b}$ can be written as a linear combination means solving:

$$
c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k = \mathbf{b}
$$

This is equivalent to solving the **linear system** $A\mathbf{c} = \mathbf{b}$, where:
- $A = [\mathbf{v}_1 \ \mathbf{v}_2 \ \cdots \ \mathbf{v}_k]$ (matrix with vectors as columns)
- $\mathbf{c} = \begin{bmatrix} c_1 \\ c_2 \\ \vdots \\ c_k \end{bmatrix}$ (coefficients)

**The system has a solution** ⇔ $\mathbf{b}$ is a linear combination of the vectors.

---

## Span

### **(Span)**
The **span** of vectors $\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k$ in $\mathbb{R}^n$ is the **set of all linear combinations** of these vectors:

$$
\text{span}\{\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k\} = \{c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_k\mathbf{v}_k \mid c_i \in \mathbb{R}\}
$$

**Geometric Interpretation:**
- $\text{span}\{\mathbf{v}\}$ in $\mathbb{R}^2$ or $\mathbb{R}^3$ is a **line** through the origin
- $\text{span}\{\mathbf{v}_1, \mathbf{v}_2\}$ (if not parallel) is a **plane** through the origin
- $\text{span}\{\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3\}$ (if linearly independent) fills all of $\mathbb{R}^3$

---

### **(Properties of Span)**

1. **Closed under addition and scalar multiplication:**
   - If $\mathbf{u}, \mathbf{v} \in \text{span}\{S\}$, then $\mathbf{u} + \mathbf{v} \in \text{span}\{S\}$
   - If $\mathbf{v} \in \text{span}\{S\}$ and $c \in \mathbb{R}$, then $c\mathbf{v} \in \text{span}\{S\}$

2. **Contains the zero vector:**
   - $\mathbf{0} \in \text{span}\{S\}$ for any set $S$ (set all coefficients to 0)

3. **Span is a subspace:**
   - $\text{span}\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$ is always a subspace of $\mathbb{R}^n$

---

### **(Spanning Sets)**

A set of vectors $\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$ **spans** $\mathbb{R}^n$ if:

$$
\text{span}\{\mathbf{v}_1, \ldots, \mathbf{v}_k\} = \mathbb{R}^n
$$

This means **every** vector in $\mathbb{R}^n$ can be written as a linear combination of $\mathbf{v}_1, \ldots, \mathbf{v}_k$.

**Equivalently:** The matrix $A = [\mathbf{v}_1 \ \cdots \ \mathbf{v}_k]$ has a solution to $A\mathbf{x} = \mathbf{b}$ for **every** $\mathbf{b} \in \mathbb{R}^n$.

**Test:** $\{\mathbf{v}_1, \ldots, \mathbf{v}_k\}$ spans $\mathbb{R}^n$ ⇔ $\text{rref}(A)$ has a **pivot in every row**.

---

## Examples

### **Example 1: Span in $\mathbb{R}^2$**

Let $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$ and $\mathbf{v}_2 = \begin{bmatrix} 2 \\ 4 \end{bmatrix}$.

Does $\text{span}\{\mathbf{v}_1, \mathbf{v}_2\} = \mathbb{R}^2$?

**Solution:** Note that $\mathbf{v}_2 = 2\mathbf{v}_1$, so they're parallel. The span is just a **line**, not all of $\mathbb{R}^2$.

$$
\text{span}\{\mathbf{v}_1, \mathbf{v}_2\} = \left\{t\begin{bmatrix} 1 \\ 2 \end{bmatrix} \mid t \in \mathbb{R}\right\}
$$

---

### **Example 2: Linear Combination Check**

Can $\mathbf{b} = \begin{bmatrix} 5 \\ 1 \end{bmatrix}$ be written as a linear combination of $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ and $\mathbf{v}_2 = \begin{bmatrix} 2 \\ 3 \end{bmatrix}$?

**Solution:** Solve $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 = \mathbf{b}$:

$$
c_1\begin{bmatrix} 1 \\ 1 \end{bmatrix} + c_2\begin{bmatrix} 2 \\ 3 \end{bmatrix} = \begin{bmatrix} 5 \\ 1 \end{bmatrix}
$$

This gives the system:

$$
\begin{align*}
c_1 + 2c_2 &= 5 \\
c_1 + 3c_2 &= 1
\end{align*}
$$

Subtracting: $c_2 = -4$, so $c_1 = 13$.

**Yes**, $\mathbf{b} = 13\mathbf{v}_1 - 4\mathbf{v}_2$. 

