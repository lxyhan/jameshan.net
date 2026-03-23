---
title: '4: React Advanced Concepts'
pubDate: '2026-02-15'
order: 4
---

Five concepts you'll need for Ramp-style live coding challenges. Each one fills a gap from the Quick Start and Intermediate material.

---

## 1. useEffect Cleanup — Preventing Memory Leaks

When a `useEffect` sets up something ongoing (an interval, event listener, subscription), you **must** clean it up when the component unmounts. Otherwise it keeps running in the background.

The cleanup function is returned from the effect:

```tsx
useEffect(() => {
  // setup
  const id = setInterval(() => console.log('tick'), 1000)

  // cleanup — runs when component unmounts or before effect re-runs
  return () => clearInterval(id)
}, [])
```

Without cleanup:

- Intervals keep ticking after navigating away
- Event listeners pile up
- API calls complete and try to update unmounted components

```tsx
import { useState, useEffect } from 'react'

// TODO(human): Build a live clock that shows the current time, updating every second.
// 1. useState for the current Date object
// 2. useEffect with setInterval that updates the date every 1000ms
// 3. Return a cleanup function that clears the interval
// 4. Display the time using date.toLocaleTimeString()

function LiveClock() {
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <p>Current time: {date.toLocaleTimeString()}</p>
    </div>
  )
}
```

---

## 2. useRef — Mutable Values Without Re-renders

`useState` re-renders on every update. `useRef` gives you a mutable `.current` property that **persists across renders but never triggers re-renders**.

Two main uses:

- **DOM references** — directly access a DOM element (focus an input, scroll, measure)
- **Mutable bookkeeping** — store interval IDs, previous values, counters that the UI doesn't display

```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null)
inputRef.current?.focus()  // directly focus the element

// Mutable value
const timerRef = useRef<number | null>(null)
timerRef.current = setInterval(...)
clearInterval(timerRef.current)
```

The key difference from state: changing `ref.current` does nothing to the UI. No re-render.

```tsx
import { useState, useEffect, useRef } from 'react'

// TODO(human): Build a stopwatch.
// - Display shows elapsed seconds (useState — this renders)
// - Start button: setInterval that increments every second
// - Stop button: clears the interval
// - Reset button: clears interval and resets seconds to 0
// - Store the interval ID in useRef (not useState — it's bookkeeping, not UI)
//
// Also add: an input field and a "Focus" button that focuses the input using useRef.
// This demonstrates the DOM reference use case.

function Stopwatch() {

  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState("reset")
  const interval = useRef(null)
  const ref = useRef(null)
  useEffect(() => {
    if (running === "start") {
        interval.current = setInterval(() => setSeconds(s => s+1), 1000)
    } else if (running === "reset") {
        setSeconds(0)
    }
    return () => clearInterval(interval.current)
  }, [running])

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning("start")>Start</button>
      <button onClick={() => setRunning("pause")}>Stop</button>
      <button onClick={() => setRunning("reset")>Reset</button>
      <hr />
      <input ref={ref}placeholder="Type here..." />
      <button onClick={() => ref.current.focus()}>Focus Input</button>
    </div>
  )
}
```

---

## 3. Runtime Type Checking — Branching on Prop Types

TypeScript checks types at compile time, but sometimes you need to check what a value _actually is_ at runtime — especially when a prop can be multiple types.

Key tools:

