---
title: '8: Vector Calculus Theorems'
pubDate: '2025-01-28'
---

The fundamental theorems connecting line integrals, surface integrals, and volume integrals.

---

## Overview: The Big Three

| Theorem | Relates | Equation |
|---------|---------|----------|
| **Green's** | Line integral ↔ Double integral | $\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_D \text{curl}_z \mathbf{F} \, dA$ |
| **Stokes'** | Line integral ↔ Surface integral | $\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S \text{curl } \mathbf{F} \cdot d\mathbf{S}$ |
| **Divergence** | Surface integral ↔ Volume integral | $\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_E \text{div } \mathbf{F} \, dV$ |

These are all generalizations of the Fundamental Theorem of Calculus.

---

## Curl and Divergence

### Curl

For $\mathbf{F} = \langle P, Q, R \rangle$:

$$
\text{curl } \mathbf{F} = \nabla \times \mathbf{F} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ P & Q & R \end{vmatrix}
$$

$$
= \left\langle \frac{\partial R}{\partial y} - \frac{\partial Q}{\partial z}, \frac{\partial P}{\partial z} - \frac{\partial R}{\partial x}, \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right\rangle
$$

**Physical meaning:** Measures rotation/circulation at a point. The curl vector points along the axis of rotation.

### Divergence

$$
\text{div } \mathbf{F} = \nabla \cdot \mathbf{F} = \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z}
$$

**Physical meaning:** Measures expansion/compression at a point.
- $\text{div } \mathbf{F} > 0$: source (flow outward)
- $\text{div } \mathbf{F} < 0$: sink (flow inward)
- $\text{div } \mathbf{F} = 0$: incompressible

### Key Identities

- $\text{curl}(\nabla f) = \mathbf{0}$ (gradient fields are irrotational)
- $\text{div}(\text{curl } \mathbf{F}) = 0$ (curl fields are incompressible)
- $\text{div}(\nabla f) = \nabla^2 f = f_{xx} + f_{yy} + f_{zz}$ (Laplacian)

---

## Green's Theorem

Let $C$ be a positively oriented (counterclockwise), piecewise smooth, simple closed curve in the plane, and let $D$ be the region bounded by $C$.

### Circulation Form

$$
\oint_C \mathbf{F} \cdot d\mathbf{r} = \oint_C P \, dx + Q \, dy = \iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dA
$$

**Interpretation:** Circulation around $C$ equals the total curl inside.

### Flux Form

$$
\oint_C \mathbf{F} \cdot \mathbf{n} \, ds = \oint_C P \, dy - Q \, dx = \iint_D \left( \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} \right) dA
$$

**Interpretation:** Flux across $C$ equals the total divergence inside.

### Applications

1. **Compute area:** $A = \frac{1}{2}\oint_C x \, dy - y \, dx$

2. **Simplify line integrals** by converting to double integrals (or vice versa)

3. **Prove path independence** (if curl = 0 everywhere)

---

## Stokes' Theorem

Let $S$ be an oriented surface with boundary curve $C$ (oriented by right-hand rule).

$$
\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\text{curl } \mathbf{F}) \cdot d\mathbf{S}
$$

**Interpretation:** Circulation around $C$ equals the total curl flowing through $S$.

### Special Cases

- If $S$ is in the $xy$-plane: reduces to Green's Theorem
- If curl $\mathbf{F} = \mathbf{0}$: line integral is path-independent

### Applications

1. **Compute line integrals** via surface integrals (or vice versa)

2. **Show independence of surface:** If two surfaces share the same boundary, they give the same flux of curl $\mathbf{F}$

3. **Physical:** Relates circulation to vorticity

---

## The Divergence Theorem (Gauss's Theorem)

Let $E$ be a solid region with outward-oriented boundary surface $S$.

$$
\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_E (\text{div } \mathbf{F}) \, dV
$$

**Interpretation:** Total flux out of $E$ equals the total divergence inside.

### Applications

1. **Compute flux** through closed surfaces

2. **Derive physical laws:** Conservation of mass, Gauss's law in electromagnetism

3. **Compute volume:** $V = \frac{1}{3}\iint_S \mathbf{r} \cdot d\mathbf{S}$ where $\mathbf{r} = \langle x, y, z \rangle$

### Example: Flux of Position Vector

For $\mathbf{F} = \mathbf{r} = \langle x, y, z \rangle$:
- $\text{div } \mathbf{r} = 3$
- Flux through closed surface $S$ bounding volume $V$: $\iint_S \mathbf{r} \cdot d\mathbf{S} = 3V$

---

## Summary: When to Use Each Theorem

| If you have... | And want... | Use... |
|----------------|-------------|--------|
| Line integral in 2D | Double integral | Green's |
| Line integral in 3D | Surface integral | Stokes' |
| Surface integral (closed) | Volume integral | Divergence |

### The Generalized Stokes' Theorem

All three theorems are special cases of:

$$
\int_{\partial \Omega} \omega = \int_\Omega d\omega
$$

"The integral of a form over the boundary equals the integral of its derivative over the interior."

---

## Physical Applications

### Fluid Flow

- **Divergence theorem:** Conservation of mass
- **Stokes' theorem:** Kelvin's circulation theorem

### Electromagnetism (Maxwell's Equations)

- $\iint_S \mathbf{E} \cdot d\mathbf{S} = \frac{Q}{\epsilon_0}$ (Gauss's law)
- $\oint_C \mathbf{B} \cdot d\mathbf{r} = \mu_0 I$ (Ampère's law)

### Heat Flow

- Flux of heat = $-k\nabla T$
- Heat equation derived using divergence theorem

---

## Quick Reference

| Concept | Formula |
|---------|---------|
| Curl | $\nabla \times \mathbf{F} = \langle R_y - Q_z, P_z - R_x, Q_x - P_y \rangle$ |
| Divergence | $\nabla \cdot \mathbf{F} = P_x + Q_y + R_z$ |
| Green's (circulation) | $\oint_C P\,dx + Q\,dy = \iint_D (Q_x - P_y)\,dA$ |
| Stokes' | $\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S}$ |
| Divergence | $\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_E (\nabla \cdot \mathbf{F})\,dV$ |
