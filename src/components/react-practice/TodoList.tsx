// Practice Component 2: TodoList
// Concepts: useState, events, rendering lists, conditional rendering
//
// Build a todo list where you can:
// - Type a task and add it
// - Toggle tasks as complete/incomplete
// - Display the list with .map()

import { useState } from 'react'

interface Todo {
  id: number
  text: string
  done: boolean
}

// TODO(human): Implement this component.
// You'll need:
// - State for the list of todos (Todo[])
// - State for the input text (string)
// - An addTodo handler that creates a new todo and clears the input
// - A toggleTodo handler that flips a todo's done status by id
// - JSX: an input + button for adding, and a .map() to render the list

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
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10
      }}>
        <button onClick={handleNewTodo}>Add Todo</button>
        <input placeholder='Todo Name' value = {text} onChange={(e) => setText(e.target.value)}></input>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 30,
        marginBottom: 10
      }}>
        <div>
          <h3 style={{margin: 0}}>Unfinished Tasks</h3>
          {todos.filter(todo => !todo.done).map((todo, i) => <TodoItem key={todo.id} {...todo} handleCheck={handleDone} index={i}/>)}
        </div>
        <div>
          <h3 style={{margin: 0}}>Completed Tasks</h3>
          {todos.filter(todo => todo.done).map((todo, i) => <TodoItem key={todo.id} {...todo} handleCheck={handleDone} index={i}/>)}
        </div>
      </div>
    </div>
  );
}

function TodoItem({id, text, done, handleCheck, index}: Todo & {handleCheck: (id: number) => void} & {index: number}) {
  return (
    <span style={{
      display: "flex",
      flexDirection: "row",
      gap: 3,
    }}>
      <input type="checkbox" checked={done} onChange={() => handleCheck(id)} style={{margin: 0}}></input>
      <p style={{textDecoration: done ? 'line-through' : 'none', margin: 4}}> {index + 1}. {text}</p>
    </span>
  );
}
