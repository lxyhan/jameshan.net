// Challenge 1: Master-Detail Job Board
// Time limit: 50 minutes. No looking things up.
//
// Requirements:
// - Fetch job listings from https://jsonplaceholder.typicode.com/posts (treat each post as a "job")
// - Display a list of jobs on the LEFT showing just the title
// - Clicking a job shows its full details on the RIGHT (title + body)
// - The selected job should be visually highlighted in the list
// - Add a search input above the list that filters jobs by title
// - Show loading state while fetching
// - Show error state if fetch fails
// - Side-by-side flex layout
//
// Bonus:
// - "Bookmark" button on detail view that toggles a bookmark icon on the list item
// - Show a count of bookmarked jobs at the top
//
// Break into components as you see fit. Good luck!

import { useState, useEffect } from 'react'
import type { Job } from './interface'
import JobTable from './JobTable'
import JobDetail from './JobDetail'

export default function JobBoard() {

  // State for Loading
  const [loading, setLoading] = useState(true)
  // State for Error
  const [showError, setShowError] = useState(false)
  // State for Searchbar
  const [draft, setDraft] = useState("")
  // State for visually highlighting
  const [highlighted, setHighlighted] = useState<Job | null>(null)
  // State for Listings
  const [jobs, setJobs] = useState<Job[]>([])

  // Pulls job listings from our API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=20")
      .then(res => {if (!res.ok) throw new Error("Failed to fetch"); return res.json()})
      .then(data => {setLoading(false); setJobs(data)})
      .catch(err => {setLoading(false); setShowError(true)})
  }, [])

  if (loading) { 
    return (
        <div>
          <p>Loading</p>
        </div>
      )
  } else if (showError) {
    return (
      <div>
        {showError ? "Failed to Fetch" : ""}
      </div>
    )
  }

  return (
    <div style={{width: '650px'}}>
      <div style = {{display: "flex", gap: 10}}>
          <input placeholder="Search by Job Title" style={{display: "flex", width: "300px", marginBottom: "10px"}} value={draft} onChange={(e) => setDraft(e.target.value)}></input>
      </div>
      <div style={{display: "flex", gap: "30px"}}>
        <div>
          <JobTable posts={jobs.filter(job => job.title.toLocaleLowerCase().includes(draft.toLocaleLowerCase()))} highlighted={highlighted} handleSelect={(job: Job) => setHighlighted(job)}/>
        </div>
        <div  style={{width: '350px'}}>
          <JobDetail job={highlighted}/>
        </div>
      </div>
    </div>
  );
}
