import type { Expense } from "./interface";

interface ExpenseTableProps {
    expenses : Expense[]
    search: string
}
export default function ExpenseTable({search, expenses} : ExpenseTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {expenses.filter(expense => expense.name.toLowerCase().includes(search.toLowerCase())).map((expense, i) => 
                    <tr key={expense.id}>
                        <td>{expense.name}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.category}</td>
                        <td>{expense.date}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}