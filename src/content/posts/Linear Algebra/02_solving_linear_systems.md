---
title: '2: Solving Linear Systems'
pubDate: '2025-12-08'
---

Solving a linear system means finding a recipe that produces a target dish. You have ingredients (matrix columns), you know what you want to cook (the vector $\mathbf{b}$), and you need to figure out the quantities (the solution $\mathbf{x}$). Sometimes there's exactly one recipe. Sometimes there are infinitely many ways to hit the target. Sometimes it's impossible,the ingredients you have can't produce that flavor.

The algorithm for answering "does a solution exist, and if so, what is it?" is **row reduction**. It's mechanical, systematic, and reveals everything about the system's structure. This is the computational heart of linear algebra.

---

## Systems of Linear Equations

### **(What is a Linear System?)**

A **system of linear equations** looks like:

$$
\begin{cases}
a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\
a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
\vdots \\
a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n = b_m
\end{cases}
$$

This is the same as the matrix equation:

$$
A\mathbf{x} = \mathbf{b}
$$

where $A$ is the $m \times n$ **coefficient matrix**, $\mathbf{x}$ is the vector of unknowns, and $\mathbf{b}$ is the target vector.

---

### **(Geometric Interpretation)**

Each equation represents a **hyperplane** in $\mathbb{R}^n$. Solving the system means finding where all these hyperplanes intersect.

**In $\mathbb{R}^2$:** Each equation is a line. The solution is where the lines meet.
- Two lines typically intersect at one point (unique solution)
- Parallel lines never meet (no solution)
- The same line counted twice (infinitely many solutions)

**In $\mathbb{R}^3$:** Each equation is a plane. The solution is where all planes meet,a point, a line, a plane, or nothing.

**In higher dimensions:** Same idea, harder to visualize.

---

### **(Consistency)**

A system is **consistent** if it has at least one solution. Otherwise it's **inconsistent** (no solution exists).

**Example of inconsistent system:**

$$
\begin{cases}
x + y = 1 \\
x + y = 2
\end{cases}
$$

These are parallel lines,they never intersect. No $(x, y)$ satisfies both equations.

---

## The Augmented Matrix

To solve $A\mathbf{x} = \mathbf{b}$, we work with the **augmented matrix**:

$$
[A \mid \mathbf{b}]
$$

This glues the coefficient matrix and the target vector together. Row operations apply to both simultaneously.

**Example:**

$$
\begin{cases}
x + 2y = 5 \\
3x + 4y = 11
\end{cases}
\quad \longrightarrow \quad
\left[\begin{array}{cc|c}
1 & 2 & 5 \\
3 & 4 & 11
\end{array}\right]
$$

---

## Row Echelon Form

### **(Pivots)**

The **pivot** of a row is its leftmost nonzero entry.

**Example:**

$$
\begin{bmatrix}
\boxed{2} & 1 & 3 \\
0 & \boxed{-1} & 4 \\
0 & 0 & \boxed{5}
\end{bmatrix}
$$

The pivots are $2$, $-1$, and $5$.

---

### **(Row Echelon Form, REF)**

A matrix is in **row echelon form** if:

1. All zero rows are at the bottom
2. Each pivot is to the right of the pivot in the row above

**Examples:**

$$
\begin{bmatrix}
\boxed{1} & 2 & 3 \\
0 & \boxed{5} & 7 \\
0 & 0 & \boxed{2}
\end{bmatrix}
\quad
\begin{bmatrix}
\boxed{3} & 1 & 4 & 1 \\
0 & \boxed{2} & 7 & 8 \\
0 & 0 & 0 & 0
\end{bmatrix}
$$

Both are in REF,pivots descend in a "staircase" pattern.

---

### **(Reduced Row Echelon Form, RREF)**

A matrix is in **reduced row echelon form** if:

1. It's in REF
2. Every pivot equals $1$
3. Every pivot is the **only** nonzero entry in its column

**Examples:**

