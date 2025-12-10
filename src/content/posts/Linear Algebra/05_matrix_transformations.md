---
title: '5: Matrix Transformations as Functions'
pubDate: '2025-12-05'
---

## Matrix Transformations

### **(Linear Transformation)**
A **matrix transformation** (or **linear transformation**) is a function $T: \mathbb{R}^n \to \mathbb{R}^m$ defined by:

$$
T(\mathbf{x}) = A\mathbf{x}
$$

where $A$ is an $m \times n$ matrix.

**Key Properties:**
1. $T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v})$ (preserves addition)
2. $T(c\mathbf{v}) = cT(\mathbf{v})$ (preserves scalar multiplication)

These properties mean $T(c_1\mathbf{v}_1 + c_2\mathbf{v}_2) = c_1T(\mathbf{v}_1) + c_2T(\mathbf{v}_2)$ for any scalars and vectors.

---

## Viewing Transformations as Functions

When we write $T(\mathbf{x}) = A\mathbf{x}$, we're treating matrix multiplication as a **function**:
- **Domain:** $\mathbb{R}^n$ (all possible input vectors)
- **Codomain:** $\mathbb{R}^m$ (the space where outputs live)
- **Range (Image):** $\{\mathbf{y} \in \mathbb{R}^m \mid \mathbf{y} = A\mathbf{x} \text{ for some } \mathbf{x}\}$

The **range** is the set of all possible outputs,it's the **column space** of $A$.

$$
\text{Range}(T) = \text{Col}(A) = \text{span}\{\text{columns of } A\}
$$

---

## Injectivity (One-to-One)

### **(Injective / One-to-One)**
A transformation $T: \mathbb{R}^n \to \mathbb{R}^m$ is **injective** (one-to-one) if:

$$
T(\mathbf{x}_1) = T(\mathbf{x}_2) \implies \mathbf{x}_1 = \mathbf{x}_2
$$

**Equivalently:** Different inputs produce different outputs.

**Equivalently:** $T(\mathbf{x}) = \mathbf{0}$ has only the trivial solution $\mathbf{x} = \mathbf{0}$.

---

### **(Testing for Injectivity)**

For $T(\mathbf{x}) = A\mathbf{x}$ where $A$ is $m \times n$:

$$
T \text{ is injective} \iff A\mathbf{x} = \mathbf{0} \text{ has only the trivial solution}
$$

**Equivalently:**
- The columns of $A$ are **linearly independent**
- $\text{Nul}(A) = \{\mathbf{0}\}$ (null space contains only zero vector)
- $\text{rref}(A)$ has a **pivot in every column**
- $\text{rank}(A) = n$ (number of columns)

**Geometric Intuition:** Injective transformations don't "collapse" dimensions,they preserve distinctness.

---

### **Example: Testing Injectivity**

Is $T(\mathbf{x}) = \begin{bmatrix} 1 & 2 \\ 3 & 6 \\ 0 & 1 \end{bmatrix}\mathbf{x}$ injective?

**Solution:** Check if $A\mathbf{x} = \mathbf{0}$ has only the trivial solution:

$$
\begin{bmatrix} 1 & 2 \\ 3 & 6 \\ 0 & 1 \end{bmatrix} \to \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 0 & 0 \end{bmatrix}
$$

Pivot in every column → **Yes, injective**.

---

## Surjectivity (Onto)

### **(Surjective / Onto)**
A transformation $T: \mathbb{R}^n \to \mathbb{R}^m$ is **surjective** (onto) if:

$$
\text{Range}(T) = \mathbb{R}^m
$$

**Equivalently:** For every $\mathbf{b} \in \mathbb{R}^m$, there exists some $\mathbf{x} \in \mathbb{R}^n$ such that $T(\mathbf{x}) = \mathbf{b}$.

**Equivalently:** Every vector in the codomain is "hit" by some input.

---

### **(Testing for Surjectivity)**

For $T(\mathbf{x}) = A\mathbf{x}$ where $A$ is $m \times n$:

