import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

function CodeWorkspace({ code, onCodeChange, isZenMode, chatWidth }) {
  const [consoleOutput, setConsoleOutput] = useState("Compiler Ready.")
  const [isCompiling, setIsCompiling] = useState(false)
  const [isMemoryOpen, setIsMemoryOpen] = useState(false)
  
  const [terminalHeight, setTerminalHeight] = useState(180)
  const [memoryWidth, setMemoryWidth] = useState(250)
  
  const [isResizingTerminal, setIsResizingTerminal] = useState(false)
  const [isResizingMemory, setIsResizingMemory] = useState(false)
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false)

  // NEW: Listen for Zen Mode and auto-minimize the terminal
  useEffect(() => {
    if (isZenMode) {
      setIsTerminalMinimized(true)
    }
  }, [isZenMode])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingTerminal && !isZenMode) {
        const newHeight = window.innerHeight - e.clientY - 60
        if (newHeight > 50 && newHeight < 600) setTerminalHeight(newHeight)
      }
      if (isResizingMemory) {
        const rightOffset = isZenMode ? 0 : chatWidth
        const newMemWidth = window.innerWidth - e.clientX - rightOffset - 40 
        if (newMemWidth > 200 && newMemWidth < 600) setMemoryWidth(newMemWidth)
      }
    }
    
    const handleMouseUp = () => { 
      setIsResizingTerminal(false)
      setIsResizingMemory(false)
      document.body.style.cursor = 'default'
    }
    
    if (isResizingTerminal || isResizingMemory) { 
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    }
    
    return () => { 
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizingTerminal, isResizingMemory, isZenMode, chatWidth])

  const handleRunCode = () => {
    setIsCompiling(true)
    setConsoleOutput("Compiling...")
    setTimeout(() => { 
      setIsCompiling(false)
      setConsoleOutput(`[SUCCESS] Output:\nHello World\nExecution Time: 0.012s`)
      setIsTerminalMinimized(false)
    }, 1000)
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative", border: isZenMode ? "none" : "1px solid var(--glass-border)", borderRadius: isZenMode ? "0" : "8px", overflow: "hidden" }}>
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={onCodeChange}
            options={{ minimap: { enabled: false }, fontSize: 16, fontFamily: "'Courier New', Courier, monospace", padding: { top: 25 }, mouseWheelZoom: true }}
          />
          <button 
            onClick={() => setIsMemoryOpen(!isMemoryOpen)} 
            style={{ 
              position: "absolute", 
              bottom: isZenMode ? (isTerminalMinimized ? "80px" : "290px") : "15px", 
              right: "20px", 
              background: "rgba(0,0,0,0.8)", 
              padding: "6px 12px", 
              borderRadius: "4px", 
              fontSize: "0.75rem", 
              border: "1px solid var(--accent)", 
              color: "var(--accent)", 
              cursor: "pointer", 
              zIndex: 100,
              transition: "bottom 0.2s ease" 
            }}
          >
            {isMemoryOpen ? "❌ CLOSE VISUALIZER" : "✨ MEMORY VISUALIZER"}
          </button>
        </div>

        {isMemoryOpen && (
          <>
            <div className="resizer-vertical" onMouseDown={() => { setIsResizingMemory(true); document.body.style.cursor = 'col-resize'; }} style={{ margin: "0 5px" }}></div>
            <div className="memory-panel" style={{ width: memoryWidth, padding: "10px", borderRadius: isZenMode ? "0" : "8px", border: isZenMode ? "none" : "1px solid var(--glass-border)", borderLeft: "none" }}>
              <h4 style={{ color: "var(--accent)", margin: "0 0 10px 0", borderBottom: "1px solid #333", paddingBottom: "5px" }}>RAM Visualization</h4>
              <div style={{ flex: 1, overflowY: "auto", fontFamily: "'Courier New', monospace", fontSize: "0.8rem", color: "#ccc" }}>
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "5px" }}>STACK <span style={{color:"#4ade80", fontSize:"0.7rem"}}>0x7ffe..</span></div>
                  <div style={{ paddingLeft: "8px", borderLeft: "2px solid #4ade80", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{display:"flex", justifyContent:"space-between"}}><span>int main()</span></div>
                    <div style={{display:"flex", justifyContent:"space-between", background:"#222", padding:"2px"}}><span>int x</span><span>10</span></div>
                  </div>
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "5px" }}>HEAP <span style={{color:"#f6ad55", fontSize:"0.7rem"}}>Dynamic</span></div>
                  <div style={{ padding: "10px", border: "1px dashed #444", textAlign: "center", color: "#666" }}>[Empty]</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!isZenMode && <div className="resizer-horizontal" onMouseDown={() => { setIsResizingTerminal(true); document.body.style.cursor = 'row-resize'; }}></div>}

      <div style={{ 
        height: isTerminalMinimized ? "45px" : (isZenMode ? "250px" : terminalHeight), 
        minHeight: "45px", 
        display: "flex", 
        flexDirection: "column", 
        transition: "height 0.2s ease",
        ...(isZenMode ? {
          position: "absolute",
          bottom: "20px",
          left: "20px",
          width: "calc(100% - 40px)",
          zIndex: 100,
          backgroundColor: "var(--bg-color)", 
          borderRadius: "8px",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          padding: "10px"
        } : {})
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "5px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-main)", fontWeight: "bold", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "15px" }}>
            TERMINAL
            <button 
              onClick={() => setIsTerminalMinimized(!isTerminalMinimized)} 
              style={{ background: "var(--glass-border)", border: "1px solid var(--accent)", color: "var(--accent)", cursor: "pointer", fontSize: "0.7rem", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px" }}
            >
              {isTerminalMinimized ? "▲ EXPAND" : "▼ MINIMIZE"}
            </button>
          </span>
          <button className="logic-btn" onClick={handleRunCode} disabled={isCompiling} style={{ padding: "4px 12px", fontSize: "0.8rem", width: "auto" }}>{isCompiling ? "..." : "▶ RUN CODE"}</button>
        </div>
        {!isTerminalMinimized && (
          <div className="terminal-window" style={{ flex: 1, margin: 0, borderRadius: "4px" }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{consoleOutput}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeWorkspace