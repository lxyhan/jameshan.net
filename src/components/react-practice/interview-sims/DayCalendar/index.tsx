// Challenge 2: Single-Day Calendar
// Time limit: 50 minutes. No looking things up.
//
// Requirements:
// - Display hours from 8 AM to 6 PM as rows in a vertical layout
// - Users can add an event by clicking on an hour slot: a form appears with title + duration (1-3 hours)
// - Events render as colored blocks spanning their duration
// - Events can be deleted by clicking a delete button on the event
// - Events cannot overlap — if a slot is taken, the user can't add there
// - Show event title inside the block
//
// Bonus:
// - Edit an event's title by clicking on it
// - Different colors for different event durations
//
// Break into components as you see fit. Good luck!
import { useState } from 'react'

interface Event {
  title: string,
  duration: number,
  startHour: number
}

export default function DayCalendar() {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
  const [events, SetEvents] = useState<Event[]>([])
  const [openForm, SetOpenForm] = useState(false)
  const [newEvent, setNewEvent] = useState<Event>({
    title: "untitled event",
    duration: 1,
    startHour: 0
  })
  const [startHour, setStartHour] = useState<number | null>(null)

  const handleNewEvent = (hour: number) => {
      SetOpenForm(true)
      setStartHour(hour)
  }

  const endHour = startHour ? startHour + newEvent.duration : null
  const withinEventDuration = (hour: number) => {
    const inScheduledEvents = events.find(event => hour >= event.startHour && hour < (event.startHour + event.duration))
    if (inScheduledEvents) return inScheduledEvents
  }

  const isNewEvent = (hour: number) => {
    return startHour != null && endHour != null && hour > startHour && hour < endHour
  }

  const startAMPM = startHour !=null && (startHour === 12 ? "12 PM " : startHour >= 12 ? (startHour) % 12 + " PM " : startHour + " AM ")
  const endAMPM = endHour != null && (endHour === 12 ? " 12 PM" : endHour >= 12 ? (endHour) % 12 + " PM" : endHour + " AM")

  return (
    <div style = {{display: "flex", gap: "10px"}}>
      <div style={{width: "100%"}}>
        {hours.map(hour => {
          const event = withinEventDuration(hour)
          const prevIsEvent = withinEventDuration(hour - 1) != null
          const nextIsEvent = withinEventDuration(hour + 1) != null
          
          return (
          <div 
            key={hour} 
            style={{
              borderLeft: "1px solid black",
              borderRight: "1px solid black",
              borderTop: (event && prevIsEvent) ? "1px solid transparent" : "1px solid black",
              borderBottom: (event && nextIsEvent) ? "1px solid transparent" : "1px solid black",
              backgroundColor: event ? "#cbcbcb" : "" }} 
            onClick={() => handleNewEvent(hour)}>
            {event != null && !prevIsEvent ? (
              <p style={{marginLeft: "10px"}}>{event.title}, {event.startHour} to {event.startHour + event.duration}</p>
            ) : event ? (
              <div style={{height: "30px"}}> </div>
            ) : (
              <p style={{marginLeft: "10px"}}>{hour === 12 ? "12 PM" : hour >= 12 ? (hour) % 12 + " PM" : hour + " AM"} </p>
            )}
          </div>
          )
        })}
      </div>
      <div style={{width: "100%"}}>
        {openForm ? (
          <div>
            <p>Schedule {newEvent.title} starting at {startAMPM} 
               running for {newEvent.duration} hour until {endAMPM} </p>
            <hr>
            </hr>
            <p>
              Event Title and Duration
            </p>
            <input value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}></input>
            <select value={newEvent.duration} onChange={(e) => setNewEvent({...newEvent, "duration": Number(e.target.value)})}>
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={3}>3 Hours</option>
            </select>
            <button onClick={() => SetEvents([...events, {title: newEvent.title, duration: newEvent.duration, startHour: startHour != null ? startHour : 0}])}>Schedule the Event</button>
          </div>
        ) : (
          <p>Please select a time in the Calendar to schedule an event</p>
        )
        } 
      </div>
    </div>
  )
}
