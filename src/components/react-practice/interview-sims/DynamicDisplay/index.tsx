// Challenge 4: Dynamic Prop Component
// Time limit: 20 minutes. No looking things up.
//
// Requirements:
// - Takes a single prop called "input"
// - If input is undefined or falsy: render a <div> showing a live-updating date and time, updating every second
// - If input is an array: render a list of <div>s, each containing one element
// - If input is anything else: render the value in a <div>
// - Must be a functional component using hooks
// - The live clock must clean up its interval on unmount
//
// Then build a demo page that renders 4 instances:
//   <DynamicDisplay />

import { useEffect, useRef, useState } from "react"

export default function DynamicDisplayDemo() {
  return (
    <div>
      <DynamicDisplay input={false}/>
      <DynamicDisplay input={['Apple', 'Banana', 'Cherry']} />
      <DynamicDisplay input={42} />
      <DynamicDisplay input="Hello World" />
    </div>
  )
}

function DynamicDisplay({input} : {input?: any}) {

  const [date, setDate] = useState(new Date())
  const intervalId = useRef(0)

  useEffect(() => {
    if (!input) {
      intervalId.current = window.setInterval(() => setDate(new Date()), 1000)
      return () => window.clearInterval(intervalId.current)
    }
  }, [])
  
  if (!input) {
      return (
        <div>
          <p>{date.toLocaleString()}</p>
        </div>
      )
    } else if (Array.isArray(input)) {
      return (
        <div>
          {input.map(item => (
            <div>{item}</div>
          ))}
        </div>
      )
    } else {
        return <div>{input}</div>
  }
}
