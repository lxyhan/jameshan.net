---
title: 'Solving Linear Systems'
pubDate: '2025-11-29'
---

**(Pivot)**
The *pivot* of a row in a matrix is the leftmost nonzero entry in that row.

**(Row Echelon Form)**
A matrix is in *row echelon form* (REF) if and only if:
1. All rows consisting entirely of zeros are at the bottom of the matrix, and
2. The pivot of each nonzero row is in a column strictly to the right of the pivot of the row above it.

**(Reduced Row Echelon Form)** 
A matrix is in *reduced row echelon form* if and only if
1. The matrix is in *Row Echelon Form*
3. The pivot in each nonzero row is 1, and
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

**(Free Variable)**: We say that $x_i$ is a *basic variable* if the $i^{th}$ column of rref(C) has a pivot.

**(Rouche-Capelli Theorem)** 
Suppose that a system of linear equations has augmented matrix A and coefficient matrix C Then,
1. The system is inconsistent if and only if the last column of rref(A) has a pivot
3. The system has one solution if and only if the last column of rref(A) does not have a pivot and every column of rref(C) has a pivot
4. The system has infinitely many solutions if and only if the last column of rref(A) does not have a pivot and rref(C) has a column without a pivot
