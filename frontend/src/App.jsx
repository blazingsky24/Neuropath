import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import Quiz from './Quiz'
import Dashboard from './Dashboard'
import FocusRoom from './Focusroom'
import './App.css'

function App() {
  const [userLevel, setUserLevel] = useState(0)

  const handleLevelUp = (newLevel) => {
    if (newLevel > userLevel) {
      setUserLevel(newLevel)
    }
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Landing page is now the default root */}
          <Route path="/" element={<Landing />} />
          
          {/* Login moved to its own path */}
          <Route path="/login" element={<Login />} />
          
          {/* The rest stays the same */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/hub" element={<Dashboard userLevel={userLevel} />} />
          <Route path="/focus/:topicId" element={<FocusRoom levelUp={handleLevelUp} />} />
        </Routes>
      </div>
    </Router>
  ) 
}

export default App