// Practice Component 3: ThemeSwitcher
// Concepts: lifting state up, props, state, conditional rendering
//
// Build a parent component (ThemeSwitcher) that owns a "theme" state
// and two children:
// - ThemeToggle: a button that switches between "light" and "dark"
// - ThemedBox: a div that changes its background/text based on the theme
//
// The key pattern: state lives in the parent, children receive it as props.

import { useState } from 'react'

// TODO(human): Implement all three components below.
// ThemeSwitcher owns the state and passes it down.
// ThemeToggle receives the current theme and an onToggle callback.
// ThemedBox receives the current theme and renders styled content.

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return <button style={{alignSelf: "center"}} onClick={onToggle}>Switch to {theme} Mode</button>
}

function ThemedBox({ theme }: { theme: string }) {
  return <div style = {{
    alignSelf: "center",
    backgroundColor: theme === "Light" ? 'white' : 'black',
    color: theme == "Light" ? 'black' : 'white'
  }}>
  
  This box should change theme when you click the button above!</div>
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("Light")

  const handleToggle = () => setTheme(theme === "Light" ? "Dark" : "Light")

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start"}}>
        <ThemeToggle theme={theme} onToggle={handleToggle} />
        <ThemedBox theme={theme} />
    </div>
  );
}
