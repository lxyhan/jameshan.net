---
title: 'VI. MarkUs: Scheduled Visibility (Backend)'
pubDate: '2025-11-27'
---

# The Most Complex Feature I've Built End-to-End

*Instructors wanted to schedule assignment visibility automatically: "Visible Oct 1–Dec 31"*

**PR #7697**

---

This required changes across the entire stack.

## Database

- Added `visible_on` / `visible_until` to `assessments` table
- Added same fields to `assessment_section_properties` (per-section overrides)
- Updated SQL `check_repo_permissions` function
- Wrote migration-friendly logic with edge case handling

## Models

Rewrote `Student#visible_assessments`:

```ruby
def visible_assessments
  Assessment
    .where(is_hidden: false)
    .where(visible_on_condition)
    .where(visible_until_condition)
    .with_section_overrides(section)
end
```

Key logic:
- AR query cleanup for readability
- Proper precedence: section overrides > global settings
- Datetime range handling with null-safety
- Backwards compatibility with existing assessments

Validation rules:
- `visible_on < visible_until` (can't end before it starts)
- Type checks for datetime fields
- Section/global precedence rules

## Tests

- ~18 tests for visibility logic
- ~9 tests for authorization paths
- DB tests for SQL function
- Edge cases: all-time ranges, null combos, section/global priority

---

## What It Taught Me

**Full-stack feature ownership** — Database, models, authorization, tests—all touching the same logic.

**SQL + Rails + tests alignment** — When your SQL function, Rails scope, and tests all need to agree on behavior, you learn precision.

**Reviewing queries for correctness** — Does this query actually return what I think it does? Write tests first.

**Precedence rules in academic workflows** — "Section A sees the assignment Monday, everyone else sees it Wednesday" is a real requirement.

**Breaking features into PR-ready chunks** — This was 5+ PRs worth of work shipped as a cohesive product.

---

This PR genuinely leveled up my backend engineering skills.
