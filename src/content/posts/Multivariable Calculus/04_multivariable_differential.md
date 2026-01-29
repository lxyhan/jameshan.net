---
title: '4: Differential Calculus of Several Variables'
pubDate: '2025-01-28'
---

Extending derivatives to functions of multiple variables.

---

## Functions of Several Variables

A function $f: \mathbb{R}^n \to \mathbb{R}$ assigns a real number to each point in $n$-dimensional space.

**Examples:**
- $f(x, y) = x^2 + y^2$ (paraboloid)
- $f(x, y) = \sqrt{1 - x^2 - y^2}$ (hemisphere)
- $f(x, y, z) = x^2 + y^2 + z^2$ (distance squared from origin)

### Level Curves and Surfaces

**Level curve:** Set of points where $f(x, y) = c$ (constant)

**Level surface:** Set of points where $f(x, y, z) = c$

These are the "contour lines" on a topographic map.

---

## Limits and Continuity

$$
\lim_{(x,y) \to (a,b)} f(x, y) = L
$$

means $f(x, y)$ approaches $L$ as $(x, y)$ approaches $(a, b)$ **along any path**.

### Showing a Limit Doesn't Exist

Find two different paths to $(a, b)$ that give different limits.

**Example:** For $f(x, y) = \frac{xy}{x^2 + y^2}$:
- Along $y = 0$: $\lim = 0$
- Along $y = x$: $\lim = \frac{1}{2}$

So the limit doesn't exist at $(0, 0)$.

---

## Partial Derivatives

Hold all variables constant except one, then differentiate:

$$
\frac{\partial f}{\partial x} = f_x = \lim_{h \to 0} \frac{f(x+h, y) - f(x, y)}{h}
$$

$$
\frac{\partial f}{\partial y} = f_y = \lim_{h \to 0} \frac{f(x, y+h) - f(x, y)}{h}
$$

### Higher-Order Partials

$$
f_{xx} = \frac{\partial^2 f}{\partial x^2}, \quad f_{yy} = \frac{\partial^2 f}{\partial y^2}, \quad f_{xy} = \frac{\partial^2 f}{\partial y \partial x}
$$

**Clairaut's Theorem:** If $f_{xy}$ and $f_{yx}$ are continuous, then $f_{xy} = f_{yx}$.

---

## The Gradient

The **gradient** of $f$ is the vector of partial derivatives:

$$
\nabla f = \left\langle \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right\rangle
$$

### Key Properties

1. $\nabla f$ points in the direction of **steepest increase**
2. $|\nabla f|$ is the **rate of steepest increase**
3. $\nabla f$ is **perpendicular to level curves/surfaces**

---

## Directional Derivatives

The rate of change of $f$ in direction $\mathbf{u}$ (unit vector):

$$
D_\mathbf{u} f = \nabla f \cdot \mathbf{u} = |\nabla f| \cos\theta
$$

**Maximum:** $D_\mathbf{u} f = |\nabla f|$ when $\mathbf{u}$ is parallel to $\nabla f$

**Minimum:** $D_\mathbf{u} f = -|\nabla f|$ when $\mathbf{u}$ is opposite to $\nabla f$

**Zero:** $D_\mathbf{u} f = 0$ when $\mathbf{u} \perp \nabla f$ (along level curve)

---

## Chain Rule

### Case 1: $z = f(x, y)$ where $x = g(t)$, $y = h(t)$

$$
\frac{dz}{dt} = \frac{\partial f}{\partial x}\frac{dx}{dt} + \frac{\partial f}{\partial y}\frac{dy}{dt}
$$

### Case 2: $z = f(x, y)$ where $x = g(s, t)$, $y = h(s, t)$

$$
\frac{\partial z}{\partial s} = \frac{\partial f}{\partial x}\frac{\partial x}{\partial s} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial s}
$$

$$
\frac{\partial z}{\partial t} = \frac{\partial f}{\partial x}\frac{\partial x}{\partial t} + \frac{\partial f}{\partial y}\frac{\partial y}{\partial t}
$$

### Implicit Differentiation

If $F(x, y) = 0$ defines $y$ implicitly as a function of $x$:

$$
\frac{dy}{dx} = -\frac{F_x}{F_y}
$$

---

## Tangent Planes and Linear Approximation

### Tangent Plane

To surface $z = f(x, y)$ at $(a, b, f(a, b))$:

$$
z - f(a, b) = f_x(a, b)(x - a) + f_y(a, b)(y - b)
$$

### Linear Approximation

$$
f(x, y) \approx f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b)
$$

### Total Differential

$$
df = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy
$$

---

## Optimization

### Critical Points

Points where $\nabla f = \mathbf{0}$ (or gradient doesn't exist).

$$
f_x = 0 \quad \text{and} \quad f_y = 0
$$

### Second Derivative Test

At critical point $(a, b)$, compute:

$$
D = f_{xx}(a, b) f_{yy}(a, b) - [f_{xy}(a, b)]^2
$$

| Condition | Conclusion |
|-----------|------------|
| $D > 0$ and $f_{xx} > 0$ | Local minimum |
| $D > 0$ and $f_{xx} < 0$ | Local maximum |
| $D < 0$ | Saddle point |
| $D = 0$ | Test inconclusive |

### Lagrange Multipliers

To optimize $f(x, y)$ subject to constraint $g(x, y) = c$:

Solve the system:
$$
\nabla f = \lambda \nabla g
$$
$$
g(x, y) = c
$$

**Geometric interpretation:** At the optimum, $\nabla f$ is parallel to $\nabla g$ (level curve of $f$ is tangent to constraint curve).

---

## Summary

| Concept | Formula |
|---------|---------|
| Partial derivative | $f_x = \lim_{h \to 0} \frac{f(x+h, y) - f(x,y)}{h}$ |
| Gradient | $\nabla f = \langle f_x, f_y, f_z \rangle$ |
| Directional derivative | $D_\mathbf{u} f = \nabla f \cdot \mathbf{u}$ |
| Tangent plane | $z = f(a,b) + f_x(x-a) + f_y(y-b)$ |
| Critical points | $\nabla f = \mathbf{0}$ |
| Lagrange multipliers | $\nabla f = \lambda \nabla g$ |