$$
T \text{ is surjective} \iff A\mathbf{x} = \mathbf{b} \text{ has a solution for every } \mathbf{b} \in \mathbb{R}^m
$$

**Equivalently:**
- The columns of $A$ **span** $\mathbb{R}^m$
- $\text{Col}(A) = \mathbb{R}^m$
- $\text{rref}(A)$ has a **pivot in every row**
- $\text{rank}(A) = m$ (number of rows)

**Geometric Intuition:** Surjective transformations "cover" the entire codomain,no gaps.

---

### **Example: Testing Surjectivity**

Is $T(\mathbf{x}) = \begin{bmatrix} 1 & 2 & 0 \\ 3 & 6 & 1 \end{bmatrix}\mathbf{x}$ surjective (as a map $\mathbb{R}^3 \to \mathbb{R}^2$)?

**Solution:** Check if rref has a pivot in every row:

$$
\begin{bmatrix} 1 & 2 & 0 \\ 3 & 6 & 1 \end{bmatrix} \to \begin{bmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

Pivot in every row → **Yes, surjective**.

---

## Bijectivity (One-to-One and Onto)

### **(Bijective)**
A transformation is **bijective** if it is **both injective and surjective**.

**Properties of Bijections:**
1. Every output has **exactly one** input that produces it
2. The transformation is **invertible** (has an inverse function $T^{-1}$)
3. $T$ establishes a perfect "pairing" between domain and codomain

---

### **(When is a Matrix Transformation Bijective?)**

For $T(\mathbf{x}) = A\mathbf{x}$:

$$
T \text{ is bijective} \iff A \text{ is square and invertible}
$$

**Equivalently:**
- $A$ is an $n \times n$ matrix with $\text{rank}(A) = n$
- $\text{rref}(A) = I_n$ (the identity matrix)
- $\det(A) \neq 0$
- Columns of $A$ form a **basis** for $\mathbb{R}^n$

**Note:** For non-square matrices:
- If $m < n$ (more columns than rows), $T$ **cannot** be injective
- If $m > n$ (more rows than columns), $T$ **cannot** be surjective

---

### **Example: Bijective Transformation**

Is $T(\mathbf{x}) = \begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix}\mathbf{x}$ bijective ($\mathbb{R}^2 \to \mathbb{R}^2$)?

**Solution:** Check if $A$ is invertible:

$$
\text{rref}\begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}
$$

Identity matrix → **Yes, bijective** (and $A$ has an inverse).

---

## Summary Table

| Property | Condition on $A$ ($m \times n$) | Geometric Meaning |
|----------|--------------------------------|-------------------|
| **Injective** | Pivot in every **column** | No dimension collapse |
| **Surjective** | Pivot in every **row** | Covers entire codomain |
| **Bijective** | Square + invertible ($m = n$, full rank) | Perfect correspondence |

---

## Connecting to Linear Systems

Given $T(\mathbf{x}) = A\mathbf{x}$:

1. **Injective** ⇔ $A\mathbf{x} = \mathbf{b}$ has **at most one** solution for any $\mathbf{b}$
2. **Surjective** ⇔ $A\mathbf{x} = \mathbf{b}$ has **at least one** solution for any $\mathbf{b}$
3. **Bijective** ⇔ $A\mathbf{x} = \mathbf{b}$ has **exactly one** solution for any $\mathbf{b}$

---

## Visual Intuition

### **Injective but not Surjective**
$$
\mathbb{R}^2 \xrightarrow{A_{3 \times 2}} \mathbb{R}^3
$$
Imagine embedding a plane into 3D space,points don't overlap (injective), but not all of 3D is covered (not surjective).

### **Surjective but not Injective**
$$
\mathbb{R}^3 \xrightarrow{A_{2 \times 3}} \mathbb{R}^2
$$
Imagine projecting 3D onto a plane,every point on the plane is hit (surjective), but many 3D points map to the same plane point (not injective).

### **Bijective**
$$
\mathbb{R}^n \xrightarrow{A_{n \times n}} \mathbb{R}^n
$$
A rotation, reflection, or scaling in $\mathbb{R}^n$,every point has a unique pre-image and every point is reached.
