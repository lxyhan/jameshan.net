---
title: '2: React Practice Components'
pubDate: '2026-02-14'
---

Three components built using the Quick Start concepts. Each one combines multiple fundamentals into a working, interactive piece of UI.

---

## 1. ProfileCard

**Concepts used:** components, JSX, displaying data with `{}`, conditional rendering (ternary)

A static profile card that displays user info and uses a ternary to conditionally color an availability dot.

```tsx
interface User {
  name: string
  role: string
  avatarUrl: string
  isAvailable: boolean
}

const defaultUser: User = {
  name: 'James Han',
  role: 'Software Engineer',
  avatarUrl: '/images/site/profile1.png',
  isAvailable: true,
}

export default function ProfileCard({ user = defaultUser }: { user?: User }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }}>
      <img src={user.avatarUrl}/>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start'}}>
        <h1 style={{marginBottom: 0}}>{user.name}</h1>
        <span style={{
          borderRadius: '50%',
          width: 10,
          height: 10,
          marginTop: 35,
          backgroundColor: user.isAvailable ? 'green' : 'red'
        }}></span>
      </div>
      <h3 style={{marginTop: 0}}>{user.role}</h3>
    </div>
  );
}
```

**Key takeaway:** The component receives `user` as an optional prop with a default value. All data display uses curly braces `{}`, and the green/red dot is a single ternary — no if/else needed for simple inline conditionals.

---

## 2. TodoList

**Concepts used:** `useState` (multiple), events, controlled inputs, `.map()` for lists, component extraction, immutable state updates

An interactive todo list with add/toggle functionality and a split view between unfinished and completed tasks.

```tsx
import { useState } from 'react'

interface Todo {
  id: number
  text: string
  done: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState("")

  const handleNewTodo = () => {
    setTodos([...todos, {id: Date.now(), text: text, done: false}])
    setText('')
  }

  const handleDone = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, done: !todo.done} : todo))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <button onClick={handleNewTodo}>Add Todo</button>
        <input placeholder='Todo Name' value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 30, marginBottom: 10 }}>
        <div>
          <h3 style={{margin: 0}}>Unfinished Tasks</h3>
          {todos.filter(todo => !todo.done).map((todo, i) =>
            <TodoItem key={todo.id} {...todo} handleCheck={handleDone} index={i}/>
          )}
        </div>
        <div>
          <h3 style={{margin: 0}}>Completed Tasks</h3>
          {todos.filter(todo => todo.done).map((todo, i) =>
            <TodoItem key={todo.id} {...todo} handleCheck={handleDone} index={i}/>
          )}
        </div>
      </div>
    </div>
  );
}

function TodoItem({id, text, done, handleCheck, index}: Todo & {handleCheck: (id: number) => void} & {index: number}) {
  return (
    <span style={{ display: "flex", flexDirection: "row", gap: 3 }}>
      <input type="checkbox" checked={done} onChange={() => handleCheck(id)} style={{margin: 0}} />
      <p style={{textDecoration: done ? 'line-through' : 'none', margin: 4}}> {index + 1}. {text}</p>
    </span>
  );
}
```

**Key takeaways:**
- **Controlled input:** The `<input>` value is driven by React state (`value={text}` + `onChange`), not by the DOM. This is the standard React pattern for form inputs.
- **Immutable updates:** `handleDone` uses `.map()` to create a new array with the toggled item, rather than mutating the existing array. React needs new references to detect changes.
- **Component extraction:** `TodoItem` was pulled into its own component. The `{...todo}` spread passes all Todo properties as individual props.
- **`Date.now()` for IDs:** Avoids duplicate ID bugs that `array.length + 1` would cause after deletions.

---

## 3. ThemeSwitcher

**Concepts used:** lifting state up, props as data pipeline, `useState`, conditional styling

A parent component that owns theme state and passes it down to a toggle button and a themed display box.

```tsx
import { useState } from 'react'

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return <button style={{alignSelf: "center"}} onClick={onToggle}>Switch to {theme} Mode</button>
}

function ThemedBox({ theme }: { theme: string }) {
  return <div style={{
    alignSelf: "center",
    backgroundColor: theme === "Light" ? 'white' : 'black',
    color: theme === "Light" ? 'black' : 'white'
  }}>
    This box should change theme when you click the button above!
  </div>
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("Light")

  const handleToggle = () => setTheme(theme === "Light" ? "Dark" : "Light")

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start"}}>
      <ThemeToggle theme={theme} onToggle={handleToggle} />
      <ThemedBox theme={theme} />
    </div>
  );
}
```

**Key takeaway:** Neither `ThemeToggle` nor `ThemedBox` calls `useState` — they are **stateless** components driven entirely by props. The parent `ThemeSwitcher` is the single source of truth. This "lifting state up" pattern is how React apps share data between sibling components: move the state to their nearest common ancestor and pass it down.
