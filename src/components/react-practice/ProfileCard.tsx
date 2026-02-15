// Practice Component 1: ProfileCard
// Concepts: components, JSX, className, displaying data, conditional rendering
//
// Build a profile card that displays a user's info.
// If the user is "available", show a green dot; otherwise show a red dot.

interface User {
  name: string
  role: string
  avatarUrl: string
  isAvailable: boolean
}

const defaultUser: User = {
  name: 'James Han',
  role: 'Software Engineer',
  avatarUrl: '/images/site/profile1.png',
  isAvailable: true,
}

export default function ProfileCard({ user = defaultUser }: { user?: User }) {
  return (
    <div style = {{
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }}>
      <img src={user.avatarUrl}/>
      <div style = {{ display: 'flex', gap: 10, alignItems: 'flex-start'}}>
        <h1 style={{marginBottom: 0}}>{user.name}</h1>
        <span style={{
          borderRadius: '50%',
          width: 10,
          height: 10,
          marginTop: 35,
          backgroundColor: user.isAvailable ? 'green' : 'red'
        }}></span>
      </div>
      <h3 style={{marginTop: 0}}>{user.role}</h3>
    </div>
  );
}