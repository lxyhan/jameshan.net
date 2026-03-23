---
title: '1: React Quick Start'
pubDate: '2026-02-14'
order: 1
---

React is a JavaScript library for building user interfaces out of composable **components**. This page covers the core concepts you'll use daily.

---

## 1. Creating and Nesting Components

A React component is a JavaScript function that returns **markup** (JSX). Components are the building blocks of any React app — a button, a sidebar, a whole page.

Key rules:
- Component names **must** start with a capital letter (HTML tags are lowercase)
- `export default` marks the main component of a file
- You nest components by using them as JSX tags: `<MyButton />`

```jsx
// 1. A Greeting component that returns an <h2> saying "Hello, React!"

function Greeting() {
  return (
    <h2>Hello, React!</h2>
  );
}

// 2. A Page component that renders a <div> containing an <h1> "My Page" and your <Greeting /> component

export default function MyApp() {
  return (
    <div>
      <h1>My Page</h1>
      <Greeting />
    </div>
  );
}

```

---

## 2. Writing Markup with JSX

JSX looks like HTML but is stricter:
- You **must** close all tags (`<br />`, `<img />`)
- A component can only return **one** root element — use `<div>` or the empty fragment `<>...</>` to wrap multiple elements

```jsx
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

---

## 3. Adding Styles

In React, you use `className` instead of HTML's `class` attribute:

```jsx
<img className="avatar" />
```

CSS rules go in a separate `.css` file as usual. The only JSX-specific thing is the attribute name.

```jsx
function Card() {
  return (
    <div className="card">
      <h3 className="card-title">React Basics</h3>
      <p>Learning components and JSX</p>
    </div>
  );
}
```

---

## 4. Displaying Data

Curly braces `{}` in JSX let you embed JavaScript expressions — variables, function calls, arithmetic, string concatenation.

They work in two places:
- **As content:** `<h1>{user.name}</h1>`
- **As attributes:** `src={user.imageUrl}`

The double-brace `style={{ }}` is just a JS object inside the JSX curly braces, not special syntax.

```jsx
const user = {
  name: 'Ada Lovelace',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Ada_Lovelace_portrait.jpg',
  imageSize: 120,
};

function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

---

## 5. Conditional Rendering

No special syntax — just use regular JavaScript:
- `if/else` for full blocks
- Ternary `? :` for inline conditions
- Logical `&&` when you only need the truthy branch

```jsx
function AuthStatus({ isLoggedIn }) {

  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <button>Log In</button>}
    </div>
  );
}
```

---

## 6. Rendering Lists

Use `array.map()` to transform data arrays into JSX elements. Each item **must** have a unique `key` prop so React can efficiently track insertions, deletions, and reorders.

```jsx
const languages = [
  { id: 1, name: 'JavaScript', year: 1995 },
  { id: 2, name: 'TypeScript', year: 2012 },
  { id: 3, name: 'Python', year: 1991 },
];

function LanguageList() {
  return (
    <ul>
      {languages.map(item => <li key={item.id}>{item.name}, {item.year}</li>)}
    </ul>
  );
}
```

---

## 7. Responding to Events and Updating the Screen (State)

**Events:** Declare a handler function and pass it (without calling it) to an event prop like `onClick`.

**State:** `useState` gives you a value and a setter. When you call the setter, React re-renders the component with the new value. Each instance of a component has its **own** independent state.

```jsx
import { useState } from 'react';

// TODO(human): Complete this Toggle component.
// It should have a boolean state (starting as false).
// Clicking the button should flip the state.
// The button text should show "ON" when true, "OFF" when false.

function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  function handleClick() {
    setIsOn(!isOn);
  }

  return (
    <button onClick={handleClick} />
    <h1>{isOn ? 'On' : 'Off'}</h1>
  );
}
```

---

## 8. Sharing Data Between Components (Lifting State Up)

When two components need to share state, **move the state up** to their closest common parent and pass it down as **props**.

The parent owns the state and the handler; children receive them as props and call them.

```jsx
import { useState } from 'react';

// TODO(human): Complete this example.
// Move the count state into App so both Counter components share it.
// Pass count and the click handler down as props.
// Counter should receive { count, onIncrement } as props and use them.

function App() {

  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(count + 1);

  return (
    <div>
      <h1>Shared Counters</h1>
      <Counter count={count} onIncrement={handleIncrement}/>
      <Counter count={count} onIncrement={handleIncrement}/>
    </div>
  );
}

function Counter({count, onIncrement}) {
  return (
    <button onClick={onIncrement}>
      {count}
    </button>
  );
}
```
