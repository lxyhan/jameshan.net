---
title: 'VIII. MarkUs: Touch Annotations'
pubDate: '2025-11-27'
---

# Making Grading Work on Tablets

*For the first time, grading on iPads, Surface tablets, and touchscreen laptops just works.*

**PR #7736** (In Progress)

---

## The Work

Added touch event support for annotations:

- `touchstart` / `touchmove` / `touchend` handlers for PDF annotation manager
- Same handlers for image annotation manager
- Refactored mouse/touch event handling to shared helpers
- Cleaned up coordinate logic
- Switched to `addEventListener` to fix `touchmove` issues
- Reduced JS duplication significantly
- Updated changelog

---

## The Impact

Grading now works on:
- iPads
- Surface tablets
- Android tablets
- Touchscreen laptops

This is critical as more instructors grade on tablets. Before this PR, touch users couldn't draw annotation boxes at all.

---

## What It Taught Me

**Event model nuances** — Mouse and touch events have different properties, different coordinate systems, different default behaviors. You can't just swap `click` for `touchstart`.

**Legacy JS refactoring** — The annotation code was old. Touch support couldn't just be bolted on; it required understanding and cleaning up existing code.

**Parallel code paths** — PDF and image annotation managers had similar but not identical code. Review feedback applied to both.

**Browser behavior debugging** — "It works in Chrome but not Safari" is a real problem with touch events. Different browsers, different quirks.

---

Mobile grading was a known pain point for years. Fixing it meant understanding code written long before I joined.