$$
\begin{bmatrix}
\boxed{1} & 0 & 0 \\
0 & \boxed{1} & 0 \\
0 & 0 & \boxed{1}
\end{bmatrix}
\quad
\begin{bmatrix}
\boxed{1} & 0 & 2 & 0 \\
0 & \boxed{1} & 3 & 0 \\
0 & 0 & 0 & \boxed{1}
\end{bmatrix}
$$

RREF is unique,every matrix has exactly one RREF.

---

## Row Operations

Three operations preserve solutions:

1. **Row swap:** Exchange two rows
2. **Row scaling:** Multiply a row by a nonzero scalar
3. **Row replacement:** Add a multiple of one row to another

**Key fact:** If you row-reduce $[A \mid \mathbf{b}]$ to $[\text{rref}(A) \mid \mathbf{b}']$, the solutions don't change. The systems $A\mathbf{x} = \mathbf{b}$ and $\text{rref}(A)\mathbf{x} = \mathbf{b}'$ are equivalent.

---

### **(Example: Row Reduction)**

Solve:

$$
\begin{cases}
x + 2y + z = 3 \\
2x + 4y + 3z = 8 \\
x + 2y + 2z = 5
\end{cases}
$$

Augmented matrix:

$$
\left[\begin{array}{ccc|c}
1 & 2 & 1 & 3 \\
2 & 4 & 3 & 8 \\
1 & 2 & 2 & 5
\end{array}\right]
$$

**Step 1:** $R_2 - 2R_1$, $R_3 - R_1$:

$$
\left[\begin{array}{ccc|c}
1 & 2 & 1 & 3 \\
0 & 0 & 1 & 2 \\
0 & 0 & 1 & 2
\end{array}\right]
$$

**Step 2:** $R_3 - R_2$:

$$
\left[\begin{array}{ccc|c}
1 & 2 & 1 & 3 \\
0 & 0 & 1 & 2 \\
0 & 0 & 0 & 0
\end{array}\right]
$$

**Step 3:** $R_1 - R_2$:

$$
\left[\begin{array}{ccc|c}
1 & 2 & 0 & 1 \\
0 & 0 & 1 & 2 \\
0 & 0 & 0 & 0
\end{array}\right]
$$

This is RREF. Now read off the solution.

---

## Variables: Basic and Free

### **(Basic Variables)**

A variable $x_i$ is **basic** if column $i$ of $\text{rref}(A)$ contains a pivot.

### **(Free Variables)**

A variable $x_i$ is **free** if column $i$ of $\text{rref}(A)$ has no pivot.

**In the example above:**
- $x$ and $z$ are **basic** (columns 1 and 3 have pivots)
- $y$ is **free** (column 2 has no pivot)

Free variables can take **any value**,they parameterize the solution set.

---

### **(General Solution)**

From the RREF:

$$
\begin{cases}
x + 2y = 1 \\
z = 2
\end{cases}
$$

Solve for basic variables in terms of free variables:

$$
\begin{cases}
x = 1 - 2y \\
z = 2 \\
y = t \quad \text{(free)}
\end{cases}
$$

**Solution set:**

$$
\mathbf{x} = \begin{bmatrix} 1 - 2t \\ t \\ 2 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix} + t\begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix}, \quad t \in \mathbb{R}
$$

This is a **line** in $\mathbb{R}^3$,infinitely many solutions parameterized by $t$.

---

## The Rouché–Capelli Theorem

This theorem tells you **how many solutions** exist by looking at the RREF.

Let:
- $[A \mid \mathbf{b}]$ be the augmented matrix
- $A$ be the coefficient matrix (without $\mathbf{b}$)

---

### **(Inconsistent System: No Solutions)**

The system is **inconsistent** if and only if:

**The last column of $\text{rref}([A \mid \mathbf{b}])$ has a pivot.**

This means you get a row like:

$$
[0 \; 0 \; 0 \; \cdots \; 0 \mid 1]
$$

This says $0 = 1$,impossible.

**Example:**

$$
\left[\begin{array}{cc|c}
1 & 2 & 3 \\
2 & 4 & 7
\end{array}\right]
\xrightarrow{R_2 - 2R_1}
\left[\begin{array}{cc|c}
1 & 2 & 3 \\
0 & 0 & 1
\end{array}\right]
$$

