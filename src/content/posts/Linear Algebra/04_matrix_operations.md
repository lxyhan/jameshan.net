---
title: '4: Matrix Operations'
pubDate: '2025-12-06'
---

Matrices aren't just grids of numbers,they're objects with their own arithmetic. Matrix addition and scalar multiplication work entry-by-entry, but matrix multiplication is something stranger and more powerful: it's function composition in disguise.

## Matrix Addition

### **(Matrix Addition)**

Two matrices $A$ and $B$ can be added if and only if they have the **same dimensions**. If $A$ and $B$ are both $m \times n$, their sum is defined entry-by-entry:

$$
(A + B)_{ij} = A_{ij} + B_{ij}
$$

**Example:**

$$
\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} + \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix} = \begin{bmatrix} 6 & 8 \\ 10 & 12 \end{bmatrix}
$$

---

### **(Properties of Matrix Addition)**

For matrices $A$, $B$, $C$ of the same size:

1. **Commutativity**: $A + B = B + A$
2. **Associativity**: $(A + B) + C = A + (B + C)$
3. **Identity**: $A + O = A$ where $O$ is the zero matrix
4. **Inverse**: $A + (-A) = O$

Matrix addition inherits all the nice properties of real number addition.

---

## Scalar Multiplication

### **(Scalar Multiplication)**

For a scalar $c \in \mathbb{R}$ and matrix $A$:

$$
(cA)_{ij} = c \cdot A_{ij}
$$

Every entry gets multiplied by $c$.

**Example:**

$$
3 \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 3 & 6 \\ 9 & 12 \end{bmatrix}
$$

---

### **(Properties of Scalar Multiplication)**

For scalars $c, d$ and matrices $A, B$:

1. **Associativity**: $c(dA) = (cd)A$
2. **Distributivity over matrix addition**: $c(A + B) = cA + cB$
3. **Distributivity over scalar addition**: $(c + d)A = cA + dA$
4. **Identity**: $1 \cdot A = A$

---

## Matrix Multiplication

Matrix multiplication is where things get interesting. Unlike addition, it's not entry-by-entry,it encodes something deeper.

### **(When Can You Multiply?)**

You can compute $AB$ if and only if:

$$
\text{(columns of } A) = \text{(rows of } B)
$$

If $A$ is $m \times n$ and $B$ is $n \times p$, then $AB$ is $m \times p$.

$$
\underbrace{A}_{m \times n} \cdot \underbrace{B}_{n \times p} = \underbrace{AB}_{m \times p}
$$

The inner dimensions must match; the outer dimensions give the result size.

---

### **(The Entry Formula)**

The $(i, j)$ entry of $AB$ is computed as:

$$
(AB)_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj} = A_{i1}B_{1j} + A_{i2}B_{2j} + \cdots + A_{in}B_{nj}
$$

This is the **dot product** of row $i$ of $A$ with column $j$ of $B$.

**Example:**

$$
\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix} = \begin{bmatrix} 1(5) + 2(7) & 1(6) + 2(8) \\ 3(5) + 4(7) & 3(6) + 4(8) \end{bmatrix} = \begin{bmatrix} 19 & 22 \\ 43 & 50 \end{bmatrix}
$$

---

## Three Ways to See Matrix Multiplication

The entry formula is correct but unilluminating. Here are three better perspectives.

### **(View 1: Column Combinations)**

Each column of $AB$ is $A$ times the corresponding column of $B$:

$$
AB = A[\mathbf{b}_1 \mid \mathbf{b}_2 \mid \cdots \mid \mathbf{b}_p] = [A\mathbf{b}_1 \mid A\mathbf{b}_2 \mid \cdots \mid A\mathbf{b}_p]
$$

**Interpretation:** $B$ tells you how to take linear combinations of $A$'s columns.

---

### **(View 2: Row Combinations)**

Each row of $AB$ is the corresponding row of $A$ times $B$:

$$
AB = \begin{bmatrix} \mathbf{a}_1^T \\ \mathbf{a}_2^T \\ \vdots \\ \mathbf{a}_m^T \end{bmatrix} B = \begin{bmatrix} \mathbf{a}_1^T B \\ \mathbf{a}_2^T B \\ \vdots \\ \mathbf{a}_m^T B \end{bmatrix}
$$

**Interpretation:** $A$ tells you how to take linear combinations of $B$'s rows.

---

### **(View 3: Function Composition)**

If $T_A(\mathbf{x}) = A\mathbf{x}$ and $T_B(\mathbf{x}) = B\mathbf{x}$, then:

$$
T_A(T_B(\mathbf{x})) = A(B\mathbf{x}) = (AB)\mathbf{x} = T_{AB}(\mathbf{x})
$$

**Matrix multiplication is function composition.**

The matrix $AB$ represents "first apply $B$, then apply $A$." This is why multiplication isn't commutative,the order of transformations matters.

---

### **(View 4: Outer Product Sum)**

$AB$ can be written as a sum of rank-1 matrices:

$$
AB = \sum_{k=1}^{n} (\text{column } k \text{ of } A) \cdot (\text{row } k \text{ of } B)
$$

Each term is an outer product,a column times a row,giving a rank-1 matrix. The sum builds up the full product.

---

## Matrix Multiplication is NOT Commutative

### **(Non-Commutativity)**

In general, $AB \neq BA$.

**Reasons:**
1. $AB$ might exist when $BA$ doesn't (dimension mismatch)
2. Even when both exist, they may have different sizes
3. Even when both are the same size, the entries usually differ

**Example:**

$$
\begin{bmatrix} 1 & 2 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & 0 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 6 & 8 \\ 0 & 0 \end{bmatrix}
$$

$$
\begin{bmatrix} 0 & 0 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 3 & 6 \end{bmatrix}
$$

Same matrices, different order, different result.

**Intuition:** "Rotate then reflect" is not the same as "reflect then rotate."

---

## Properties of Matrix Multiplication

### **(What DOES Hold)**

For matrices of compatible sizes:

1. **Associativity**: $(AB)C = A(BC)$
2. **Distributivity**: $A(B + C) = AB + AC$ and $(A + B)C = AC + BC$
3. **Scalar compatibility**: $c(AB) = (cA)B = A(cB)$
4. **Identity**: $I_m A = A = A I_n$ for $A$ of size $m \times n$

Associativity is remarkable,it says we can chain transformations without worrying about grouping. This is why we can write $ABC$ without parentheses.

---

### **(The Identity Matrix)**

The **identity matrix** $I_n$ is the $n \times n$ matrix with $1$s on the diagonal and $0$s elsewhere:

$$
I_3 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

**Property:** $I_n \mathbf{x} = \mathbf{x}$ for all $\mathbf{x} \in \mathbb{R}^n$.

The identity matrix is the "do nothing" transformation.

---

## The Transpose

### **(Transpose)**

The **transpose** of $A$, denoted $A^T$, swaps rows and columns:

$$
(A^T)_{ij} = A_{ji}
$$

If $A$ is $m \times n$, then $A^T$ is $n \times m$.

**Example:**

$$
\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}^T = \begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}
$$

---

### **(Properties of Transpose)**

1. $(A^T)^T = A$
2. $(A + B)^T = A^T + B^T$
3. $(cA)^T = cA^T$
4. $(AB)^T = B^T A^T$ (note the order reversal!)

The transpose reversal $(AB)^T = B^T A^T$ mirrors how function composition reverses: to undo "first $B$, then $A$," you undo $A$ first, then $B$.

---

### **(Symmetric Matrices)**

A matrix is **symmetric** if $A^T = A$.

This means $A_{ij} = A_{ji}$,the matrix equals its mirror across the diagonal.

**Example:**

$$
\begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 5 \\ 3 & 5 & 6 \end{bmatrix}
$$

Symmetric matrices have special properties: their eigenvalues are real, and they can be orthogonally diagonalized.

---

## Matrix Powers

### **(Powers of Square Matrices)**

For a square matrix $A$ and positive integer $k$:

$$
A^k = \underbrace{A \cdot A \cdots A}_{k \text{ times}}
$$

By convention, $A^0 = I$.

**Interpretation:** $A^k$ represents applying the transformation $A$ a total of $k$ times.

---

### **(Example: Powers Reveal Structure)**

$$
A = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}
$$

Then $A^2 = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$.

This matrix is **nilpotent**,some power of it is zero. Geometrically, applying it twice collapses everything.

---

## Matrix Inverses

### **(Inverse Matrix)**

An $n \times n$ matrix $A$ is **invertible** (or **nonsingular**) if there exists a matrix $A^{-1}$ such that:

$$
AA^{-1} = A^{-1}A = I_n
$$

The matrix $A^{-1}$ is called the **inverse** of $A$.

**Interpretation:** If $A$ represents a transformation, then $A^{-1}$ is the transformation that undoes it. Applying $A$ then $A^{-1}$ (or vice versa) returns you to where you started.

---

### **(Uniqueness)**

If $A$ is invertible, its inverse is **unique**.

