---
title: '1. MarkUs: Testing'
pubDate: '2025-11-27'
---

# Criteria Controller Full Coverage

*My first MarkUs PR—a deep dive into controller tests.*

**PR #7668**

---

## The Work

- Added tests to achieve full coverage of `CriteriaController`
- Created factories for released results
- Cleaned up unused attributes and redundant comments
- Adopted better patterns (`assignment.current_results`)
- Responded to multiple rounds of review

---

## What It Taught Me

**Rails testing conventions** — How MarkUs structures its test suite and what patterns to follow.

**Meaningful RSpec tests** — Not just "it works" but tests that document expected behavior and catch regressions.

**One PR per change** — Keep PRs focused. Mixing unrelated changes slows review and increases risk.

**Systematic debugging** — Instead of randomly trying fixes, trace the problem methodically:
1. Reproduce the failure
2. Understand the expected behavior
3. Find where the divergence occurs
4. Fix the root cause

---

This PR broke my fear of large Rails controllers. I learned to navigate them, understand their responsibilities, and test them thoroughly.
