---
title: '7: Data Wrangling with JavaScript'
pubDate: '2026-02-17'
order: 7
viewId: 91
---

Thirty-minute speed drill on transforming data, the bread and butter of fintech frontends. Every exercise uses patterns you'll hit in interviews: reshaping API responses, aggregating transactions, and building lookup structures.

All exercises use TypeScript types for clarity, but the logic is pure JavaScript.

---

## 1. Reshaping Objects — Pick and Rename Fields (~3 min)

APIs rarely return data in the exact shape your UI needs. The most common transform: pick a subset of fields and rename them.

```ts
type ApiUser = {
  id: number
  first_name: string
  last_name: string
  email_address: string
  department_id: number
  is_active: boolean
}

const apiUsers: ApiUser[] = [
  { id: 1, first_name: 'Alice', last_name: 'Chen', email_address: 'alice@ramp.com', department_id: 10, is_active: true },
  { id: 2, first_name: 'Bob', last_name: 'Park', email_address: 'bob@ramp.com', department_id: 20, is_active: false },
  { id: 3, first_name: 'Carol', last_name: 'Diaz', email_address: 'carol@ramp.com', department_id: 10, is_active: true },
]
```

**Exercise:** Transform `apiUsers` into this shape — only active users, camelCase keys, full name combined:

```ts
type DisplayUser = {
  id: number
  fullName: string
  email: string
}

const displayUsers: DisplayUser[] = apiUsers
  .filter((u) => u.is_active)
  .map((u) => ({
    id: u.id,
    fullName: `${u.first_name} ${u.last_name}`,
    email: u.email_address,
  }))

// Result:
// [
//   { id: 1, fullName: 'Alice Chen', email: 'alice@ramp.com' },
//   { id: 3, fullName: 'Carol Diaz', email: 'carol@ramp.com' },
// ]
```

**Key pattern:** `.filter()` then `.map()` — filter first to avoid wasted transforms.

---

## 2. Building Lookup Maps — Array to Record (~3 min)

When you need O(1) access by ID instead of scanning an array every time. Critical for master-detail views and join-like operations.

```ts
type Department = {
  id: number
  name: string
  budget: number
}

const departments: Department[] = [
  { id: 10, name: 'Engineering', budget: 500000 },
  { id: 20, name: 'Marketing', budget: 200000 },
  { id: 30, name: 'Sales', budget: 300000 },
]
```

**Exercise:** Build a lookup map from `id` → `Department`. Two approaches:

```ts
// Approach 1: reduce
const deptMap: Record<number, Department> = departments.reduce(
  (acc, dept) => {
    acc[dept.id] = dept
    return acc
  },
  {} as Record<number, Department>
)

// Approach 2: Object.fromEntries (cleaner)
const deptMap2: Record<number, Department> = Object.fromEntries(
  departments.map((d) => [d.id, d])
)

// Usage: deptMap[10].name → 'Engineering'
```

**When to use which:** `Object.fromEntries` is cleaner for simple key-value mappings. `reduce` is better when you need to accumulate or transform while building the map.

---

## 3. Grouping — The Most Common Interview Pattern (~5 min)

Grouping is everywhere: transactions by category, users by department, events by date.

```ts
type Transaction = {
  id: string
  merchant: string
  amount: number
  category: 'software' | 'travel' | 'meals' | 'office'
  date: string
}

const transactions: Transaction[] = [
  { id: 't1', merchant: 'AWS', amount: 2400, category: 'software', date: '2026-02-01' },
  { id: 't2', merchant: 'Delta Airlines', amount: 580, category: 'travel', date: '2026-02-03' },
  { id: 't3', merchant: 'GitHub', amount: 44, category: 'software', date: '2026-02-03' },
  { id: 't4', merchant: 'Sweetgreen', amount: 18, category: 'meals', date: '2026-02-01' },
  { id: 't5', merchant: 'Staples', amount: 120, category: 'office', date: '2026-02-05' },
  { id: 't6', merchant: 'Uber Eats', amount: 32, category: 'meals', date: '2026-02-05' },
  { id: 't7', merchant: 'Vercel', amount: 20, category: 'software', date: '2026-02-01' },
  { id: 't8', merchant: 'Hilton', amount: 340, category: 'travel', date: '2026-02-05' },
]
```

**Exercise A:** Group transactions by category.