Last column has a pivot,no solution.

---

### **(Unique Solution)**

The system has **exactly one solution** if and only if:

1. Last column of $\text{rref}([A \mid \mathbf{b}])$ has **no** pivot, AND
2. Every column of $\text{rref}(A)$ **has** a pivot

Equivalently:

$$
\text{rank}(A) = \text{number of variables}
$$

Every variable is basic,no free variables.

**Example:**

$$
\left[\begin{array}{cc|c}
1 & 0 & 2 \\
0 & 1 & 3
\end{array}\right]
$$

Unique solution: $x = 2$, $y = 3$.

---

### **(Infinitely Many Solutions)**

The system has **infinitely many solutions** if and only if:

1. Last column of $\text{rref}([A \mid \mathbf{b}])$ has **no** pivot, AND
2. $\text{rref}(A)$ has at least one column **without** a pivot

Equivalently:

$$
\text{rank}(A) < \text{number of variables}
$$

There's at least one free variable.

**Dimension of solution set:**

$$
\dim(\text{solution set}) = (\text{number of variables}) - \text{rank}(A)
$$

This is the number of free variables.

---

### **(Summary Table)**

| Pivot in last column? | All columns of $A$ have pivots? | Number of solutions |
|----------------------|----------------------------------|---------------------|
| **Yes** | , | **None** (inconsistent) |
| No | **Yes** | **One** (unique) |
| No | No | **Infinitely many** |

---

## Examples

### **(Example 1: Unique Solution)**

$$
\begin{cases}
x + y = 3 \\
x - y = 1
\end{cases}
$$

$$
\left[\begin{array}{cc|c}
1 & 1 & 3 \\
1 & -1 & 1
\end{array}\right]
\xrightarrow{R_2 - R_1}
\left[\begin{array}{cc|c}
1 & 1 & 3 \\
0 & -2 & -2
\end{array}\right]
\xrightarrow{R_2 / (-2)}
\left[\begin{array}{cc|c}
1 & 1 & 3 \\
0 & 1 & 1
\end{array}\right]
$$

$$
\xrightarrow{R_1 - R_2}
\left[\begin{array}{cc|c}
1 & 0 & 2 \\
0 & 1 & 1
\end{array}\right]
$$

**Solution:** $x = 2$, $y = 1$ (unique).

---

### **(Example 2: No Solution)**

$$
\begin{cases}
x + y = 1 \\
x + y = 2
\end{cases}
$$

$$
\left[\begin{array}{cc|c}
1 & 1 & 1 \\
1 & 1 & 2
\end{array}\right]
\xrightarrow{R_2 - R_1}
\left[\begin{array}{cc|c}
1 & 1 & 1 \\
0 & 0 & 1
\end{array}\right]
$$

**Inconsistent** (pivot in last column).

---

### **(Example 3: Infinitely Many Solutions)**

$$
\begin{cases}
x + 2y = 4 \\
2x + 4y = 8
\end{cases}
$$

$$
\left[\begin{array}{cc|c}
1 & 2 & 4 \\
2 & 4 & 8
\end{array}\right]
\xrightarrow{R_2 - 2R_1}
\left[\begin{array}{cc|c}
1 & 2 & 4 \\
0 & 0 & 0
\end{array}\right]
$$

**General solution:** $x = 4 - 2t$, $y = t$ for any $t \in \mathbb{R}$.

This is a line (1-dimensional solution space).

---

## Why This Matters

Row reduction is the **universal algorithm** for linear systems. It tells you:
- Does a solution exist? (Check for pivot in last column)
- Is it unique? (Count free variables)
- What is the solution? (Solve for basic variables in terms of free ones)

Every computational tool in linear algebra,finding inverses, computing kernels, checking independence,ultimately reduces to row reduction.

The geometry is simple: each equation carves out a hyperplane. The algebra is mechanical: row operations preserve solutions. Together, they give you a complete answer to "does this system have solutions, and if so, what are they?"

Next, we'll build the geometric language,vectors, spans, linear combinations,that makes sense of what these solutions mean.
