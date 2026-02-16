// Challenge 3: Mini Spreadsheet
// Time limit: 50 minutes. No looking things up.
//
// Requirements:
// - Render a 5x5 grid of editable cells (columns A-E, rows 1-5)
// - Each cell can hold a number or a formula
// - Support the formula =SUM(A1:A3) — parses the range and sums those cells
// - Cells display the computed value, but show the formula when focused/editing
// - Changing a cell's value should update any cells that reference it
// - Cell references should be case-insensitive (a1 = A1)
//
// Bonus:
// - Support =AVG(A1:A3) for averages
// - Highlight referenced cells when editing a formula
//
// Break into components as you see fit. Good luck!

import { useState } from 'react'

const dimensions = {
  width: 5,
  height: 5
}

export default function Spreadsheet() {

  const horizontalIndices = Array.from({length: dimensions.width}, (_, i) => String.fromCharCode(65 + i))
  const verticalIndices = Array.from({length: dimensions.height}, (_, i) => i + 1)
  const [data, setData] = useState(horizontalIndices.map((i) => verticalIndices.map((j) => "")))

  const handleEdit = (cell: string, newValue: string) => {
    let sum = 0;
    if (newValue.substring(0,5) === "=SUM(" && newValue[7] === ":" && newValue[10] === ")") {
      const location1 = newValue.substring(5, 7)
      const location2 = newValue.substring(8, 10)
      const col1 = location1.charCodeAt(0) - 65
      const row1 = Number(location1[1]) -1
      const col2 = location2.charCodeAt(0) - 65
      const row2 = Number(location2[1]) -1
      sum = data[col1]?.reduce((sum, value, row) => {
        if (row >= row1 && row <= row2) {
          return sum + Number(value)
        } return sum
      }, 0) ?? 0
    }
    setData(data.map((column, i) => column.map((value, j) => {
        const isTarget = String.fromCharCode(65 + i) === cell[0] && j === Number(cell[1]) - 1
        if (!isTarget) return value
        return sum !== 0 ? String(sum) : newValue
      })))
  }

  return (
    <div style={{display: "flex"}}>
      {horizontalIndices.map((i, rowIndex) => (
        <div>
          {verticalIndices.map((j, colIndex) => (
            <Cell value={data[rowIndex]?.[colIndex] ?? ""} key={i + j} location={i+j} handleEdit={handleEdit}></Cell>
          ))}
        </div>
      ))}
    </div>
  )
}

function Cell({value, location, handleEdit} : {value: any, location: string, handleEdit: (arg0: string, arg1: string) => void}) {
  const [draft, setDraft] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div style={{display: "flex", border: "1px solid", width: "50px"}}>
        <input style={{width: "42px"}} placeholder={draft} value={draft} onChange={(e) => setDraft(e.target.value)} 
        onKeyDown={(e) => {if (e.key === "Enter") {setIsEditing(false); handleEdit(location, draft)}}} onBlur={() => setIsEditing(false)}>
        </input>
      </div>
    )
  }
  return (
    <div style={{display: "flex", alignItems: "center", border: "1px solid", width: "50px", height: "22px"}} onClick={() => {setIsEditing(true); setDraft(value)}}>
      <p style={{fontSize: "12px", marginLeft: "4px", padding: "0px"}}>{value}</p>
    </div>
  )
}
