import { useState } from "react"

interface Event {
    id: string,
    title: string,
    startTime: number,
    duration: number
}

export default function DayCalendar() {

    const [events, setEvents] = useState<Event[]>([])

    const handleNewEvent = (newEvent: Event) => {
        setEvents([...events, newEvent])
    }
    
    const handleDeleteEvent = (event: Event) => {
        setEvents(events.filter(e => e.id != event.id))
    }

    return (
        <div>
            <Form handleNewEvent={handleNewEvent}/>
            <Calendar handleDeleteEvent={handleDeleteEvent} events={events} />
        </div>
    )
}

function Calendar({events, handleDeleteEvent} : {events: Event[], handleDeleteEvent: (arg0: Event) => void}) {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const [editMode, setEditMode] = useState(false)
    const [selected, setSelected] = useState<Event>({
        id: new Date().toLocaleDateString(),
        title: "",
        duration: 0,
        startTime: 0
    })
    console.log(events)

    return (
        <div>
            <div>
                {editMode && <button onClick={(event) => handleDeleteEvent(selected)}>Delete Event</button>}
            </div>
            <div style={{display: "flex"}}>
                <div>
                    {hours.map(hour => (
                        <div key={hour} style={{display: "flex", gap: "8px", height: "50px"}}>
                            <p style={{margin: "0px"}}>{hour % 12}</p>
                        </div>
                    ))}
                </div>
                <div style={{position: "relative"}}>
                    {events.map(event => (
                        <div style={{
                            position: "absolute",
                            top: event.startTime * 50,
                            height: event.duration * 50,
                            backgroundColor: "blue"
                        }} key={event.id} onClick={() => {setSelected(event); setEditMode(true)}}>
                            <p style={{margin: "0px"}}>{event.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
    
}

function Form({handleNewEvent} : {handleNewEvent : (arg0: Event) => void}) {

    const [newEvent, setNewEvent] = useState<Event>({
        id: new Date().toLocaleDateString(),
        title: "",
        duration: 0,
        startTime: 0
    })

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <input value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}></input>
            <p style={{margin: "0px"}}>
                Duration
            </p>
            <input value={newEvent.duration} onChange={(e) => setNewEvent({...newEvent, duration: Number(e.target.value)})}></input>
            <p style={{margin: "0px"}}>
                StartTime
            </p>
            <input value={newEvent.startTime} onChange={(e) => setNewEvent({...newEvent, startTime: Number(e.target.value)})}></input>
            <button onClick={() => handleNewEvent({...newEvent, id: new Date().toLocaleDateString()})}>Create New Event</button>
        </div>
    )
}