- `typeof x === 'string'` — checks primitives (string, number, boolean, undefined)
- `Array.isArray(x)` — checks if something is an array (can't use `typeof` — arrays return `"object"`)
- `x === null` — null check
- `!x` — falsy check (catches undefined, null, 0, '', false)

```tsx
// TODO(human): Build a component that takes a single prop "input" (type: unknown).
// Render differently based on what it is:
// - undefined/falsy → show a live-updating clock (reuse your LiveClock logic)
// - array → render each element in its own <div>
// - anything else → render the value in a <div>
//
// Then render 4 instances to demo each case:
//   <DynamicDisplay />
//   <DynamicDisplay input={['Apple', 'Banana', 'Cherry']} />
//   <DynamicDisplay input={42} />
//   <DynamicDisplay input="Hello World" />

function DynamicDisplay({ input }: { input?: unknown }) {
  if (!input) {
    return <LiveClock />
  } else if (Array.isArray(input)) {
    return (
      <>
        {input.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </>
    )
  } else {
    return <div>{String(input)}</div>
  }
}
```

---

## 4. Editable Cells — Toggle Between Display and Edit Mode

A common pattern in interactive UIs: a cell/element that **displays** a value normally, but **switches to an input** when clicked, then saves on blur or Enter.

The pattern:

- State: `isEditing` boolean per cell
- Display mode: show the value, click to enter edit mode
- Edit mode: show an input with the value, blur/Enter to exit

```tsx
import { useState, useRef, useEffect } from 'react'

// TODO(human): Build an EditableText component.
// - Normally shows text in a <span>
// - Clicking the span switches to an <input> with the current text
// - Pressing Enter or blurring the input saves the value and switches back to display
// - Pressing Escape cancels and reverts to the original value
//
// Then build a demo: a list of 3 editable items.

function EditableText({ value, onSave }: { value: string; onSave: (val: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (!isEditing) {
    return <span onClick={() => setIsEditing(true)}>{value}</span>
  } else {
    return <input value={draft}
    onChange = {(e) => setDraft(e.target.value)}
    onKeyDown={(e) => {if (e.key === "Enter") {onSave(draft); setIsEditing(false)} else if (e.key === "Escape") {onSave(value); setIsEditing(false)}}}
    onBlur={() => {onSave(draft); setIsEditing(false)}}
    >
    </input>
  }
}

function EditableList() {
  const [items, setItems] = useState(['Buy groceries', 'Walk the dog', 'Write code'])

  const handleSave = (index: number, newValue: string) => {
    setItems(items.map((item, i) => i === index ? newValue : item))
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <EditableText value={item} onSave={(val) => handleSave(i, val)} />
        </li>
      ))}
    </ul>
  )
}
```

---

## 5. Computed Dependencies — Derived Values That Chain

Sometimes derived state depends on other derived state. In a spreadsheet, cell A3 might contain `=SUM(A1:A2)`, so changing A1 must update A3's displayed value.

The approach: **store raw values only, compute everything on render.** Don't store computed results in state — derive them.

```tsx
// The cells state stores raw input (numbers or formulas):
const [cells, setCells] = useState({
  A1: '10',
  A2: '20',
  A3: '=SUM(A1:A2)' // raw formula, not "30"
})

// At render time, resolve each cell:
function resolve(cellId: string): number {
  const raw = cells[cellId]
  if (raw.startsWith('=')) {
    return evaluateFormula(raw, cells) // parse and compute
  }
  return Number(raw) || 0
}
```

This way, changing A1 automatically updates A3's display — because React re-renders, `resolve('A3')` runs again, and the formula picks up the new A1 value. No manual dependency tracking needed.

```tsx
import { useState } from 'react'

// TODO(human): Build a mini calculator with 3 "cells":
// - Cell A: a number input
// - Cell B: a number input
// - Cell C: displays A + B (derived, not stored)
// - Cell D: displays C * 2 (derived from a derived value)
//
// This is the simplified version of the spreadsheet pattern.
// The key: C and D are NOT state. They're computed from A and B on every render.

function MiniCalc() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)

  const c = a + b
  const d = c * 2

  return (
    <div>
      <p>A: <input type="number" value={a} onChange={e => setA(Number(e.target.value))} /></p>
      <p>B: <input type="number" value={b} onChange={e => setB(Number(e.target.value))} /></p>
      <p>C (A + B): {c}</p>
      <p>D (C × 2): {d}</p>
    </div>
  )
}
```