```ts
// Modern: Object.groupBy (ES2024 — supported in all modern browsers)
const byCategory: Record<string, Transaction[]> = Object.groupBy(
  transactions,
  (t) => t.category
)

// Classic: reduce (know this for interviews — not all environments have Object.groupBy)
const byCategoryReduce = transactions.reduce(
  (acc, t) => {
    const key = t.category
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  },
  {} as Record<string, Transaction[]>
)
```

**Exercise B:** Group by category AND compute the total per group.

```ts
type CategorySummary = {
  category: string
  total: number
  count: number
}

const summaries: CategorySummary[] = Object.entries(byCategory).map(
  ([category, txns]) => ({
    category,
    total: txns.reduce((sum, t) => sum + t.amount, 0),
    count: txns.length,
  })
)

// Result:
// [
//   { category: 'software', total: 2464, count: 3 },
//   { category: 'travel', total: 920, count: 2 },
//   { category: 'meals', total: 50, count: 2 },
//   { category: 'office', total: 120, count: 1 },
// ]
```

**Key pattern:** Group first, then aggregate each group. Don't try to do both in one reduce — it's harder to read and debug.

---

## 4. Joining Data from Multiple Sources (~5 min)

Real apps stitch together data from different API endpoints. This mimics a SQL JOIN.

Using the `apiUsers` and `departments` from above, plus:

```ts
type Expense = {
  id: string
  userId: number
  amount: number
  description: string
}

const expenses: Expense[] = [
  { id: 'e1', userId: 1, amount: 150, description: 'Team lunch' },
  { id: 'e2', userId: 1, amount: 2400, description: 'AWS monthly' },
  { id: 'e3', userId: 2, amount: 580, description: 'Flight to NYC' },
  { id: 'e4', userId: 3, amount: 44, description: 'GitHub copilot' },
  { id: 'e5', userId: 3, amount: 89, description: 'Office supplies' },
]
```

**Exercise:** Build an enriched expense report — each expense should include the user's full name and department name.

```ts
// Step 1: Build lookup maps
const userMap = Object.fromEntries(apiUsers.map((u) => [u.id, u]))
const deptMap3 = Object.fromEntries(departments.map((d) => [d.id, d]))

// Step 2: Enrich
type EnrichedExpense = {
  id: string
  amount: number
  description: string
  employeeName: string
  department: string
}

const enriched: EnrichedExpense[] = expenses.map((e) => {
  const user = userMap[e.userId]
  const dept = deptMap3[user.department_id]
  return {
    id: e.id,
    amount: e.amount,
    description: e.description,
    employeeName: `${user.first_name} ${user.last_name}`,
    department: dept.name,
  }
})
```

**Key pattern:** Build maps first, then join in one `.map()` pass. This is O(n) instead of O(n*m) from nested lookups.

---

## 5. Sorting and Ranking (~4 min)

Sorting by multiple criteria and adding rank/position info.

```ts
type Employee = {
  name: string
  department: string
  totalSpend: number
}

const employees: Employee[] = [
  { name: 'Alice Chen', department: 'Engineering', totalSpend: 2550 },
  { name: 'Bob Park', department: 'Marketing', totalSpend: 580 },
  { name: 'Carol Diaz', department: 'Engineering', totalSpend: 133 },
  { name: 'Dan Kim', department: 'Marketing', totalSpend: 920 },
  { name: 'Eve Liu', department: 'Engineering', totalSpend: 1800 },
]
```

**Exercise A:** Sort by department (ascending), then by totalSpend (descending) within each department.

```ts
const sorted = [...employees].sort((a, b) => {
  if (a.department !== b.department) {
    return a.department.localeCompare(b.department)
  }
  return b.totalSpend - a.totalSpend
})

// Result order:
// Engineering: Alice (2550), Eve (1800), Carol (133)
// Marketing: Dan (920), Bob (580)
```

**Exercise B:** Add a rank within each department.

```ts
type RankedEmployee = Employee & { deptRank: number }

const grouped = Object.groupBy(sorted, (e) => e.department)

const ranked: RankedEmployee[] = Object.values(grouped).flatMap((group) =>
  group.map((emp, i) => ({ ...emp, deptRank: i + 1 }))
)
```

**Key pattern:** Always spread into a new array before sorting (`[...arr].sort()`). `.sort()` mutates in place — a common source of bugs in React where you accidentally mutate state.

---

## 6. The Pipeline — Putting It All Together (~10 min)

Real interview question format: given raw API data, produce a specific output shape.

