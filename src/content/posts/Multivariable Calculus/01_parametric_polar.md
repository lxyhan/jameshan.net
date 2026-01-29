---
title: '1: Parametric Equations / Polar Coordinates'
pubDate: '2025-01-28'
---

Alternative coordinate systems for describing curves and regions.

---

## Parametric Equations

Instead of $y = f(x)$, we describe a curve using a **parameter** $t$:

$$
x = f(t), \quad y = g(t), \quad a \leq t \leq b
$$

### Why Parametric?

- Can describe curves that aren't functions (e.g., circles)
- Natural for motion: $t$ represents time
- Can trace the same curve in different directions/speeds

### Examples

**Circle** of radius $r$:
$$
x = r\cos t, \quad y = r\sin t, \quad 0 \leq t \leq 2\pi
$$

**Ellipse** with semi-axes $a$ and $b$:
$$
x = a\cos t, \quad y = b\sin t, \quad 0 \leq t \leq 2\pi
$$

**Cycloid** (point on a rolling wheel):
$$
x = r(t - \sin t), \quad y = r(1 - \cos t)
$$

---

## Calculus with Parametric Curves

### Derivatives

If $x = f(t)$ and $y = g(t)$, the slope is:

$$
\frac{dy}{dx} = \frac{dy/dt}{dx/dt} = \frac{g'(t)}{f'(t)}
$$

Second derivative:

$$
\frac{d^2y}{dx^2} = \frac{d}{dx}\left(\frac{dy}{dx}\right) = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{dx/dt}
$$

### Arc Length

The length of a parametric curve from $t = a$ to $t = b$:

$$
L = \int_a^b \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2} \, dt
$$

### Area Under a Parametric Curve

$$
A = \int_a^b y \, dx = \int_a^b g(t) f'(t) \, dt
$$

---

## Polar Coordinates

A point is described by distance from origin and angle:

$$
(r, \theta) \quad \text{where } r \geq 0, \quad 0 \leq \theta < 2\pi
$$

### Conversion Formulas

**Polar to Cartesian:**
$$
x = r\cos\theta, \quad y = r\sin\theta
$$

**Cartesian to Polar:**
$$
r = \sqrt{x^2 + y^2}, \quad \tan\theta = \frac{y}{x}
$$

### Common Polar Curves

| Curve | Equation |
|-------|----------|
| Circle (radius $a$) | $r = a$ |
| Circle through origin | $r = a\cos\theta$ or $r = a\sin\theta$ |
| Line through origin | $\theta = c$ |
| Cardioid | $r = a(1 + \cos\theta)$ |
| Rose ($n$ petals) | $r = a\cos(n\theta)$ |
| Lemniscate | $r^2 = a^2\cos(2\theta)$ |
| Spiral | $r = a\theta$ |

---

## Calculus in Polar Coordinates

### Slope of a Polar Curve

Since $x = r\cos\theta$ and $y = r\sin\theta$:

$$
\frac{dy}{dx} = \frac{dy/d\theta}{dx/d\theta} = \frac{\frac{dr}{d\theta}\sin\theta + r\cos\theta}{\frac{dr}{d\theta}\cos\theta - r\sin\theta}
$$

### Area in Polar Coordinates

Area enclosed by $r = f(\theta)$ from $\theta = \alpha$ to $\theta = \beta$:

$$
A = \frac{1}{2}\int_\alpha^\beta r^2 \, d\theta = \frac{1}{2}\int_\alpha^\beta [f(\theta)]^2 \, d\theta
$$

**Intuition:** A thin wedge has area $\frac{1}{2}r^2 \, d\theta$ (like a pizza slice).

### Arc Length in Polar Coordinates

$$
L = \int_\alpha^\beta \sqrt{r^2 + \left(\frac{dr}{d\theta}\right)^2} \, d\theta
$$

---

## Summary

| Concept | Cartesian | Parametric | Polar |
|---------|-----------|------------|-------|
| **Curve** | $y = f(x)$ | $x = f(t), y = g(t)$ | $r = f(\theta)$ |
| **Slope** | $\frac{dy}{dx}$ | $\frac{dy/dt}{dx/dt}$ | $\frac{r'\sin\theta + r\cos\theta}{r'\cos\theta - r\sin\theta}$ |
| **Arc length** | $\int\sqrt{1 + (dy/dx)^2}\,dx$ | $\int\sqrt{(dx/dt)^2 + (dy/dt)^2}\,dt$ | $\int\sqrt{r^2 + (dr/d\theta)^2}\,d\theta$ |
| **Area** | $\int y\,dx$ | $\int g(t)f'(t)\,dt$ | $\frac{1}{2}\int r^2\,d\theta$ |
