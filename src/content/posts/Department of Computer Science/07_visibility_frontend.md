---
title: 'VII. MarkUs: Scheduled Visibility (Frontend)'
pubDate: '2025-11-27'
---

# Building the UI Layer

*Making the backend feature usable.*

**PR #7717**

---

## The Work

Built the entire UI for scheduled visibility:

- **Visibility control** with 3 options: Hidden, Visible, Scheduled
- **Flatpickr integration** for datetime selection
- **Section-specific visibility table** for per-section overrides
- **Responsive design** — vertical radio buttons on narrow screens
- **Controller param normalization** — ensuring consistent data from frontend
- **Frontend + controller tests**
- **i18n locale files** — English translations for all new strings
- **Documentation PR** for MarkUs Wiki

---

## The Tricky Parts

**Timing-related test flakes** — Date pickers are async. Tests that worked locally failed in CI because of timing differences. Fixed with proper `waitFor` patterns.

**Form semantics** — When "Scheduled" is selected, show the date pickers. When "Visible" is selected, hide them and clear the values. Getting these state transitions right required careful JS.

**Midnight edge cases** — "Visible until Dec 31" should mean "visible through Dec 31", not "hidden at 12:00am Dec 31". UI had to make this clear.

---

## What It Taught Me

**Frontend/backend agreement** — The frontend sends data; the backend interprets it. They must agree on semantics or you get bugs.

**Subtle UI choices break forms** — A checkbox that doesn't clear a hidden field. A date picker that doesn't reset on option change. Small things cause big confusion.

**Controller input sanitization** — Never trust frontend data. Normalize it in the controller.

**Matching existing design systems** — MarkUs has constraints. New UI must fit, not stand out.

**Debugging date pickers at 1 AM** — Sometimes that's just the job.

---

Seeing instructors finally use this feature felt surreal.
