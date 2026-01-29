---
title: '5: Integral Calculus of Several Variables'
pubDate: '2025-01-28'
---

Double and triple integrals for computing volumes, masses, and other quantities.

---

## Double Integrals

### Definition

$$
\iint_R f(x, y) \, dA = \lim_{n \to \infty} \sum_{i=1}^{n} f(x_i^*, y_i^*) \Delta A_i
$$

### Iterated Integrals

Over a rectangle $R = [a, b] \times [c, d]$:

$$
\iint_R f(x, y) \, dA = \int_a^b \int_c^d f(x, y) \, dy \, dx = \int_c^d \int_a^b f(x, y) \, dx \, dy
$$

**Fubini's Theorem:** Order doesn't matter if $f$ is continuous.

### General Regions

**Type I** (bounded by $y = g_1(x)$ and $y = g_2(x)$):

$$
\iint_D f(x, y) \, dA = \int_a^b \int_{g_1(x)}^{g_2(x)} f(x, y) \, dy \, dx
$$

**Type II** (bounded by $x = h_1(y)$ and $x = h_2(y)$):

$$
\iint_D f(x, y) \, dA = \int_c^d \int_{h_1(y)}^{h_2(y)} f(x, y) \, dx \, dy
$$

---

## Applications of Double Integrals

### Area

$$
A = \iint_D 1 \, dA
$$

### Volume Under Surface

$$
V = \iint_D f(x, y) \, dA
$$

### Mass and Center of Mass

For density $\rho(x, y)$:

**Mass:** $m = \iint_D \rho(x, y) \, dA$

**Center of mass:**
$$
\bar{x} = \frac{1}{m}\iint_D x\rho(x, y) \, dA, \quad \bar{y} = \frac{1}{m}\iint_D y\rho(x, y) \, dA
$$

### Moments of Inertia

$$
I_x = \iint_D y^2 \rho \, dA, \quad I_y = \iint_D x^2 \rho \, dA, \quad I_0 = \iint_D (x^2 + y^2) \rho \, dA
$$

---

## Double Integrals in Polar Coordinates

When the region is circular or the integrand involves $x^2 + y^2$:

$$
\iint_R f(x, y) \, dA = \iint_R f(r\cos\theta, r\sin\theta) \, r \, dr \, d\theta
$$

**Key:** $dA = r \, dr \, d\theta$ (not just $dr \, d\theta$!)

### Example: Disk of radius $a$

$$
\iint_D f \, dA = \int_0^{2\pi} \int_0^a f(r\cos\theta, r\sin\theta) \, r \, dr \, d\theta
$$

---

## Triple Integrals

$$
\iiint_E f(x, y, z) \, dV
$$

### Iterated Form

$$
\iiint_E f \, dV = \int_a^b \int_{g_1(x)}^{g_2(x)} \int_{h_1(x,y)}^{h_2(x,y)} f(x, y, z) \, dz \, dy \, dx
$$

### Applications

**Volume:** $V = \iiint_E 1 \, dV$

**Mass:** $m = \iiint_E \rho(x, y, z) \, dV$

**Center of mass:** $\bar{x} = \frac{1}{m}\iiint_E x\rho \, dV$, etc.

---

## Cylindrical Coordinates

$$
x = r\cos\theta, \quad y = r\sin\theta, \quad z = z
$$

**Volume element:** $dV = r \, dz \, dr \, d\theta$

**Use when:** Region has circular symmetry about the $z$-axis.

### Example: Cylinder

$$
\iiint_E f \, dV = \int_0^{2\pi} \int_0^a \int_0^h f(r\cos\theta, r\sin\theta, z) \, r \, dz \, dr \, d\theta
$$

---

## Spherical Coordinates

$$
x = \rho\sin\phi\cos\theta, \quad y = \rho\sin\phi\sin\theta, \quad z = \rho\cos\phi
$$

where:
- $\rho$ = distance from origin
- $\phi$ = angle from positive $z$-axis ($0 \leq \phi \leq \pi$)
- $\theta$ = angle in $xy$-plane from positive $x$-axis

**Volume element:** $dV = \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$

**Use when:** Region has spherical symmetry.

### Example: Sphere of radius $a$

$$
\iiint_E f \, dV = \int_0^{2\pi} \int_0^{\pi} \int_0^a f \, \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta
$$

---

## Change of Variables (Jacobian)

For transformation $x = g(u, v)$, $y = h(u, v)$:

$$
\iint_R f(x, y) \, dx \, dy = \iint_S f(g(u,v), h(u,v)) \left| \frac{\partial(x, y)}{\partial(u, v)} \right| du \, dv
$$

**Jacobian:**
$$
\frac{\partial(x, y)}{\partial(u, v)} = \begin{vmatrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{vmatrix}
$$

### Common Jacobians

| Coordinates | Jacobian |
|-------------|----------|
| Polar | $r$ |
| Cylindrical | $r$ |
| Spherical | $\rho^2 \sin\phi$ |

---

## Summary

| Coordinate System | $dA$ or $dV$ |
|-------------------|--------------|
| Cartesian 2D | $dx \, dy$ |
| Polar | $r \, dr \, d\theta$ |
| Cartesian 3D | $dx \, dy \, dz$ |
| Cylindrical | $r \, dz \, dr \, d\theta$ |
| Spherical | $\rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$ |
