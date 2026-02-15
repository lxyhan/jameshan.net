// Expense Tracker — Capstone
// Read SPEC.md for requirements. You architect everything.
import React, { useState, type ChangeEvent, type ReactHTMLElement } from 'react'
import type { Expense } from './interface'
import ExpenseForm from './ExpenseForm'
import ExpenseTable from './ExpenseTable'
import SearchBar from './SearchBar'
import "./styles.css"

export default function ExpenseTracker() {
  const [newExpense, setNewExpense] = useState<Expense>({
    name: '',
    amount: 0,
    category: 'Travel',
    date: '',
    id: Date.now()
  })

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState({
    missingfield: "",
    numericalError: ""
  })
  const [submitted, setSubmitted] = useState("")
  const [search, setSearch] = useState("")

  const handleExpense = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newExpense.name || !newExpense.category || !newExpense.date) {
      setError({...error, "missingfield": "all fields must be filled out"})
      setSubmitted("")
    } else if (newExpense.amount < 0) {
      setError({...error, "missingfield": "", "numericalError": "expense must be a positive number"})
      setSubmitted("")
    } else {
      setExpenses([...expenses, {...newExpense, amount:(Number(newExpense.amount)), id:(Date.now())}])
      setSubmitted(`Submitted ${newExpense.name} Successfully billed for $${newExpense.amount} dated ${newExpense.date}`)
      setError({
        missingfield: "",
        numericalError: ""
      })
      setNewExpense({
        name: '',
        amount: 0,
        category: 'Travel',
        date: '',
        id: Date.now()
      })
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: '1rem'}}>
      <div className="expenseCard">
        <p>Dear Merchant, please submit your expenses below</p>
        <ExpenseForm
          newExpense={newExpense}
          handleExpense={handleExpense}
          handleSubmit={handleSubmit}
        />
        {error.missingfield ? <p>{error.missingfield}</p> : error.numericalError ? <p>{error.numericalError}</p> : submitted ? <p>{submitted}</p> : null}
      </div>
      <div className="expenseCard">
        <p>Search by Name</p>
        <SearchBar currentSearch={search} handleTyping={handleTyping}/>
      </div>
      <div className="expenseCard">
        <ExpenseTable expenses={expenses} search={search} />
      </div>
    </div>
  )
}