**Proof:** Suppose $B$ and $C$ are both inverses of $A$. Then:

$$
B = BI = B(AC) = (BA)C = IC = C
$$

---

### **(2×2 Inverse Formula)**

For $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ with $\det(A) = ad - bc \neq 0$:

$$
A^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}
$$

Swap the diagonal entries, negate the off-diagonal entries, and divide by the determinant.

**Example:**

$$
\begin{bmatrix} 2 & 1 \\ 5 & 3 \end{bmatrix}^{-1} = \frac{1}{6-5} \begin{bmatrix} 3 & -1 \\ -5 & 2 \end{bmatrix} = \begin{bmatrix} 3 & -1 \\ -5 & 2 \end{bmatrix}
$$

---

### **(Computing Inverses via Row Reduction)**

For larger matrices, use the **augmented matrix method**:

1. Form the augmented matrix $[A \mid I]$
2. Row reduce until the left side becomes $I$
3. The right side becomes $A^{-1}$

$$
[A \mid I] \xrightarrow{\text{row ops}} [I \mid A^{-1}]
$$

If $A$ cannot be reduced to $I$ (a row of zeros appears on the left), then $A$ is not invertible.

**Example:**

$$
\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 3 & 7 & 0 & 1 \end{array}\right] \xrightarrow{R_2 - 3R_1} \left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\ 0 & 1 & -3 & 1 \end{array}\right] \xrightarrow{R_1 - 2R_2} \left[\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\ 0 & 1 & -3 & 1 \end{array}\right]
$$

So $\begin{bmatrix} 1 & 2 \\ 3 & 7 \end{bmatrix}^{-1} = \begin{bmatrix} 7 & -2 \\ -3 & 1 \end{bmatrix}$.

---

### **(When is a Matrix Invertible?)**

For an $n \times n$ matrix $A$, the following are equivalent:

1. $A$ is invertible
2. $\det(A) \neq 0$
3. $\text{rank}(A) = n$
4. $\text{rref}(A) = I_n$
5. The columns of $A$ are linearly independent
6. The columns of $A$ span $\mathbb{R}^n$
7. $A\mathbf{x} = \mathbf{b}$ has exactly one solution for every $\mathbf{b}$
8. $A\mathbf{x} = \mathbf{0}$ has only the trivial solution
9. $\ker(A) = \{\mathbf{0}\}$

These are all ways of saying $A$ doesn't collapse any dimension.

---

### **(Properties of Inverses)**

For invertible matrices $A$ and $B$:

1. $(A^{-1})^{-1} = A$
2. $(AB)^{-1} = B^{-1}A^{-1}$ (note the order reversal!)
3. $(A^T)^{-1} = (A^{-1})^T$
4. $(cA)^{-1} = \frac{1}{c}A^{-1}$ for $c \neq 0$
5. $(A^k)^{-1} = (A^{-1})^k$

The reversal in $(AB)^{-1} = B^{-1}A^{-1}$ makes sense: to undo "first $B$, then $A$," you must undo $A$ first, then undo $B$.

---

### **(Solving Systems with Inverses)**

If $A$ is invertible, the system $A\mathbf{x} = \mathbf{b}$ has the unique solution:

$$
\mathbf{x} = A^{-1}\mathbf{b}
$$

**Proof:** Multiply both sides of $A\mathbf{x} = \mathbf{b}$ by $A^{-1}$:

$$
A^{-1}(A\mathbf{x}) = A^{-1}\mathbf{b} \implies I\mathbf{x} = A^{-1}\mathbf{b} \implies \mathbf{x} = A^{-1}\mathbf{b}
$$

**Note:** In practice, row reduction is more efficient than computing $A^{-1}$ explicitly.

---

### **(Singular Matrices)**

A matrix that is **not** invertible is called **singular**.

Singular matrices have $\det(A) = 0$, meaning they collapse at least one dimension. There's no way to "uncollapse",information is lost, so no inverse exists.

**Example:**

$$
A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}
$$

The columns are linearly dependent (second is twice the first), $\det(A) = 0$, and $A$ maps all of $\mathbb{R}^2$ onto a line. No inverse exists.

---

## Why Matrix Multiplication Works This Way

The definition of matrix multiplication seems arbitrary until you realize it's **forced** by the requirement that matrices represent linear transformations.

If we want $(AB)\mathbf{x} = A(B\mathbf{x})$ to hold for all $\mathbf{x}$, there's only one possible definition for $AB$. The entry formula, the column view, and all the properties follow inevitably.

Matrix multiplication is function composition,the rest is just computing what that means entry-by-entry.
