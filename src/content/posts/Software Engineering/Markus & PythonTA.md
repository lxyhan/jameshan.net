---
title: 'Markus & PythonTA'
pubDate: '2025-11-27'
---
# *Eight Months Across `PythonTA` & `MarkUs`*
(May–December 2025)

## **0. Preface**

`PythonTA` sits at the heart of UofT’s intro CS pipeline, running `AST` transforms, style checks, and feedback generation for thousands of students.
`MarkUs` is the production-grade `Rails`/`Postgres`/`React` platform that handles assignments, submissions, annotations, rubrics, and grading for entire departments.

After eight months in SDS, I've touched `AST`s, `Rails` associations, `SQL` functions, `i18n` strings, frontend `JS` event models, and 50+ `RSpec` files…
I now understand what *real* production engineering feels like.

This retrospective is a thank-you note as much as it is a summary.
Everything below was built under the guidance, code reviews, and (sometimes humbling) comments from **David** and the SDS team, which shaped how I write, think, and communicate as an engineer.

---

# **1. PythonTA (May–August)**

### *My introduction to production codebases*

PythonTA taught me three things quickly:

1. **Read the codebase before writing code.**
2. **Tests aren’t optional.**
3. **Small PRs get merged. Big PRs get rewritten.**

### **Major contributions**

* Fixed test coverage gaps in `color_messages_by_type`.
* Refactored `render_pep8_errors` from a giant `if`/`elif` chain into a clean dict+regex mapping.
* Fixed nested-loop variable extraction bug in `AccumulationTable`.
* Added `CSV` output formatting.
* Built a `CLI` for the `CFG` module (my first serious `Click` CLI).
* Modernized the entire HTML Reporter UI:

  * New neutral color palette
  * VS Code–inspired syntax highlighting
  * Heroicons
  * Real theming system with `CSS` custom properties
  * Dark mode support

### **What I learned**

* `AST` manipulation & regex parsing
* Designing UI for a developer toolchain
* Reviewing my own `PR`s before asking for a review
* `GitHub` workflow from scratch → comfort
* Iterative UI feedback cycles
* Writing clean commit messages and documentation

PythonTA gave me the “base layer” I needed before entering MarkUs.

---

# **2. MarkUs: The Next Four Months (Sept–Dec)**

### *Where SDS became real SDE training*

`MarkUs` is:
`Rails` + `PostgreSQL` + `React` + legacy `JS` + policy logic + academic workflows + 15-year-old assumptions.

Working here stretched every skill I thought I had.

Below are the grouped areas of work and what they taught me.

---

# **2.1 Testing & Debugging: Criteria Controller Full Coverage (#7668)**

This was my first MarkUs PR , a deep dive into controller tests.

### **Work**

* Added tests to achieve full coverage of `CriteriaController`.
* Created factories for released results.
* Cleaned up unused attributes, redundant comments.
* Adopted better patterns (`assignment.current_results`).
* Responded to multiple rounds of review.

### **What it taught me**

* `Rails` testing conventions
* How to write meaningful `RSpec` tests
* How to structure one `PR` *per* change
* How to debug tests systematically rather than randomly trying fixes

This `PR` also broke my fear of large `Rails` controllers.

---

# **2.2 Framework Maintenance: Rack Deprecation Fixes (#7675)**

### **Work**

* Updated deprecated `Rack` status symbols (`:payload_too_large` → `:content_too_large`).
* Touched ~40 files with consistent replacements.
* Updated changelog properly.

### **What it taught me**

* How to safely modify framework-level code across the codebase.
* How to review diffs that touch many files without getting overwhelmed.
* The importance of backwards compatibility and following upstream deprecation cycles.

---

# **2.3 Query Optimization: Fixing an N+1 Query (#7678)**

### **Work**

* Added `includes(:user)` to fix a 200→1 SQL query explosion.
* Improved page load time for instructors.
* Added changelog entry and tests.

### **What it taught me**

* How to spot `N+1` patterns.
* How `Rails` eager loading works.
* Why academic platforms struggle with performance under TA load.

This was my first “impactful” bug fix , instructors notice this one.

---

# **2.4 Model Architecture: Fixing Foreign Key Cascade Issues (#7681)**

*(This was my hardest early PR.)*

### **Work**

* Rewrote `Section` model associations:

  * `dependent: :destroy` for section starter file groups
  * `dependent: :restrict_with_error` for students
* Removed controller-level cleanup code (correctly moved to model).
* Added comprehensive tests for all deletion scenarios.
* Learned to rollback & reapply migrations correctly.
* Closed a long-standing GitHub issue.

### **What it taught me**

* `Rails` association semantics
* Good domain modeling
* Why controllers should *not* contain lifecycle logic
* How to design behavior that is **predictable**, **testable**, and **maintainable**

This `PR` made me feel like I could actually contribute to the core of `MarkUs`.

---

# **2.5 The Big One: Scheduled Visibility for Assessments (Backend) (#7697)**

### *The most complex feature I’ve ever built end-to-end*

Instructors wanted to schedule assignment visibility automatically (“Visible Oct 1–Dec 31”).

This required changes across:

