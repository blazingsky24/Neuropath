import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ userLevel, isDarkTheme, toggleTheme }) {
  const navigate = useNavigate()
  const [warning, setWarning] = useState("")

const skillTree = [
    { id: "intro", title: "Introduction & Syntax", reqLevel: 0 },
    { id: "pointers", title: "Pointers & Memory", reqLevel: 1 },
    { id: "arrays", title: "Arrays & Strings", reqLevel: 2 },
    { id: "linked_lists", title: "Linked Lists", reqLevel: 3 },
    { id: "stacks_queues", title: "Stacks & Queues", reqLevel: 4 }, 
    { id: "trees", title: "Trees & Graphs", reqLevel: 5 },          
  ]

  const handleNodeClick = (node) => {
    if (userLevel < node.reqLevel) {
      setWarning(`[SYSTEM LOCK] Prerequisite Mastery Required: Risk of logic fragmentation. (Requires Level ${node.reqLevel})`)
      setTimeout(() => setWarning(""), 3000)
    } else {
      navigate(`/focus/${node.id}`)
    }
  }

  return (
    <div className="hub-layout">
      
      <div className="top-nav">
        <h2 className="nav-title" style={{ margin: 0 }}>NEUROPATH <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>// THE HUB</span></h2>
        
        <div className="profile-area" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ margin: 0, fontSize: "0.95rem", fontFamily: "var(--font-body)" }}>Prakhar Dwivedi</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px" }}>S24CSEU1499</span>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--accent)", background: "var(--glass-border)" }}></div>
          
          {/* THE RESTORED SETTINGS GEAR */}
          <button className="logic-btn" onClick={toggleTheme} style={{ width: "35px", height: "35px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            {isDarkTheme ? "🌙" : "☀️"}
          </button>
          <button className="logic-btn" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>⚙️</button>
        </div>
      </div>

      <div className="map-container">
        <h1 className="map-title">Neural Pathway</h1>

        <div className="skill-tree">
          {skillTree.map((node, index) => {
            const isUnlocked = userLevel >= node.reqLevel;
            
            return (
              <button 
                key={index}
                className={`node-btn ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => handleNodeClick(node)}
              >
                {isUnlocked ? "🟢 " : "🔒 "} {node.title}
              </button>
            )
          })}
        </div>

        {warning !== "" && (
          <div className="crimson-warning">
            {warning}
          </div>
        )}

        <div style={{ position: "absolute", bottom: "30px", right: "30px", display: "flex", gap: "10px" }}>
          <button className="logic-btn" style={{ fontSize: "0.8rem", padding: "8px 16px", background: "transparent", color: "var(--text-main)", borderColor: "var(--glass-border)" }}>Help & Support</button>
          <button className="logic-btn" style={{ fontSize: "0.8rem", padding: "8px 16px" }}>Raise Ticket</button>
        </div>

      </div>
    </div>
  )
}

export default Dashboard