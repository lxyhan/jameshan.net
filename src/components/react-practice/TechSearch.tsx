// Practice Component 5: TechSearch
// Concepts: search/filter pattern, derived state, controlled inputs
//
// A searchable list of technologies with category filtering.
// Two filters: a text search AND a category dropdown, both working together.

import { useState } from 'react'

interface Tech {
  id: number
  name: string
  category: string
  description: string
}

const techStack: Tech[] = [
  { id: 1, name: 'React', category: 'Frontend', description: 'UI library for building component-based interfaces' },
  { id: 2, name: 'Vue', category: 'Frontend', description: 'Progressive framework for building UIs' },
  { id: 3, name: 'Svelte', category: 'Frontend', description: 'Compiler that generates minimal framework-less code' },
  { id: 4, name: 'Node.js', category: 'Backend', description: 'JavaScript runtime built on V8 engine' },
  { id: 5, name: 'Express', category: 'Backend', description: 'Minimal web framework for Node.js' },
  { id: 6, name: 'Django', category: 'Backend', description: 'High-level Python web framework' },
  { id: 7, name: 'PostgreSQL', category: 'Database', description: 'Advanced open-source relational database' },
  { id: 8, name: 'MongoDB', category: 'Database', description: 'Document-oriented NoSQL database' },
  { id: 9, name: 'Redis', category: 'Database', description: 'In-memory data structure store' },
  { id: 10, name: 'TypeScript', category: 'Language', description: 'Typed superset of JavaScript' },
  { id: 11, name: 'Python', category: 'Language', description: 'General-purpose programming language' },
  { id: 12, name: 'Rust', category: 'Language', description: 'Systems programming language focused on safety' },
]

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Language']

// TODO(human): Implement this component.
// You need two pieces of state: search query and selected category.
// Derive the filtered list by chaining .filter() calls — one for category, one for search.
// Render a text input, a category <select> dropdown, and the filtered results.

export default function TechSearch() {
  const [category, setCategory] = useState("All")
  const [name, setName] = useState("")

  const filtered = techStack
                  .filter(t => category == "All" || t.category === category)
                  .filter(t => t.name.toLowerCase().includes(name.toLowerCase()))

  return (
    <>
      <div style={{display: "flex", gap: 10}}>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(category => <option value={category} key={category}>{category}</option>)}
          </select>
          <h3 style={{margin: 0}}>tech skills matching </h3>
          <input type="text" value={name} onChange={e => setName(e.target.value)}></input>
      </div>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>category</th>
            <th>description</th>
          </tr>
        </thead>
        <tbody>
          {
            filtered.map(t => 
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.category}</td>
                <td>{t.description}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </>
  );
}
