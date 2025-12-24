---
title: '3. MarkUs: Performance'
pubDate: '2025-11-27'
---

# Fixing an N+1 Query

*My first impactful bug fix—instructors notice this one.*

**PR #7678**

---

## The Problem

A page was making 200+ SQL queries when it should have made 1. Classic N+1 pattern: loading a list, then lazily loading an association for each item.

```ruby
# Before: N+1 queries
students.each do |student|
  puts student.user.name  # Each access triggers a query
end
```

---

## The Fix

```ruby
# After: 1 query with eager loading
students.includes(:user).each do |student|
  puts student.user.name  # Already loaded
end
```

Added `includes(:user)` to fix the 200→1 SQL query explosion.

---

## What It Taught Me

**Spotting N+1 patterns** — Any time you loop over records and access an association, you might have an N+1. Watch for:
- Loops in views
- Serializers that access associations
- Any `each` block touching related models

**Rails eager loading** — `includes`, `preload`, and `eager_load` each have different behaviors. Know when to use which.

**Academic platform performance** — When 50 TAs grade simultaneously, every query counts. What's fine for 10 users breaks at 100.

---

This was my first "impactful" fix. Instructors actually noticed the page load time improvement.
