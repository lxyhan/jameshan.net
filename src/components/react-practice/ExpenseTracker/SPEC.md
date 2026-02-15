# Expense Tracker — Capstone Spec

You're building an expense submission tool. No starter code. You architect everything.

## Requirements

1. **Add an expense** with:
   - Merchant name (text input)
   - Amount in dollars (number input)
   - Category (dropdown: Travel, Food, Software, Office, Other)
   - Date (date input)

2. **Expense table** displays all expenses sorted by date (newest first)

3. **Search bar** filters expenses by merchant name (case-insensitive)

4. **Category filter** dropdown narrows the table (option for "All")

5. **Total** in the table footer showing the sum of all currently visible expenses

6. **Bonus:** clicking a row's delete button removes that expense (with a window.confirm)


## Constraints

- Break into **at least 3 components/files**
- You decide: file structure, component breakdown, state ownership, types
- All files go in this folder (`ExpenseTracker/`)
- Export the main component as default from `index.tsx`

## Hints (only if stuck)

- Think about what state the parent needs vs what children need
- The filtered + sorted list is derived, not stored
- The form could be its own component with local state