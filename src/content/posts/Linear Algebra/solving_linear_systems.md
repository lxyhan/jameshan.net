---
title: 'Solving Linear Systems'
pubDate: '2025-11-29'
---

## Basic Definitions
**(Pivot)**
The *pivot* of a row in a matrix is the leftmost nonzero entry in that row.

**(Row Echelon Form)**
A matrix is in *row echelon form* (REF) if and only if:
1. All rows consisting entirely of zeros are at the bottom of the matrix, and
2. The pivot of each nonzero row is in a column strictly to the right of the pivot of the row above it.

**(Reduced Row Echelon Form)** 
A matrix is in *reduced row echelon form* if and only if
1. The matrix is in *Row Echelon Form*
3. The pivot in each nonzero row is d
4. Each pivot is the only nonzero column in its column

<!-- > helpful: RREF = REF (zero rows at bottom, staircase pattern) + pivots are 1 + nothing above pivots -->
<!-- 
**Which of the following are in REF, RREF, or neither?**

$$
A = \begin{bmatrix}
1 & 0 & 0\\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
\quad
B = \begin{bmatrix}
0 & 1 & 2 \\
0 & 0 & 0
\end{bmatrix}
\quad
C = \begin{bmatrix}
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
\quad
D = \begin{bmatrix}
0 & 1 & 0 & 2 \\
0 & 0 & 1 & 3 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

A is RREF: this is the standard identity matrix

B is RREF

C is Neither REF or RREF since there is a row of zeroes which is not the last row

D is REF but not RREF since the third row's pivot isnt the only entry in its column -->


**(Consistency)** A system of linear equations is *consistent* if it has at least one solution. Otherwise it is *inconsistent*



**(Basic Variable)**: We say that $x_i$ is a *basic variable* if the $i^{th}$ column of rref(C) has a pivot.

**(Free Variable)**: We say that $x_i$ is a *basic variable* if the $i^{th}$ column of rref(C) has NO pivot.

---

## Rouché–Capelli Theorem

Let $A$ be the augmented matrix and $C$ the coefficient matrix.

### Inconsistent System
A system is **inconsistent** iff the last column of $\operatorname{rref}(A)$ has a pivot.

### Unique Solution
A system has **exactly one solution** iff:

- the last column of $\operatorname{rref}(A)$ has **no** pivot  
- every column of $\operatorname{rref}(C)$ **does** have a pivot

In other words:

$$
\operatorname{rank}(\operatorname{rref}(A)) = \operatorname{rank}(\operatorname{rref}(C)) = \text{number of variables}
$$

### Infinitely Many Solutions
A system has **infinitely many solutions** iff:

- the last column of $\operatorname{rref}(A)$ has **no** pivot  
- $\operatorname{rref}(C)$ has at least one column without a pivot

In other words:

$$
\operatorname{rank}(\operatorname{rref}(A)) = \operatorname{rank}(\operatorname{rref}(C)) \neq \text{number of variables}
$$

Specifically, the dimension of the solution set (set of possible input vectors x to produce Ax = b) is:

$$
\dim(\text{solution set}) = \text{number of variables} - \operatorname{rank}(\operatorname{rref}(C))
$$