```ts
type RawTransaction = {
  id: string
  card_id: string
  merchant_name: string
  amount_cents: number
  category: string
  created_at: string // ISO date string
  status: 'posted' | 'pending' | 'declined'
}

type CardInfo = {
  id: string
  holder_name: string
  department: string
}

const rawTransactions: RawTransaction[] = [
  { id: 't1', card_id: 'c1', merchant_name: 'AWS', amount_cents: 240000, category: 'software', created_at: '2026-02-01T10:00:00Z', status: 'posted' },
  { id: 't2', card_id: 'c2', merchant_name: 'Delta', amount_cents: 58000, category: 'travel', created_at: '2026-02-01T14:00:00Z', status: 'posted' },
  { id: 't3', card_id: 'c1', merchant_name: 'GitHub', amount_cents: 4400, category: 'software', created_at: '2026-02-02T09:00:00Z', status: 'posted' },
  { id: 't4', card_id: 'c3', merchant_name: 'Sweetgreen', amount_cents: 1800, category: 'meals', created_at: '2026-02-02T12:00:00Z', status: 'declined' },
  { id: 't5', card_id: 'c1', merchant_name: 'Vercel', amount_cents: 2000, category: 'software', created_at: '2026-02-03T08:00:00Z', status: 'pending' },
  { id: 't6', card_id: 'c2', merchant_name: 'Hilton', amount_cents: 34000, category: 'travel', created_at: '2026-02-03T16:00:00Z', status: 'posted' },
  { id: 't7', card_id: 'c3', merchant_name: 'Uber Eats', amount_cents: 3200, category: 'meals', created_at: '2026-02-03T19:00:00Z', status: 'posted' },
  { id: 't8', card_id: 'c1', merchant_name: 'Datadog', amount_cents: 15000, category: 'software', created_at: '2026-02-04T11:00:00Z', status: 'posted' },
]

const cards: CardInfo[] = [
  { id: 'c1', holder_name: 'Alice Chen', department: 'Engineering' },
  { id: 'c2', holder_name: 'Bob Park', department: 'Marketing' },
  { id: 'c3', holder_name: 'Carol Diaz', department: 'Engineering' },
]
```

**The Challenge:** Build a department spending summary from the raw data.

Requirements:
1. Only include `posted` transactions
2. Convert `amount_cents` to dollars
3. Join card holder info
4. Group by department
5. For each department, produce:

```ts
type DepartmentReport = {
  department: string
  totalDollars: number
  transactionCount: number
  topMerchant: string // merchant with highest single transaction
  cardHolders: string[] // unique, sorted alphabetically
}
```

Expected output:
```ts
// [
//   {
//     department: 'Engineering',
//     totalDollars: 2594 + 32 = 2944,
//     transactionCount: 4,
//     topMerchant: 'AWS',
//     cardHolders: ['Alice Chen', 'Carol Diaz'],
//   },
//   {
//     department: 'Marketing',
//     totalDollars: 920,
//     transactionCount: 2,
//     topMerchant: 'Delta',
//     cardHolders: ['Bob Park'],
//   },
// ]
```

// TODO(human): Implement buildDepartmentReport below.
// Use the pipeline pattern: filter → enrich → group → aggregate.

```ts
function buildDepartmentReport(
  transactions: RawTransaction[],
  cards: CardInfo[]
): DepartmentReport[] {
  // TODO(human): Implement this function
  // Hint: build a card lookup map first, then pipeline through
  // filter → map (enrich + convert cents) → group by dept → aggregate each group

  const postedTransactions = transactions.filter((t) => t.status === "posted")

  const cardMap = cards.reduce((acc, card) => {
    acc[card.id] = card
    return acc
  }, {} as Record<string, CardInfo>)

  const enrichedTransactions = postedTransactions.map((t) => ({
    ...t,
    amount: t.amount_cents / 100,
    holder_name: cardMap[t.card_id].holder_name,
    department: cardMap[t.card_id].department
  }))

  const result = enrichedTransactions.reduce((acc, t) => {
    const key = t.department
    if (!acc[key]) {
      acc[key] = {
        department: key,
        totalDollars: 0,
        transactionCount: 0,
        topMerchant: '',
        cardHolders: [],
        totalDollarsOfTopMerchant: 0
      }
    }
    acc[key].totalDollars += t.amount
    acc[key].transactionCount += 1
    if (t.amount > acc[key].totalDollarsOfTopMerchant) {
        acc[key].topMerchant = t.merchant_name
        acc[key].totalDollarsOfTopMerchant = t.amount
    }
    if (!acc[key].cardHolders.includes(t.holder_name)) {
      acc[key].cardHolders.push(t.holder_name)
    }
    return acc
  }, {} as Record<string, DepartmentReport>)

  return Object.values(result)
}
```

