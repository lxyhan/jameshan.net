---
title: '2: Vectors'
pubDate: '2025-01-28'
---

Vectors are the fundamental language of multivariable calculus and physics.

---

## Vector Basics

A **vector** has magnitude and direction. In $\mathbb{R}^3$:

$$
\mathbf{v} = \langle v_1, v_2, v_3 \rangle = v_1\mathbf{i} + v_2\mathbf{j} + v_3\mathbf{k}
$$

### Magnitude

$$
|\mathbf{v}| = \|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2 + v_3^2}
$$

### Unit Vector

A vector with magnitude 1. To normalize:

$$
\hat{\mathbf{v}} = \frac{\mathbf{v}}{|\mathbf{v}|}
$$

### Vector Operations

**Addition:** $\mathbf{u} + \mathbf{v} = \langle u_1 + v_1, u_2 + v_2, u_3 + v_3 \rangle$

**Scalar multiplication:** $c\mathbf{v} = \langle cv_1, cv_2, cv_3 \rangle$

---

## Dot Product

$$
\mathbf{u} \cdot \mathbf{v} = u_1v_1 + u_2v_2 + u_3v_3
$$

### Geometric Interpretation

$$
\mathbf{u} \cdot \mathbf{v} = |\mathbf{u}||\mathbf{v}|\cos\theta
$$

where $\theta$ is the angle between the vectors.

### Properties

- $\mathbf{u} \cdot \mathbf{v} = 0$ iff $\mathbf{u} \perp \mathbf{v}$ (orthogonal)
- $\mathbf{u} \cdot \mathbf{u} = |\mathbf{u}|^2$
- Commutative: $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$
- Distributive: $\mathbf{u} \cdot (\mathbf{v} + \mathbf{w}) = \mathbf{u} \cdot \mathbf{v} + \mathbf{u} \cdot \mathbf{w}$

### Projection

The projection of $\mathbf{u}$ onto $\mathbf{v}$:

$$
\text{proj}_{\mathbf{v}}\mathbf{u} = \frac{\mathbf{u} \cdot \mathbf{v}}{|\mathbf{v}|^2}\mathbf{v} = \frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\mathbf{v}
$$

Scalar component: $\text{comp}_{\mathbf{v}}\mathbf{u} = \frac{\mathbf{u} \cdot \mathbf{v}}{|\mathbf{v}|}$

---

## Cross Product

Only defined in $\mathbb{R}^3$:

$$
\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3 \end{vmatrix}
$$

$$
= \langle u_2v_3 - u_3v_2, \; u_3v_1 - u_1v_3, \; u_1v_2 - u_2v_1 \rangle
$$

### Geometric Interpretation

- $\mathbf{u} \times \mathbf{v}$ is **perpendicular** to both $\mathbf{u}$ and $\mathbf{v}$
- Direction given by **right-hand rule**
- Magnitude: $|\mathbf{u} \times \mathbf{v}| = |\mathbf{u}||\mathbf{v}|\sin\theta$
- Equals the **area of the parallelogram** formed by $\mathbf{u}$ and $\mathbf{v}$

### Properties

- $\mathbf{u} \times \mathbf{v} = \mathbf{0}$ iff $\mathbf{u} \parallel \mathbf{v}$ (parallel)
- Anti-commutative: $\mathbf{u} \times \mathbf{v} = -(\mathbf{v} \times \mathbf{u})$
- $\mathbf{u} \times \mathbf{u} = \mathbf{0}$
- Distributive: $\mathbf{u} \times (\mathbf{v} + \mathbf{w}) = \mathbf{u} \times \mathbf{v} + \mathbf{u} \times \mathbf{w}$

---

## Triple Products

### Scalar Triple Product

$$
\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = \begin{vmatrix} u_1 & u_2 & u_3 \\ v_1 & v_2 & v_3 \\ w_1 & w_2 & w_3 \end{vmatrix}
$$

**Geometric meaning:** Volume of the parallelepiped formed by $\mathbf{u}, \mathbf{v}, \mathbf{w}$.

### Vector Triple Product

$$
\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = (\mathbf{u} \cdot \mathbf{w})\mathbf{v} - (\mathbf{u} \cdot \mathbf{v})\mathbf{w}
$$

(BAC-CAB rule)

---

## Lines and Planes

### Line in 3D

Through point $P_0 = (x_0, y_0, z_0)$ with direction $\mathbf{v} = \langle a, b, c \rangle$:

**Vector form:** $\mathbf{r}(t) = \mathbf{r}_0 + t\mathbf{v}$

**Parametric form:**
$$
x = x_0 + at, \quad y = y_0 + bt, \quad z = z_0 + ct
$$

**Symmetric form:**
$$
\frac{x - x_0}{a} = \frac{y - y_0}{b} = \frac{z - z_0}{c}
$$

### Plane in 3D

Through point $P_0 = (x_0, y_0, z_0)$ with normal $\mathbf{n} = \langle a, b, c \rangle$:

**Vector form:** $\mathbf{n} \cdot (\mathbf{r} - \mathbf{r}_0) = 0$

**Scalar form:**
$$
a(x - x_0) + b(y - y_0) + c(z - z_0) = 0
$$

**General form:**
$$
ax + by + cz = d
$$

### Distance from Point to Plane

Distance from point $(x_1, y_1, z_1)$ to plane $ax + by + cz = d$:

$$
D = \frac{|ax_1 + by_1 + cz_1 - d|}{\sqrt{a^2 + b^2 + c^2}}
$$

---

## Summary

| Operation | Formula | Result | Geometric Meaning |
|-----------|---------|--------|-------------------|
| Dot product | $\mathbf{u} \cdot \mathbf{v}$ | Scalar | $|\mathbf{u}||\mathbf{v}|\cos\theta$ |
| Cross product | $\mathbf{u} \times \mathbf{v}$ | Vector | Normal to both, area of parallelogram |
| Scalar triple | $\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})$ | Scalar | Volume of parallelepiped |
