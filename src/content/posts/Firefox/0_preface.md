---
title: 'Firefox Contributions'
pubDate: '2025-11-27'
---

# Contributing to Firefox

*A series documenting my patches to Mozilla Firefox as a Privacy Engineering intern.*

---

This series covers my contributions to Firefox's privacy and security features. Each post documents a specific patch—the problem, implementation, and what I learned.

## The Patches

1. **Notification Permission Telemetry** — Instrumenting the permission prompt funnel with Glean metrics
2. **Telemetry: Revocation Events** — Adding toolbar and preferences revocation tracking
3. **SmartBlock Link Preservation** — Preserving embed content when trackers are blocked
4. **Clear Data Dialog Cleanup** — Removing legacy UI code

---

## Why Firefox?

Firefox's codebase is massive (~20 million lines), but it's also one of the most well-documented open source projects. Contributing here taught me:

- How to navigate a decades-old codebase
- Mozilla's code review culture (rigorous but supportive)
- The intersection of privacy engineering and user experience
- How telemetry informs product decisions without compromising privacy
