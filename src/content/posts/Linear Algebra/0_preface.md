---
title: '0: Preface'
pubDate: '2025-12-08'
---

Linear algebra is not about matrices. It's about **structure**—how to capture relationships, compress information, and reveal hidden symmetries in the world.

> **Why Linear Algebra Matters**
>
> Every time Google ranks web pages, every time your phone recognizes your face, every time an AI generates text—linear algebra is there, working in the background. It's the mathematical language of systems that are too complex to understand piece by piece, but simple enough to understand as a whole.

This is not a textbook. It's a journey through the key ideas that make linear algebra powerful: from the humble system of equations to the spectral theorem, from concrete calculations to geometric intuition. Each article builds on the last, but each also stands alone.

---

## Why Linear Algebra?

> **The Power of Linear Approximation**
>
> The world is nonlinear—chaotic, curved, unpredictable. But **local behavior is always linear**. Zoom in close enough to any smooth curve and it looks like a line. This is why linear algebra works: it's the calculus of approximation, the mathematics of "good enough."

**Linear algebra gives you tools that scale:**
- Can't solve a problem exactly? **Linearize it**
- Have too much data? **Compress it linearly**
- Need to understand a transformation? **Diagonalize it**
- From two equations in two unknowns to billion-dimensional data spaces

---

## The Narrative Arc

**Part I: The Foundation**
- Begin with **matrices as kitchens** — a single metaphor that unifies three classical views (systems, transformations, combinations)
- Build the **foundations**: solving systems, understanding vectors, learning matrix arithmetic
- These are the building blocks, the grammar of the language

**Part II: Transformations**
- Explore **matrices as functions** that warp space
- Discover **subspaces** (the invariant structures)
- Understand **kernels and images** (what gets destroyed, what gets produced)
- Master **orthogonality** (the geometry of independence)

**Part III: Eigentheory**
- Reach the **crown jewel of linear algebra**
- **Diagonalization** reveals the "natural coordinates" where transformations are simplest
- **The spectral theorem** shows why symmetric matrices are perfect
- Geometry, computation, and theory all converge

---

## What Makes This Different

> **Four Core Principles**
>
> **Geometric intuition first** — Every concept is introduced with a picture: what does this matrix *do* to space? Formulas follow understanding, not the other way around.
>
> **Three perspectives** — Matrices are systems of equations, linear combinations, and transformations simultaneously. We switch between views freely, using whichever makes the current problem clearest.
>
> **Worked examples throughout** — Abstract theorems are illustrated with concrete calculations. You see the machinery in action before you build it.
>
> **Why before what** — Before defining something, we explain why you'd want to. Before proving a theorem, we explain what it tells you about the world.

---

## The Articles

### **Part I: Foundations**

**1. Re-imagining Matrices**
The kitchen metaphor: matrices as pantries, vectors as recipes, multiplication as cooking. This single idea reproduces all three classical views without distortion.

**2. Solving Linear Systems**
Row reduction, echelon forms, and the Rouché–Capelli theorem. The algorithmic heart of linear algebra.

**3. Vectors in Euclidean Space**
Geometric vectors, linear combinations, and the span. The building blocks of vector spaces.

**4. Matrix Operations**
Addition, scalar multiplication, matrix multiplication (four ways!), transpose, and inverse. The arithmetic of transformations.

---

### **Part II: Transformations**

**5. Matrix Transformations**
Matrices as functions. Rotations, reflections, projections, and shears. What do matrices *do*?

**6. Subspaces**
The invariant structures inside vector spaces. Lines through the origin, planes, and beyond.

**7. Kernel and Image**
What gets destroyed (kernel) and what gets produced (image). The fundamental theorem: dimension splits cleanly between them.

**8. Orthogonality and Projections**
Perpendicularity, projections, and Gram-Schmidt. Why orthogonal bases make everything trivial.

---

### **Part III: Structure**

**9. Determinants**
The single number that captures volume scaling and invertibility. Cofactor expansion, properties, and geometric meaning.

**10. Eigenvalues and Eigenvectors**
The special directions a matrix leaves invariant. Finding eigenvalues via the characteristic polynomial, computing eigenvectors, and understanding eigenspaces. The foundation for diagonalization.

**11. Diagonalization and Similarity**
Finding the eigenvector coordinate system where a matrix is just scaling. Powers, exponentials, and long-term behavior.

**12. Orthogonal Diagonalization**
The spectral theorem: symmetric matrices can always be diagonalized with orthonormal eigenvectors. Why symmetric matrices are perfect.

**13. Singular Value Decomposition**
The decomposition that works for any matrix. Rotate, stretch, rotate—every linear transformation in three simple steps.

---

### **Part IV: Applications in Quantitative Finance**

**14. Portfolio Optimization**
Markowitz mean-variance optimization as quadratic forms. Covariance matrices, the efficient frontier, and why eigenvalues reveal risk structure.

**15. PCA in Finance**
Principal Component Analysis for factor discovery. How a few eigenvectors explain most of the variance in hundreds of correlated assets.

**16. Covariance Estimation and Regularization**
When sample covariance fails: shrinkage, factor models, and eigenvalue clipping. The math that makes portfolio optimization actually work.

---

## How to Read This

> **Three Approaches**
>
> **Sequentially** — Each article assumes knowledge from previous ones. The narrative builds.
>
> **Selectively** — Need to understand determinants? Jump to Article 9, then backtrack as needed.
>
> **Experimentally** — Work through the examples by hand. Linear algebra is learned through calculation, not passive reading.

### The Goal: Build Intuition, Not Memorize Formulas

After working through these articles, you should be able to:
- Look at a matrix and **see** what it does: where it stretches, where it collapses, what its eigenspaces look like
- Recognize when a problem calls for **projection**, when it needs **diagonalization**, when **orthogonality** will simplify everything
- Think in transformations, not just numbers

Linear algebra is a way of thinking—a lens for seeing structure in chaos. Let's begin.

---

> **The Kitchen Metaphor**
>
> The metaphor of matrices as kitchens comes from a simple observation: cooking is just taking linear combinations of ingredients. Everything else—transformations, eigenvalues, projections—follows from this one idea. If you understand how a kitchen works, you already understand the essence of linear algebra.
