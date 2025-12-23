---
title: 'V. MarkUs: Model Architecture'
pubDate: '2025-11-27'
---

# Fixing Foreign Key Cascade Issues

*My hardest early PR.*

**PR #7681**

---

## The Problem

Deleting a `Section` could orphan students or leave dangling references. The controller had cleanup code that should have been in the model.

---

## The Fix

Rewrote `Section` model associations:

```ruby
class Section < ApplicationRecord
  # Delete associated starter file groups when section is deleted
  has_many :section_starter_file_groups, dependent: :destroy

  # Prevent deletion if students are still in this section
  has_many :students, dependent: :restrict_with_error
end
```

**`dependent: :destroy`** — Cascade delete for owned resources (starter file groups belong to the section)

**`dependent: :restrict_with_error`** — Prevent deletion if there are associated records (students shouldn't be orphaned)

---

## Additional Work

- Removed controller-level cleanup code (correctly moved to model)
- Added comprehensive tests for all deletion scenarios
- Learned to rollback & reapply migrations correctly
- Closed a long-standing GitHub issue

---

## What It Taught Me

**Rails association semantics** — `dependent` options have real consequences. Choose wrong and you get orphaned records or accidental deletions.

**Good domain modeling** — The model should enforce its own invariants. Controllers orchestrate; models protect data integrity.

**Controllers shouldn't contain lifecycle logic** — If you're writing cleanup code in a controller, it probably belongs in the model.

**Predictable, testable, maintainable behavior** — If you can't write a test for the deletion behavior, you don't understand it well enough.

---

This PR made me feel like I could actually contribute to the core of MarkUs.
