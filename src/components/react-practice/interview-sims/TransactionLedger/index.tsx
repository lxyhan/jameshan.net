// Challenge 5: Transaction Ledger
// Time limit: 35 minutes. No looking things up.
//
// Requirements:
// - Form with: description (text), amount (number), type (select: "income" or "expense")
// - Clicking "Add" appends the transaction to a list below
// - Each row shows: description, amount (green for income, red for expense), and a delete button
// - Show the running total at the top (income adds, expense subtracts)
// - Add a filter dropdown above the list: "All", "Income", "Expense"
// - Validate: description can't be empty, amount must be > 0

import { useState } from "react"

interface transaction {
  description: string,
  amount: number,
  type: string
  id: number
}

export default function TransactionLedger() {

  const [transactions, setTransactions] = useState<transaction[]>([])
  const [filterCategory, setfilterCategory] = useState<string>("All")
  const [error, setError] = useState<string>("")

  const handleSaveTransaction = (newTransaction: transaction) => {
    if (newTransaction.description == "") {
      setError("Description must not be empty")
      return
    } else if (newTransaction.amount <= 0) {
      setError("Amount must be a positive sum")
      return
    } else {
      setTransactions([...transactions, newTransaction])

    }
  }

  const handleDeleteTransaction = (id: number) => {
    const transactionToDelete = transactions.filter(item => item.id == id)[0]
    setTransactions(transactions.filter(item => item.id != id))
  }

  return (
    <div style={{display: "flex", flexDirection: "column", gap: '10px', maxWidth: "500px"}}>
        <ExpenseForm handleSaveTransaction={handleSaveTransaction}></ExpenseForm>
        <p style={{fontSize: 10, margin: "0px"}}>Error: {error}</p>
        <div style={{display: "flex", gap: "20px"}}>
          <p style={{margin: "0px"}}>Total: {transactions.reduce((sum, transaction) => transaction.type === "income" ? sum + Number(transaction.amount) : sum - Number(transaction.amount), 0)}</p>
          <p style={{margin: "0px"}}>Filter by Category</p>
          <select value={filterCategory} onChange={(e) => setfilterCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>
        <ExpenseTable transactions={transactions} filterCategory={filterCategory} handleDeleteTransaction={handleDeleteTransaction}></ExpenseTable>
    </div>
  )
}

function ExpenseTable({transactions, filterCategory, handleDeleteTransaction} : {transactions : transaction[], filterCategory : string, handleDeleteTransaction : (arg0: number) => void}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              Description
            </th>
            <th>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.filter(item => item.type === filterCategory || filterCategory === "All").map(item => (
            <tr key={item.id}>
              <td>
                {item.description}
              </td>
              <td style={{color: item.type === "Income" ? "green" : "red"}}>
                {item.amount}
              </td>
              <td>
                <button onClick={() => handleDeleteTransaction((item.id))}>Delete Expense</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}


function ExpenseForm({handleSaveTransaction} : {handleSaveTransaction : (arg0: transaction) => void}) {
  const [newTransaction, setNewTransaction] = useState<transaction>({
      description: "",
      amount: 0,
      type: "Expense",
      id: Date.now()
  })
  return (
    <div style={{display: "flex", flexDirection: "column", gap: "8px", maxWidth: "500px"}}>
      <input placeholder="Enter a description and amount below" name="description" value={newTransaction.description} onChange={(e) => setNewTransaction({...newTransaction, [e.target.name]: e.target.value})}></input>
      <input name="amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, [e.target.name]: e.target.value})}></input>
      <select name="type" value={newTransaction.type} onChange={(e) => setNewTransaction({...newTransaction, [e.target.name]: e.target.value})}>
        <option value="Expense">Expense</option>
        <option value="Income">Income</option>
      </select>
      <button onClick={() => handleSaveTransaction({...newTransaction, ["id"]: Date.now()})}>Add Expense</button>
    </div>
  )
}
