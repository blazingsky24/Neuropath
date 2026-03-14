import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Quiz from './Quiz'
import Dashboard from './Dashboard'
import FocusRoom from './Focusroom'
import './App.css'

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [userLevel, setUserLevel] = useState(0)

  const handleLevelUp = (newLevel) => {
    if (newLevel > userLevel) {
      setUserLevel(newLevel)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/quiz" element={
            <Quiz isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          } />

          <Route path="/hub" element={
            <Dashboard userLevel={userLevel} isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
          } />

          <Route path="/focus/:topicId" element={
            <FocusRoom isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} levelUp={handleLevelUp} />
          } />

        </Routes>
      </div>
    </Router>
  )
}

export default App