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

---

# Intern-Level Challenges

These are calibrated to what you'd actually see in an intern live coding screen. The emphasis is on building a lot of simple functionality fast — not one hard algorithmic problem.

---

## Challenge 5: Transaction Ledger

Build a transaction history view with running balance.

**Requirements:**
- Display a form with: description (text), amount (number), type (select: "income" or "expense")
- Clicking "Add" appends the transaction to a list below
- Each transaction row shows: description, amount (green for income, red for expense), and a **delete** button
- Show the **running total** at the top (income adds, expense subtracts)
- Add a **filter dropdown** above the list: "All", "Income", "Expense"
- Validate: description can't be empty, amount must be > 0

**Time:** 35 minutes

**File:** `TransactionLedger/index.tsx`

---

## Challenge 6: User Directory with Tabs

Build a user list fetched from an API with tabbed category views.

**Requirements:**
- Fetch users from `https://jsonplaceholder.typicode.com/users`
- Show **loading** and **error** states
- Display users in **card** layout (name, email, company name)
- Add **3 tab buttons** at the top that filter by company name suffix: "LLC", "Inc", "Group" (check if `user.company.name` contains the keyword). Plus an "All" tab.
- Clicking a user card **expands** it to show additional info: phone, website, city
- Only **one card** can be expanded at a time (clicking another collapses the first)

**Time:** 40 minutes

**File:** `UserDirectory/index.tsx`

---

## Challenge 7: Multi-Step Form

Build a form wizard that collects info across 3 steps.

**Requirements:**
- **Step 1:** Name and email fields
- **Step 2:** Select a plan from 3 options (Basic $10, Pro $25, Enterprise $50) — show as clickable cards, highlight the selected one
- **Step 3:** Review page showing all selections, with a "Confirm" button
- **Back** and **Next** buttons to navigate between steps
- Show a **step indicator** (e.g., "Step 2 of 3") at the top
- **Validate** each step before allowing Next: Step 1 requires both fields filled + email has @, Step 2 requires a plan selected
- After confirming, show a success message with the summary

**Time:** 40 minutes

**File:** `MultiStepForm/index.tsx`
