---
title: '7: Surface Integrals'
pubDate: '2025-01-28'
---

Integrating functions over surfaces in 3D.

---

## Parametric Surfaces

A surface $S$ can be parametrized by:

$$
\mathbf{r}(u, v) = \langle x(u, v), y(u, v), z(u, v) \rangle
$$

where $(u, v)$ varies over some region $D$ in the $uv$-plane.

### Examples

**Sphere** of radius $a$:
$$
\mathbf{r}(\phi, \theta) = \langle a\sin\phi\cos\theta, a\sin\phi\sin\theta, a\cos\phi \rangle
$$

**Cylinder** of radius $r$:
$$
\mathbf{r}(\theta, z) = \langle r\cos\theta, r\sin\theta, z \rangle
$$

**Graph** $z = f(x, y)$:
$$
\mathbf{r}(x, y) = \langle x, y, f(x, y) \rangle
$$

---

## Tangent Planes and Normal Vectors

The **tangent vectors** to the surface:

$$
\mathbf{r}_u = \frac{\partial \mathbf{r}}{\partial u}, \quad \mathbf{r}_v = \frac{\partial \mathbf{r}}{\partial v}
$$

The **normal vector**:

$$
\mathbf{n} = \mathbf{r}_u \times \mathbf{r}_v
$$

This is perpendicular to the surface at each point.

### For a Graph $z = f(x, y)$

$$
\mathbf{n} = \langle -f_x, -f_y, 1 \rangle
$$

---

## Surface Area

$$
A = \iint_D |\mathbf{r}_u \times \mathbf{r}_v| \, dA
$$

### For a Graph $z = f(x, y)$

$$
A = \iint_D \sqrt{1 + f_x^2 + f_y^2} \, dA
$$

---

## Surface Integrals of Scalar Functions

$$
\iint_S f \, dS = \iint_D f(\mathbf{r}(u, v)) |\mathbf{r}_u \times \mathbf{r}_v| \, dA
$$

### For a Graph

$$
\iint_S f \, dS = \iint_D f(x, y, f(x,y)) \sqrt{1 + f_x^2 + f_y^2} \, dA
$$

### Applications

- **Surface area:** $\iint_S 1 \, dS$
- **Mass of a shell:** $\iint_S \rho \, dS$
- **Center of mass:** $\bar{x} = \frac{1}{m}\iint_S x\rho \, dS$

---

## Oriented Surfaces

An **oriented surface** has a chosen "positive" side (direction of normal).

- **Closed surface:** Convention is outward normal
- **Surface with boundary:** Use right-hand rule with boundary curve

---

## Surface Integrals of Vector Fields (Flux)

The **flux** of $\mathbf{F}$ through surface $S$:

$$
\iint_S \mathbf{F} \cdot d\mathbf{S} = \iint_S \mathbf{F} \cdot \mathbf{n} \, dS
$$

### Computation

$$
\iint_S \mathbf{F} \cdot d\mathbf{S} = \iint_D \mathbf{F}(\mathbf{r}(u,v)) \cdot (\mathbf{r}_u \times \mathbf{r}_v) \, dA
$$

### For a Graph $z = f(x, y)$ with Upward Normal

$$
\iint_S \mathbf{F} \cdot d\mathbf{S} = \iint_D \mathbf{F} \cdot \langle -f_x, -f_y, 1 \rangle \, dA
$$

Or if $\mathbf{F} = \langle P, Q, R \rangle$:

$$
\iint_S \mathbf{F} \cdot d\mathbf{S} = \iint_D (-Pf_x - Qf_y + R) \, dA
$$

---

## Physical Interpretation of Flux

If $\mathbf{F}$ is a velocity field of a fluid:

$$
\text{Flux} = \iint_S \mathbf{F} \cdot d\mathbf{S} = \text{volume of fluid passing through } S \text{ per unit time}
$$

- Positive flux: flow in direction of normal
- Negative flux: flow opposite to normal
- Zero flux: flow parallel to surface

---

## Computing Flux Through Common Surfaces

### Sphere of Radius $a$ (Outward Normal)

$$
\mathbf{n} = \frac{\mathbf{r}}{|\mathbf{r}|} = \frac{\langle x, y, z \rangle}{a}
$$

$$
dS = a^2 \sin\phi \, d\phi \, d\theta
$$

### Cylinder (Outward Normal)

$$
\mathbf{n} = \frac{\langle x, y, 0 \rangle}{r}
$$

### Plane

Normal is constant, $dS = dA$.

---

## Summary

| Concept | Formula |
|---------|---------|
| Normal vector | $\mathbf{n} = \mathbf{r}_u \times \mathbf{r}_v$ |
| Surface area | $\iint_D |\mathbf{r}_u \times \mathbf{r}_v| \, dA$ |
| Scalar surface integral | $\iint_S f \, dS = \iint_D f |\mathbf{r}_u \times \mathbf{r}_v| \, dA$ |
| Flux | $\iint_S \mathbf{F} \cdot d\mathbf{S} = \iint_D \mathbf{F} \cdot (\mathbf{r}_u \times \mathbf{r}_v) \, dA$ |
| Graph $z=f(x,y)$ | $dS = \sqrt{1 + f_x^2 + f_y^2} \, dA$ |
