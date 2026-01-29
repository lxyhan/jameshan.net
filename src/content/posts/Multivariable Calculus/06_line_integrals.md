---
title: '6: Line Integrals'
pubDate: '2025-01-28'
---

Integrating functions along curves.

---

## Line Integrals of Scalar Functions

### Definition

For a curve $C$ parametrized by $\mathbf{r}(t)$, $a \leq t \leq b$:

$$
\int_C f \, ds = \int_a^b f(\mathbf{r}(t)) |\mathbf{r}'(t)| \, dt
$$

where $ds = |\mathbf{r}'(t)| \, dt$ is the arc length element.

### Interpretation

- If $f = 1$: gives the **arc length** of $C$
- If $f = \rho$ (density): gives the **mass** of a wire
- Area of a "fence" along $C$ with height $f$

### Properties

- Independent of parametrization direction
- $\int_C f \, ds = \int_{C_1} f \, ds + \int_{C_2} f \, ds$ for piecewise curves

---

## Line Integrals of Vector Fields

### Definition

For a vector field $\mathbf{F} = \langle P, Q, R \rangle$ along curve $C$:

$$
\int_C \mathbf{F} \cdot d\mathbf{r} = \int_a^b \mathbf{F}(\mathbf{r}(t)) \cdot \mathbf{r}'(t) \, dt
$$

### Alternative Notations

$$
\int_C \mathbf{F} \cdot d\mathbf{r} = \int_C P \, dx + Q \, dy + R \, dz = \int_C \mathbf{F} \cdot \mathbf{T} \, ds
$$

### Physical Interpretation: Work

If $\mathbf{F}$ is a force field, $\int_C \mathbf{F} \cdot d\mathbf{r}$ is the **work** done moving along $C$.

### Properties

- **Depends on direction:** $\int_{-C} \mathbf{F} \cdot d\mathbf{r} = -\int_C \mathbf{F} \cdot d\mathbf{r}$
- Additive over paths: $\int_{C_1 + C_2} = \int_{C_1} + \int_{C_2}$

---

## The Fundamental Theorem for Line Integrals

If $\mathbf{F} = \nabla f$ (conservative field) and $C$ goes from $A$ to $B$:

$$
\int_C \nabla f \cdot d\mathbf{r} = f(B) - f(A)
$$

**Key insight:** For conservative fields, the line integral depends only on endpoints, not the path!

---

## Conservative Vector Fields

A vector field $\mathbf{F}$ is **conservative** if $\mathbf{F} = \nabla f$ for some scalar function $f$ (called the **potential function**).

### Equivalent Conditions

The following are equivalent for $\mathbf{F}$ on a simply connected domain:

1. $\mathbf{F}$ is conservative ($\mathbf{F} = \nabla f$)
2. $\int_C \mathbf{F} \cdot d\mathbf{r}$ is path-independent
3. $\oint_C \mathbf{F} \cdot d\mathbf{r} = 0$ for every closed curve
4. $\text{curl } \mathbf{F} = \mathbf{0}$

### Test for Conservative Field in 2D

$\mathbf{F} = \langle P, Q \rangle$ is conservative iff:

$$
\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}
$$

### Test for Conservative Field in 3D

$\mathbf{F} = \langle P, Q, R \rangle$ is conservative iff:

$$
\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}, \quad \frac{\partial P}{\partial z} = \frac{\partial R}{\partial x}, \quad \frac{\partial Q}{\partial z} = \frac{\partial R}{\partial y}
$$

### Finding the Potential Function

If $\mathbf{F} = \langle P, Q \rangle$ is conservative:

1. Integrate: $f = \int P \, dx = \ldots + g(y)$
2. Differentiate: $\frac{\partial f}{\partial y} = Q$
3. Solve for $g(y)$

---

## Applications

### Work Done by a Force

$$
W = \int_C \mathbf{F} \cdot d\mathbf{r}
$$

### Circulation

For a closed curve $C$:

$$
\text{Circulation} = \oint_C \mathbf{F} \cdot d\mathbf{r}
$$

Measures the tendency of the field to circulate around $C$.

### Flux Across a Curve (2D)

$$
\text{Flux} = \int_C \mathbf{F} \cdot \mathbf{n} \, ds
$$

where $\mathbf{n}$ is the outward normal.

---

## Summary

| Integral | Formula | Physical Meaning |
|----------|---------|------------------|
| Scalar line integral | $\int_C f \, ds$ | Mass of wire, arc length |
| Vector line integral | $\int_C \mathbf{F} \cdot d\mathbf{r}$ | Work done by force |
| Conservative field | $\int_C \nabla f \cdot d\mathbf{r} = f(B) - f(A)$ | Path-independent |
| Circulation | $\oint_C \mathbf{F} \cdot d\mathbf{r}$ | Rotational tendency |
