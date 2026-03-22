import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate() 

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/quiz', { replace: true })
  }

  return (
    <div className="login-wrapper">
      <div className="login-glass">
        <h2 style={{ color: "var(--text-main)", letterSpacing: "2px", fontFamily: "var(--font-heading)" }}>SYSTEM ACCESS</h2>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
          <input 
            type="text" 
            placeholder="ID (e.g. S24CSEU1499)" 
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="login-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="logic-btn" style={{ marginTop: "10px" }}>
            AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login