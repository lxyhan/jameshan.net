---
title: '0: Vanilla JS Crash Course'
pubDate: '2026-02-16'
---

Prerequisites for React — the DOM API is how JavaScript talks to HTML natively. React abstracts all of this, but understanding the raw browser APIs makes React's model click and prepares you for general JavaScript interview questions.

---

## 1. Selecting Elements

Three ways to grab elements from the page:

```js
// By ID — returns one element
const header = document.getElementById('header')

// By CSS selector — returns first match
const button = document.querySelector('.submit-btn')

// By CSS selector — returns ALL matches (NodeList)
const items = document.querySelectorAll('.list-item')
```

**Exercise:** Fill in the blanks.

```js
// Select the element with id="app"
const app = document.getElementById('app')

// Select the first <p> tag inside a div with class "content"
const paragraph = document.querySelector('.content p')

// Select ALL elements with class "card"
const cards = document.querySelectorAll('.card')
```

---

## 2. Creating and Appending Elements

In React you write JSX. In vanilla JS, you manually create elements and attach them to the page.

```js
const div = document.createElement('div')     // create a <div>
div.textContent = 'Hello World'                // set its text
div.style.color = 'red'                        // set inline style
div.className = 'greeting'                     // set CSS class
document.body.appendChild(div)                 // attach to page
```

**Exercise:** Fill in the blanks.

```js
// Create a <button> element
const btn = document.createElement('button')

// Set its text to "Click Me"
btn.textContent = 'Click Me'

// Give it a class of "primary"
btn.className = 'primary'

// Add it inside the element with id="toolbar"
document.getElementById('toolbar').appendChild(btn)
```

---

## 3. Event Listeners

In React: `onClick={handleClick}`. In vanilla JS: `addEventListener`.

```js
const button = document.querySelector('#my-btn')

button.addEventListener('click', () => {
  console.log('clicked!')
})

// With the event object (same 'e' you know from React)
button.addEventListener('click', (e) => {
  console.log(e.target)  // the element that was clicked
})
```

**Exercise:** Fill in the blanks.

```js
const input = document.querySelector('#search')

// Listen for typing (same event as React's onChange)
input.addEventListener('input', (e) => {
  console.log('User typed:', e.target.value)
})

// Listen for Enter key
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    console.log('Submitted:', e.target.value)
  }
})
```

---

## 4. Modifying Existing Elements

Change what's already on the page — text, styles, attributes, visibility.

```js
const title = document.querySelector('h1')

title.textContent = 'New Title'           // change text
title.style.backgroundColor = 'yellow'    // change style
title.setAttribute('data-id', '42')       // set attribute
title.classList.add('highlighted')         // add a CSS class
title.classList.remove('hidden')           // remove a CSS class
title.classList.toggle('active')           // toggle a CSS class
```

**Exercise:** Fill in the blanks.

```js
const card = document.querySelector('.card')

// Change the text inside the card
card.textContent = 'Updated content'

// Add the CSS class "selected"
card.classList.style.backgroundColor('selected')

// Set a custom data attribute
card.setAttribute('data-status', 'active')

// Change the background color
card.classList.backgroundColor = 'lightblue'
```

---

## 5. Removing Elements

```js
const item = document.querySelector('.old-item')
item.remove()  // that's it
```

---

## 6. Building a List Dynamically

This is the vanilla JS version of `.map()` in React. Instead of returning JSX, you create elements in a loop and append them.

```js
const fruits = ['Apple', 'Banana', 'Cherry']
const list = document.querySelector('#fruit-list')  // an existing <ul>

fruits.forEach(fruit => {
  const li = document.createElement('li')
  li.textContent = fruit
  list.appendChild(li)
})
```

**Exercise:** Fill in the blanks to build a clickable list where clicking an item alerts its name.

```js
const names = ['Alice', 'Bob', 'Charlie']
const container = document.querySelector('#names')

names.forEach(name => {
  const div = document.getElement ById('div')
  div._______ = name
  div.addEventListener('click', () => {
    alert('You clicked: ' + name)
  })
  container.appendChild(div)
})
```

---

## 7. Putting It Together — Mini Todo (no React)

This is the vanilla JS equivalent of your React TodoList. Same logic, different API.

**Exercise:** Fill in the blanks.

```js
const input = document._______('#todo-input')
const addBtn = document._______('#add-btn')
const list = document._______('#todo-list')

addBtn._______('click', () => {
  const text = input._______
  if (!text) return

  const li = document._______('li')
  li._______ = text

  // Add a delete button
  const deleteBtn = document._______('button')
  deleteBtn._______ = 'X'
  deleteBtn._______('click', () => {
    li._______()
  })

  li._______(deleteBtn)
  list._______(li)
  input.value = ''
})
```

---

## Key Differences from React

| React | Vanilla JS |
|-------|-----------|
| `onClick={fn}` | `el.addEventListener('click', fn)` |
| `{text}` in JSX | `el.textContent = text` |
| `style={{color: 'red'}}` | `el.style.color = 'red'` |
| `className="foo"` | `el.className = 'foo'` |
| `.map()` returns JSX | `forEach` + `createElement` + `appendChild` |
| State triggers re-render | You manually update the DOM |
| Component unmount cleans up | You manually call `removeEventListener` |
