---
title: 'Private Browsing Cell Clarification'
pubDate: '2026-03-05'
order: 2
---

*Empty table cells were confusing readers. A small label fixed the ambiguity.*

**Bug 2020394** | [D286358](https://phabricator.services.mozilla.com/D286358) | Reviewer: manuel

---

## The Problem

After the [Sphinx ETP extension](/firefox/privacy-alignment/sphinx_etp_extension) shipped, we noticed a UX problem in the generated docs. When a privacy feature had no separate private browsing pref (meaning it just inherits from normal mode), the private browsing column was left blank. Readers were interpreting the empty cell as "disabled in private browsing," which is the opposite of what it meant.

---

## The Fix

Instead of leaving the cell empty, show the resolved normal mode value with a small "Inherits from Normal" note underneath. This way readers can see at a glance that the feature is still active in private browsing, it just doesn't have its own separate pref.

```python
elif normal_ifdef:
    std_pb_status = (
        f"{std_normal_status}<br/><sub><em>Inherits from Normal</em></sub>"
    )
    strict_pb_status = (
        f"{strict_normal_status}<br/><sub><em>Inherits from Normal</em></sub>"
    )
else:
    std_pb_status = (
        f"`{std_normal_val}`<br/><sub><em>Inherits from Normal</em></sub>"
    )
    strict_pb_status = (
        f"`{strict_normal_val}`<br/><sub><em>Inherits from Normal</em></sub>"
    )
```

The same pattern applied to both the main ETP table and the "Other Privacy Features" table, so there were two parallel code paths to update.

---

## What I Learned

1. **Documentation UX matters as much as product UX.** An empty cell is ambiguous. Even in auto-generated docs, you have to think about how readers will interpret every piece of the output.
2. **Small fixes often come from watching people use your work.** This bug came directly from a team member misreading the table during a meeting.
