---
title: '3: Vector Functions and Space Curves'
pubDate: '2025-01-28'
---

Vector-valued functions describe curves and motion in space.

---

## Vector Functions

A **vector function** maps a scalar to a vector:

$$
\mathbf{r}(t) = \langle f(t), g(t), h(t) \rangle = f(t)\mathbf{i} + g(t)\mathbf{j} + h(t)\mathbf{k}
$$

As $t$ varies, $\mathbf{r}(t)$ traces out a **space curve**.

### Examples

**Helix:**
$$
\mathbf{r}(t) = \langle \cos t, \sin t, t \rangle
$$

**Line:**
$$
\mathbf{r}(t) = \mathbf{r}_0 + t\mathbf{v}
$$

**Circle in the $xy$-plane:**
$$
\mathbf{r}(t) = \langle r\cos t, r\sin t, 0 \rangle
$$

---

## Calculus of Vector Functions

### Limits and Continuity

Take limits component-wise:

$$
\lim_{t \to a} \mathbf{r}(t) = \left\langle \lim_{t \to a} f(t), \lim_{t \to a} g(t), \lim_{t \to a} h(t) \right\rangle
$$

### Derivatives

$$
\mathbf{r}'(t) = \langle f'(t), g'(t), h'(t) \rangle
$$

**Geometric meaning:** $\mathbf{r}'(t)$ is the **tangent vector** to the curve at $\mathbf{r}(t)$.

**Unit tangent vector:**
$$
\mathbf{T}(t) = \frac{\mathbf{r}'(t)}{|\mathbf{r}'(t)|}
$$

### Differentiation Rules

- $(c\mathbf{r})' = c\mathbf{r}'$
- $(\mathbf{u} + \mathbf{v})' = \mathbf{u}' + \mathbf{v}'$
- $(f\mathbf{r})' = f'\mathbf{r} + f\mathbf{r}'$ (scalar times vector)
- $(\mathbf{u} \cdot \mathbf{v})' = \mathbf{u}' \cdot \mathbf{v} + \mathbf{u} \cdot \mathbf{v}'$
- $(\mathbf{u} \times \mathbf{v})' = \mathbf{u}' \times \mathbf{v} + \mathbf{u} \times \mathbf{v}'$

### Integrals

$$
\int_a^b \mathbf{r}(t) \, dt = \left\langle \int_a^b f(t)\,dt, \int_a^b g(t)\,dt, \int_a^b h(t)\,dt \right\rangle
$$

---

## Motion in Space

If $\mathbf{r}(t)$ is the position of a particle:

| Quantity | Formula |
|----------|---------|
| **Position** | $\mathbf{r}(t)$ |
| **Velocity** | $\mathbf{v}(t) = \mathbf{r}'(t)$ |
| **Speed** | $|\mathbf{v}(t)| = |\mathbf{r}'(t)|$ |
| **Acceleration** | $\mathbf{a}(t) = \mathbf{v}'(t) = \mathbf{r}''(t)$ |

### Arc Length

Length of curve from $t = a$ to $t = b$:

$$
L = \int_a^b |\mathbf{r}'(t)| \, dt = \int_a^b \sqrt{(x')^2 + (y')^2 + (z')^2} \, dt
$$

### Arc Length Parameter

The **arc length function**:
$$
s(t) = \int_a^t |\mathbf{r}'(u)| \, du
$$

Note: $\frac{ds}{dt} = |\mathbf{r}'(t)|$

---

## Curvature

**Curvature** $\kappa$ measures how fast the curve turns:

$$
\kappa = \left| \frac{d\mathbf{T}}{ds} \right| = \frac{|\mathbf{T}'(t)|}{|\mathbf{r}'(t)|} = \frac{|\mathbf{r}'(t) \times \mathbf{r}''(t)|}{|\mathbf{r}'(t)|^3}
$$

### Radius of Curvature

$$
\rho = \frac{1}{\kappa}
$$

The radius of the best-fitting circle (osculating circle) at that point.

### Curvature for $y = f(x)$

$$
\kappa = \frac{|f''(x)|}{[1 + (f'(x))^2]^{3/2}}
$$

---

## The TNB Frame (Frenet-Serret Frame)

Three mutually perpendicular unit vectors that move along the curve:

### Unit Tangent Vector

$$
\mathbf{T} = \frac{\mathbf{r}'}{|\mathbf{r}'|}
$$

Points in the direction of motion.

### Principal Normal Vector

$$
\mathbf{N} = \frac{\mathbf{T}'}{|\mathbf{T}'|}
$$

Points toward the center of curvature (the direction the curve is turning).

### Binormal Vector

$$
\mathbf{B} = \mathbf{T} \times \mathbf{N}
$$

Perpendicular to the osculating plane.

### Frenet-Serret Formulas

$$
\mathbf{T}' = \kappa |\mathbf{r}'| \mathbf{N}
$$

$$
\mathbf{N}' = -\kappa |\mathbf{r}'| \mathbf{T} + \tau |\mathbf{r}'| \mathbf{B}
$$

$$
\mathbf{B}' = -\tau |\mathbf{r}'| \mathbf{N}
$$

where $\tau$ is the **torsion** (measures how the curve twists out of the osculating plane).

---

## Tangential and Normal Components of Acceleration

Acceleration can be decomposed:

$$
\mathbf{a} = a_T \mathbf{T} + a_N \mathbf{N}
$$

where:

**Tangential component** (changes speed):
$$
a_T = \frac{d}{dt}|\mathbf{v}| = \frac{\mathbf{v} \cdot \mathbf{a}}{|\mathbf{v}|}
$$

**Normal component** (changes direction):
$$
a_N = \kappa |\mathbf{v}|^2 = \frac{|\mathbf{v} \times \mathbf{a}|}{|\mathbf{v}|}
$$

---

## Summary

| Concept | Formula |
|---------|---------|
| Tangent vector | $\mathbf{T} = \frac{\mathbf{r}'}{|\mathbf{r}'|}$ |
| Arc length | $L = \int |\mathbf{r}'(t)| \, dt$ |
| Curvature | $\kappa = \frac{|\mathbf{r}' \times \mathbf{r}''|}{|\mathbf{r}'|^3}$ |
| Normal vector | $\mathbf{N} = \frac{\mathbf{T}'}{|\mathbf{T}'|}$ |
| Binormal vector | $\mathbf{B} = \mathbf{T} \times \mathbf{N}$ |
| Tangential acceleration | $a_T = \frac{\mathbf{v} \cdot \mathbf{a}}{|\mathbf{v}|}$ |
| Normal acceleration | $a_N = \frac{|\mathbf{v} \times \mathbf{a}|}{|\mathbf{v}|}$ |