### **Database**

* Added `visible_on` / `visible_until` to `assessments`
* Added same fields to `assessment_section_properties`
* Updated SQL `check_repo_permissions` function
* Wrote migration-friendly logic with edge case handling

### **Models**

* Rewrote `Student#visible_assessments`:

  * `AR` query cleanup
  * Proper precedence logic
  * Section overrides
  * Datetime overrides
  * Backwards compatibility

* Added validation rules:

  * `visible_on < visible_until`
  * Type checks
  * Section/global precedence rules

### **Tests**

* ~18 tests for visibility logic
* ~9 tests for authorization paths
* `DB` tests for `SQL` function
* Edge-case tests for all-time ranges, null combos, and section/global priority

### **What it taught me**

* Full-stack feature ownership
* `SQL` + `Rails` + tests touching the same logic
* How to review my own queries for correctness
* The subtlety of precedence rules in real academic workflows
* How to break a feature into 5+ PR-ready chunks while still shipping a cohesive product

This `PR` genuinely leveled up my backend engineering skills.

---

# **2.6 Frontend UI for Scheduled Visibility (#7717)**

### **Work**

* Built the entire UI layer:

  * Added a new “Visibility” control with 3 options
  * Integrated `flatpickr` for datetime selection
  * Section-specific visibility table UI
  * Responsive redesign (vertical radio buttons on narrow screens)
  * Correct controller param normalization
  * Added frontend tests + controller tests
* Fixed multiple timing-related test flakes.
* Updated `i18n` locale files.
* Built documentation `PR` for `MarkUs` Wiki.

### **What it taught me**

* How frontend and backend must agree on semantics
* How subtle UI choices can break forms
* Why controllers must sanitize inputs consistently
* How to design UI components that match an existing design system (MarkUs style constraints)
* How to debug `JS` date pickers at 1 AM

Seeing instructors finally use this feature felt surreal.

---

# **2.7 Touch Event Support for Annotations (In Progress) (#7736)**

### **Work**

* Added `touchstart` / `touchmove` / `touchend` support for:

  * PDF annotation manager
  * Image annotation manager
* Refactored mouse/touch event handling to shared helpers
* Cleaned up coordinate logic
* Switched to `addEventListener` to fix `touchmove` issues
* Reduced `JS` duplication significantly
* Added missing changelog updates

### **Impact**

For the first time, grading on:

* iPads
* Surface tablets
* Android tablets
* Touchscreen laptops

… *just works*.

This is critical as more instructors grade on tablets.

### **What it taught me**

* Event model nuances across mouse vs touch
* How legacy `JS` needs careful refactoring
* How to apply review feedback across two parallel code paths
* How to debug user interactions that depend on browser behavior

---

# **3. Beyond Code , How SDS Shaped Me**

SDS didn’t just improve my code.
It changed how I operate in every technical environment.

### **At Mozilla (Firefox Privacy Engineering)**

* Telemetry work now feels natural because SDS taught me:

  * correctness
  * incremental PRs
  * dealing with multi-layer feature logic
* Code review discipline came directly from eight months of learning how David reviews `PR`s.

### **Now joining RBC Capital Markets as a Quantitative Researcher...**

`MarkUs` and `PythonTA` taught me that the best engineers aren’t the ones who know everything , they’re the ones who ask the right questions.

* **Ask early, ask often.** David’s reviews taught me that clarifying requirements upfront saves hours of rework.
* **Learn from every code review.** Every comment is a lesson from someone who’s solved this problem before.
* **Admit when you don’t understand.** The fastest way to learn is to say “I don’t know” and ask for guidance.
* **Collaborate, don’t isolate.** The best solutions come from discussing trade-offs with peers, not coding alone.

In quantitative trading, where correctness is non-negotiable and markets move fast, this mindset of continuous learning and open communication will be critical.

### **For Anthropic @ UofT, Blueprint, and UofT AI**

Presenting SDS work every week taught me:

* How to lead technical discussions
* How to teach concepts cleanly
* How to deliver feedback kindly
* How to design slides and explanations under pressure

These habits now shape how I lead workshops, run hackathons, and mentor student developers.

---

# **4. What I’m Most Grateful For**

### **David Liu’s code reviews**

The best feedback I’ve received in my career so far.
Precise, kind, and rigorous , the kind that forces you to level up.

### **The SDS community**

Everyone here keeps the bar high but supportive.
I always felt like my work mattered.

### **The opportunity to work on systems used at university scale**

It’s rare for students to touch production code that thousands rely on.
This responsibility made me take ownership seriously.

---

# **5. Closing: Moving On, But Carrying This Forward**

This is my last semester with SDS before I go full-time into:

* Firefox engineering →
* Quantitative trading (12 months) →
* Leading Anthropic @ UofT, UofT Blueprint, UofT AI

But the habits I built here stay with me forever:

* ship small
* test thoroughly
* ask good questions
* write for humans
* treat code review as collaboration, not evaluation
* document your code openly

Thank you to everyone who made this experience possible.

I’m excited to carry this foundation into the rest of my career , and I hope future SDS students find the same growth, joy, and challenge in this codebase that I did.
