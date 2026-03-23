---
title: '3: React Intermediate'
pubDate: '2026-02-14'
order: 3
---

Building on the Quick Start fundamentals, these four patterns show up constantly in real React apps — especially in frontend interviews. Each one introduces a new concept while reinforcing what you already know.

---

## 1. useEffect and Data Fetching

`useEffect` lets you run **side effects** after React renders your component. Side effects are anything that reaches outside the component: API calls, timers, DOM manipulation, subscriptions.

The signature:
```tsx
useEffect(() => {
  // effect code runs after render
  return () => {
    // optional cleanup runs before next effect or unmount
  }
}, [dependencies])
```

The **dependency array** controls when the effect re-runs:
- `[]` — run once on mount (like "componentDidMount")
- `[count]` — run whenever `count` changes
- no array — run after every render (usually a mistake)

A common pattern is fetching data on mount:

```tsx
import { useState, useEffect } from 'react'

// TODO(human): Complete this component.
// 1. Add a state variable to hold the fetched posts (start as empty array)
// 2. Add a useEffect that fetches from 'https://jsonplaceholder.typicode.com/posts'
//    - Call fetch(), chain .then(res => res.json()), then .then(data => set state)
//    - The dependency array should be [] so it only runs once on mount
// 3. Render the posts as a list — show each post's title in an <li>

interface Post {
  id: number
  title: string
  body: string
}

function PostList() {

  const [posts, setPosts] = useState([])

  useEffect (() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(posts => setPosts(posts))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        // render each post as a Post component ...
      </ul>
    </div>
  )
}
```

---

## 2. Search / Filter Pattern

This is one of the most common UI patterns: a text input that filters a list in real time. No API call needed — you filter the existing data on every render based on the search term.

The key insight: **don't store filtered results in state.** Store the full list and the search term separately, then derive the filtered list during render.

```tsx
// TODO(human): Complete this component.
// 1. Add a state variable for the search query (start as '')
// 2. Create a filteredItems variable that filters the items array
//    — use .filter() and check if item.name includes the query (case-insensitive)
// 3. Wire up the input as a controlled input with value + onChange
// 4. Render filteredItems with .map()

const items = [
  { id: 1, name: 'React', category: 'Frontend' },
  { id: 2, name: 'Node.js', category: 'Backend' },
  { id: 3, name: 'TypeScript', category: 'Language' },
  { id: 4, name: 'PostgreSQL', category: 'Database' },
  { id: 5, name: 'Next.js', category: 'Frontend' },
  { id: 6, name: 'Express', category: 'Backend' },
  { id: 7, name: 'Python', category: 'Language' },
  { id: 8, name: 'MongoDB', category: 'Database' },
]

function SearchFilter() {

  const [query, setQuery] = useState("")

  return (
    <div>
      <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}/>
      <ul>
        {items.filter(item => item.name.toLowerCase().includes(query.toLowerCase())).map(item => <p key={item.id}>{item.name}</p>)}
      </ul>
    </div>
  )
}
```

---

## 3. Forms with Multiple Inputs

When a form has multiple inputs, you can either use a separate `useState` for each, or group them into a single state object. The object approach scales better and keeps related data together.

The pattern: store form data as one object, and write a generic `handleChange` that updates the right field based on the input's `name` attribute.

```tsx
import { useState } from 'react'

// TODO(human): Complete this component.
// 1. Add a state object with fields: name, email, message (all start as '')
// 2. Write a handleChange function that reads e.target.name and e.target.value
//    and updates just that field in state using spread: { ...form, [name]: value }
// 3. Write a handleSubmit that prevents default form submission,
//    logs the form data to console, then resets the form
// 4. Wire up each input: name attribute, value from state, onChange to handleChange
// 5. The form tag needs onSubmit={handleSubmit}

function ContactForm() {

  const [data, setData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => setData({...data, [e.target.name]: e.target.value})

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input name="name" type="text" value={data.name} onChange={handleChange}/>
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" value={data.email} onChange={handleChange}/>
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" value={data.message} onChange={handleChange}/>
      </div>
      <button type="submit">Send</button>
    </form>
  )
}
```

---

## 4. Loading and Error States

Real apps need to handle three states for any async operation: **loading**, **success**, and **error**. This builds on `useEffect` and data fetching by adding state variables to track what's happening.

The pattern:
- `data` — the fetched result (starts `null`)
- `loading` — boolean (starts `true`)
- `error` — error message or `null`

Set `loading = false` in both the success and error paths.

```tsx
import { useState, useEffect } from 'react'

// TODO(human): Complete this component.
// 1. Add three state variables: users (null), loading (true), error (null)
// 2. Add a useEffect that fetches from 'https://jsonplaceholder.typicode.com/users'
//    - On success: set users and set loading to false
//    - On error: set error message and set loading to false
//    - Use .catch(err => ...) to handle the error
// 3. In the return, handle all three states:
//    - If loading, show <p>Loading...</p>
//    - If error, show <p style={{color: 'red'}}>{error}</p>
//    - Otherwise, render the users list — show each user's name and email

interface User {
  id: number
  name: string
  email: string
}

function UserDirectory() {

  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        if (!res.ok) {
          throw new Error('Data Fetch Failed')
        }
        return res.json()
      })
      .then(users => {
        setLoading(false)
        setUsers(users)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }, [])

  return (
    <div>
      <h2>User Directory</h2>
      {loading ? (
        <p>Loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        users.map(user => <p key={user.id}>{user.name}</p>)
      )
      }
    </div>
  )
}
```
