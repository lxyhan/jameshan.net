import { useState, type ReactEventHandler } from "react" 
import type { Expense } from "./interface"
import './styles.css'

interface ExpenseFormProps {
    newExpense: Expense,
    handleExpense: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
}

export default function ExpenseForm({newExpense, handleExpense, handleSubmit} : ExpenseFormProps) {
    
    const categories = ["Travel", "Food", "Software", "Office", "Other"]
    return (
        <form onSubmit={handleSubmit} className="expenseForm">
            <input name="name" placeholder="Enter an expense name" value={newExpense.name} onChange={handleExpense}></input>
            <input name="amount" placeholder="Enter an expense amount" value={newExpense.amount} onChange={handleExpense}></input>
            <select name="category" value={newExpense.category} onChange={handleExpense}>
                {categories.map(c=> 
                    <option key={c} value ={c}>{c}</option>
                )}
            </select>
            <input type="date" name="date" placeholder="Enter an expense" value={newExpense.date} onChange={handleExpense}></input>
            <button type="submit">Submit expenses</button>
        </form>
    )
}