---
title: 'I. PythonTA'
pubDate: '2025-11-27'
---

# My Introduction to Production Codebases

*May–August 2025*

---

PythonTA taught me three things quickly:

1. **Read the codebase before writing code.**
2. **Tests aren't optional.**
3. **Small PRs get merged. Big PRs get rewritten.**

---

## Major Contributions

- Fixed test coverage gaps in `color_messages_by_type`
- Refactored `render_pep8_errors` from a giant `if`/`elif` chain into a clean dict+regex mapping
- Fixed nested-loop variable extraction bug in `AccumulationTable`
- Added CSV output formatting
- Built a CLI for the CFG module (my first serious Click CLI)
- **Modernized the entire HTML Reporter UI:**
  - New neutral color palette
  - VS Code–inspired syntax highlighting
  - Heroicons
  - Real theming system with CSS custom properties
  - Dark mode support

---

## What I Learned

- **AST manipulation & regex parsing** — Understanding how Python code is parsed and transformed
- **Designing UI for developer tools** — The HTML reporter serves thousands of students
- **Reviewing my own PRs** — Before asking for review, I learned to review my own code first
- **GitHub workflow** — From scratch to comfort with the full PR lifecycle
- **Iterative UI feedback cycles** — Design, implement, get feedback, refine
- **Clean commit messages** — Documentation that future maintainers can understand

---

PythonTA gave me the "base layer" I needed before entering MarkUs.
