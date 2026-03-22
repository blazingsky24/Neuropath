import { useState } from 'react'

function TerminalChat({ currentSpace, chatWidth, isZenMode, isZenChatOpen, onUpdateSpace }) {
  const [currentQuery, setCurrentQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState("")

  const handleSwitchThread = (threadId) => {
    onUpdateSpace({ ...currentSpace, activeThreadId: threadId })
  }

  const handleNewThread = () => {
    const newId = currentSpace.threads.length + 1
    const newTitle = `Thread ${newId}`
    onUpdateSpace({
      ...currentSpace,
      threads: [...currentSpace.threads, { id: newId, title: newTitle, messages: [{ role: 'ai', text: '[NEW THREAD] Ready.' }] }],
      activeThreadId: newId
    })
  }

  const handleRenameThread = () => {
    const currentThread = currentSpace.threads.find(t => t.id === currentSpace.activeThreadId)
    setRenameVal(currentThread.title)
    setIsRenaming(true)
  }

  const saveThreadName = () => {
    if (renameVal.trim() !== "") {
      onUpdateSpace({
        ...currentSpace,
        threads: currentSpace.threads.map(t =>
          t.id === currentSpace.activeThreadId ? { ...t, title: renameVal } : t
        )
      })
    }
    setIsRenaming(false)
  }

  const handleDeleteThread = () => {
    if (currentSpace.threads.length <= 1) return
    
    const updatedThreads = currentSpace.threads.filter(t => t.id !== currentSpace.activeThreadId)
    onUpdateSpace({
      ...currentSpace,
      threads: updatedThreads,
      activeThreadId: updatedThreads[0].id 
    })
  }

  const handleSend = () => {
    if (currentQuery.trim() === "") return
    
    const userMsg = { role: 'user', text: currentQuery }
    let updatedThreads = currentSpace.threads.map(t => 
      t.id === currentSpace.activeThreadId ? { ...t, messages: [...t.messages, userMsg] } : t
    )
    
    onUpdateSpace({ ...currentSpace, threads: updatedThreads })
    setCurrentQuery("")
    setIsTyping(true)
    
    setTimeout(() => {
      const aiMsg = { role: 'ai', text: 'Analyzing logic...' }
      updatedThreads = updatedThreads.map(t => 
        t.id === currentSpace.activeThreadId ? { ...t, messages: [...t.messages, aiMsg] } : t
      )
      onUpdateSpace({ ...currentSpace, threads: updatedThreads })
      setIsTyping(false)
    }, 1000)
  }

  const activeMessages = currentSpace.threads.find(t => t.id === currentSpace.activeThreadId)?.messages || []

  if (isZenMode && !isZenChatOpen) return null

  return (
    <div 
      className={!isZenMode ? "chat-zone" : ""}
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        overflow: "hidden",
        ...(isZenMode ? {
          position: "absolute",
          top: "80px",
          right: "20px",
          bottom: "20px", 
          zIndex: 105,
          width: "350px",
          borderRadius: "8px",
          backgroundColor: "var(--bg-color)", 
          border: "1px solid var(--glass-border)",
          boxShadow: "-10px 10px 30px rgba(0,0,0,0.8)"
        } : {
          width: chatWidth, 
          minWidth: "250px"
        })
      }}
    >
      <div className="chat-header" style={{ backgroundColor: "var(--bg-color)", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", padding: "15px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1 }}>
            {isRenaming ? (
              <>
                <input type="text" value={renameVal} onChange={(e) => setRenameVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveThreadName()} onBlur={() => setTimeout(saveThreadName, 150)} autoFocus style={{ backgroundColor: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--accent)", padding: "4px 8px", borderRadius: "4px", outline: "none", fontSize: "0.8rem", flex: 1, maxWidth: "150px" }} />
                <button onClick={saveThreadName} style={{ background: "none", border: "none", cursor: "pointer", color: "#68d391", padding: "0 5px" }} title="Save">✔</button>
              </>
            ) : (
              <>
                <select value={currentSpace.activeThreadId} onChange={(e) => handleSwitchThread(Number(e.target.value))} style={{ backgroundColor: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--glass-border)", padding: "4px", borderRadius: "4px", outline: "none", fontSize: "0.8rem", maxWidth: "150px" }}>
                  {currentSpace.threads.map(t => <option key={t.id} value={t.id} style={{ backgroundColor: "var(--bg-color)" }}>{t.title}</option>)}
                </select>
                <button onClick={handleRenameThread} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0 5px" }} title="Rename Thread">✎</button>
                <button onClick={handleDeleteThread} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", padding: "0 5px", fontSize: "1rem" }} title="Delete Thread">🗑</button>
              </>
            )}
        </div>
        <button className="logic-btn" onClick={handleNewThread} style={{ padding: "6px 12px", fontSize: "0.75rem", width: "auto" }}>+ NEW</button>
      </div>
      
      <div className="chat-history" style={{ backgroundColor: "var(--bg-color)", flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
        {activeMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === 'ai' ? 'ai-message' : 'user-message'}`} style={{ whiteSpace: "pre-wrap", color: "var(--text-main)" }}>{msg.text}</div>
        ))}
        {isTyping && <div className="message ai-message" style={{ color: "var(--text-main)" }}>...</div>}
      </div>
      
      <div className="chat-input-area" style={{ backgroundColor: "var(--bg-color)", padding: "15px", borderTop: "1px solid var(--glass-border)", display: "flex", gap: "10px", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
        <input type="text" placeholder="Ask AI..." value={currentQuery} onChange={(e) => setCurrentQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} style={{ backgroundColor: "var(--bg-color)", color: "var(--text-main)", flex: 1, border: "1px solid var(--glass-border)", padding: "12px", borderRadius: "4px", outline: "none" }} />
        <button className="logic-btn" onClick={handleSend} style={{ width: "auto" }}>SEND</button>
      </div>
    </div>
  )
}

export default TerminalChat