---

## 7. Bonus Pipeline — Monthly Merchant Breakdown (~10 min)

Same drill, different shape. Closer to what you'd see in a real Ramp dashboard.

```ts
type Payment = {
  id: string
  merchant: string
  amount_cents: number
  employee_id: string
  date: string // "YYYY-MM-DD"
  approved: boolean
}

type EmployeeInfo = {
  id: string
  name: string
  team: string
}

const payments: Payment[] = [
  { id: 'p1', merchant: 'AWS', amount_cents: 120000, employee_id: 'e1', date: '2026-01-15', approved: true },
  { id: 'p2', merchant: 'Figma', amount_cents: 3000, employee_id: 'e2', date: '2026-01-20', approved: true },
  { id: 'p3', merchant: 'AWS', amount_cents: 85000, employee_id: 'e1', date: '2026-02-01', approved: true },
  { id: 'p4', merchant: 'Uber', amount_cents: 4500, employee_id: 'e3', date: '2026-02-05', approved: false },
  { id: 'p5', merchant: 'Figma', amount_cents: 3000, employee_id: 'e2', date: '2026-02-10', approved: true },
  { id: 'p6', merchant: 'AWS', amount_cents: 95000, employee_id: 'e3', date: '2026-02-12', approved: true },
  { id: 'p7', merchant: 'Slack', amount_cents: 1200, employee_id: 'e1', date: '2026-01-05', approved: true },
  { id: 'p8', merchant: 'Uber', amount_cents: 3200, employee_id: 'e2', date: '2026-01-22', approved: true },
]

const employees: EmployeeInfo[] = [
  { id: 'e1', name: 'Sarah Kim', team: 'Engineering' },
  { id: 'e2', name: 'Jake Moss', team: 'Design' },
  { id: 'e3', name: 'Priya Patel', team: 'Engineering' },
]
```

**The Challenge:** Build a per-merchant monthly spending summary.

Requirements:
1. Only include `approved` payments
2. Convert cents to dollars
3. Group by merchant
4. For each merchant, produce:

```ts
type MerchantReport = {
  merchant: string
  totalDollars: number
  paymentCount: number
  monthlyBreakdown: { month: string; amount: number }[] // sorted by month
  teams: string[] // unique teams that used this merchant, sorted
}
```

Expected output:
```ts
// [
//   {
//     merchant: 'AWS',
//     totalDollars: 3000,
//     paymentCount: 3,
//     monthlyBreakdown: [
//       { month: '2026-01', amount: 1200 },
//       { month: '2026-02', amount: 1800 },
//     ],
//     teams: ['Engineering'],
//   },
//   {
//     merchant: 'Figma',
//     totalDollars: 60,
//     paymentCount: 2,
//     monthlyBreakdown: [
//       { month: '2026-01', amount: 30 },
//       { month: '2026-02', amount: 30 },
//     ],
//     teams: ['Design'],
//   },
//   ...
// ]
```

// TODO(human): Implement buildMerchantReport below.
// Same pipeline as Exercise 6: filter → enrich → group → aggregate.
// New twist: you need a nested grouping for monthlyBreakdown.

```ts
function buildMerchantReport(
  payments: Payment[],
  employees: EmployeeInfo[]
): MerchantReport[] {
  // TODO(human): Implement this function
  // Hint: after grouping by merchant, you'll need a second reduce
  // inside the aggregation step to build monthlyBreakdown
  return []
}
```

---

## Cheat Sheet — Methods at a Glance

| Method | Use When | Returns |
|---|---|---|
| `.filter(fn)` | Remove items that don't match | New array (subset) |
| `.map(fn)` | Transform every item 1:1 | New array (same length) |
| `.reduce(fn, init)` | Accumulate into a single value | Anything |
| `.flatMap(fn)` | Map then flatten one level | New array |
| `.sort(fn)` | Order items (⚠️ mutates!) | Same array |
| `Object.fromEntries()` | Array of `[key, value]` → object | Object |
| `Object.entries()` | Object → array of `[key, value]` | Array |
| `Object.groupBy()` | Group array items by key (ES2024) | Object of arrays |
| `[...new Set(arr)]` | Deduplicate | New array |