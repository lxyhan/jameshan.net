# Ramp-Style Live Coding Interview Simulations

Rules: 50 minutes per challenge. No looking things up. Timer starts when you read the spec.

---

## Challenge 1: Master-Detail Job Board

Build a job listings page (similar to LinkedIn's jobs view).

**Requirements:**
- Fetch job listings from `https://jsonplaceholder.typicode.com/posts` (treat each post as a "job")
- Display a **list of jobs on the left** showing just the title
- Clicking a job shows its **full details on the right** (title + body)
- The selected job should be visually highlighted in the list
- Add a **search input** above the list that filters jobs by title
- Show **loading state** while fetching
- Show **error state** if fetch fails
- The layout should be a side-by-side flex layout

**Bonus (if time allows):**
- Add a "Bookmark" button on the detail view that toggles a bookmark icon on the list item
- Show a count of bookmarked jobs at the top

**File:** `JobBoard/index.tsx` — break into components as you see fit.

---

## Challenge 2: Single-Day Calendar

Build a single-day hour-by-hour calendar with events.

**Requirements:**
- Display hours from 8 AM to 6 PM as rows in a vertical layout
- Users can **add an event** by clicking on an hour slot: a form appears with title + duration (1-3 hours)
- Events render as **colored blocks** spanning their duration
- Events can be **deleted** by clicking a delete button on the event
- Events **cannot overlap** — if a slot is taken, the user can't add there
- Show event title inside the block

**Bonus (if time allows):**
- Edit an event's title by clicking on it
- Different colors for different event durations

**File:** `DayCalendar/index.tsx` — break into components as you see fit.

---

## Challenge 3: Mini Spreadsheet

Build a simplified spreadsheet with formula support.

**Requirements:**
- Render a **5x5 grid** of editable cells (columns A-E, rows 1-5)
- Each cell can hold a **number** or a **formula**
- Support the formula `=SUM(A1:A3)` — parses the range and sums those cells
- Cells display the **computed value**, but show the formula when focused/editing
- Changing a cell's value should **update any cells that reference it**
- Cell references should be case-insensitive (a1 = A1)

**Bonus (if time allows):**
- Support `=AVG(A1:A3)` for averages
- Highlight referenced cells when editing a formula

**File:** `Spreadsheet/index.tsx` — break into components as you see fit.

---

## Challenge 4: Dynamic Prop Component

Build a React component that renders differently based on its input prop.

**Requirements:**
- Takes a single prop called `input`
- If `input` is **undefined or falsy**: render a `<div>` showing a live-updating date and time, updating every second
- If `input` is an **array**: render a list of `<div>`s, each containing one element
- If `input` is **anything else**: render the value in a `<div>`
- Must be a **functional component** using hooks
- The live clock must **clean up** its interval on unmount

**Then build a demo page** that renders 4 instances of your component:
- One with no prop
- One with `input={['Apple', 'Banana', 'Cherry']}`
- One with `input={42}`
- One with `input="Hello World"`

**File:** `DynamicDisplay/index.tsx`

---

## Recommended Order

1. **Challenge 4** (warmup — 20 min) — simple but tests hooks, cleanup, conditional rendering
2. **Challenge 1** (medium — 45 min) — the most commonly reported Ramp question
3. **Challenge 2** (hard — 50 min) — confirmed Ramp live screen question
4. **Challenge 3** (hard — 50 min) — confirmed Ramp live screen question
