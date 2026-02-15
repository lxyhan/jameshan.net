// Practice Component 4: GithubRepos
// Concepts: useEffect, data fetching, loading/error states
//
// Fetch repos from the GitHub API and display them.
// Handle loading, error, and success states.

import { useState, useEffect } from 'react'

interface Repo {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  html_url: string
}

// TODO(human): Implement this component.
// Fetch from: https://api.github.com/users/lxyhan/repos?sort=stars&per_page=10
// Display each repo's name, description, and star count.
// Show "Loading..." while fetching, and an error message if it fails.

export default function GithubRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("https://api.github.com/users/lxyhan/repos?sort=stars&per_page=10")
      .then(res => {
        if (!res.ok) throw new Error("Failed to Fetch from Github")
        return res.json()

      })
      .then(repos => {
        setRepos(repos)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {loading ? (
        <p>loading</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <RepoTable repos={repos} user="lxyhan"/>
      )}
    </div>
  );
}

function RepoTable({repos, user} : {repos: Repo[], user: string}) {
  return (<table style={{}}>
    <caption>
      Github Repos for {user}
    </caption>
    <thead>
      <tr>
        <td>Name</td>
        <td>Description</td>
        <td>Star Count</td>
      </tr>
    </thead>
    <tbody>
      {repos.map(repo => 
      <tr key={repo.id}>
        <td><a href={repo.html_url}>{repo.name}</a></td>
        <td>{repo.description}</td>
        <td>{repo.stargazers_count}</td>
      </tr>
      )}
    </tbody>
  </table> )
}