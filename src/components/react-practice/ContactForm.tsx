// Practice Component 6: ContactForm
// Concepts: forms with multiple inputs, single state object, validation
//
// A contact form with name, email, and message fields.
// Includes basic validation: all fields required, email must contain @.
// Shows validation errors and a success message on submit.

import { useState, type ReactEventHandler } from 'react'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

// TODO(human): Implement this component.
// - Single state object for form data
// - A validate function that returns a FormErrors object (empty = valid)
// - handleChange using e.target.name pattern or explicit field names
// - handleSubmit: preventDefault, validate, show errors or success
// - Display error messages next to each field

export default function ContactForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const [error, setError] = useState({
    nameError: "",
    emailError: "",
    emailMissingAtError: "",
    messageError: ""
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const validate = () => {
      const newError = {
        nameError: !data.name ? "Name is required" : "",
        emailError: !data.email ? "Email is required" : "",
        emailMissingAtError: (data.email && !data.email.includes("@")) ? "Email needs an @ symbol" : "",
        messageError: !data.message ? "Message is required" : ""
      };
      setError(newError)
      return !Object.values(newError).some(e => e)
  }

  const handleSubmit = () => {
    if (validate()) {setSubmitted(true)}
    return error
  }

  return (
      <div>
        {submitted ? (
          <h3 style={{color: "green"}}>Form Submitted Successfully!!</h3>
        ) : (
          <div style = {{display: "flex", flexDirection: "column"}}>
            <h3>Contact Form</h3>
            <form onSubmit = {(e) => e.preventDefault()}>
              <div style = {{display: "flex", flexDirection: "column", gap: 5}}>
                <input name="name" value={data.name} placeholder="name" onChange = {handleInput}></input>
                {error.nameError && <p style={{margin:0, fontSize: 12, color: "red"}}>{error.nameError}</p>}
                <input name="email" value={data.email} placeholder="email" onChange = {handleInput}></input>
                {error.emailError && <p style={{margin:0, fontSize: 12, color: "red"}}>{error.emailError}</p>}
                {error.emailMissingAtError && <p>{error.emailMissingAtError}</p>}
                <textarea name="message" value={data.message} placeholder="message" onChange = {handleInput}></textarea>
                {error.messageError && <p style={{margin:0, fontSize: 12, color: "red"}}>{error.messageError}</p>}
              </div>
              <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>
          </div>
        )}
    </div>
  )
}
