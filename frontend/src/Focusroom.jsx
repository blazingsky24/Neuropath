import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import mermaid from 'mermaid'
import './FocusRoom.css'

function FocusRoom({ isDarkTheme, toggleTheme, levelUp }) {
  const { topicId } = useParams()
  const navigate = useNavigate()
  
  const [isTakingQuiz, setIsTakingQuiz] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState("")

  const curriculumMap = {
    "intro": ["Syntax Basics", "Data Types", "Control Flow"],
    "pointers": ["Pointer Basics", "Dynamic Allocation", "Smart Pointers"],
    "arrays": ["1D Arrays", "2D Arrays", "String Manipulation"],
    "linked_lists": ["Singly Linked", "Doubly Linked", "Circular"],
    "stacks_queues": ["Stack Basics", "Queue Basics", "Advanced Queues"], 
    "trees": ["Binary Trees", "BST", "Heaps"]
  }

  const defaultCode = {
    "Syntax Basics": "// 1. Syntax Basics\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World\";\n    return 0;\n}",
    "Data Types": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int num = 10;\n    float pi = 3.14;\n    char letter = 'A';\n    cout << num << \" \" << pi << \" \" << letter;\n    return 0;\n}",
    "Control Flow": "#include <iostream>\nusing namespace std;\n\nint main() {\n    for(int i = 0; i < 5; i++) {\n        cout << i << \" \";\n    }\n    return 0;\n}",
    "Pointer Basics": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int val = 42;\n    int* ptr = &val;\n    cout << *ptr;\n    return 0;\n}",
    "Dynamic Allocation": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int* arr = new int[5];\n    delete[] arr;\n    return 0;\n}",
    "Smart Pointers": "#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    unique_ptr<int> ptr = make_unique<int>(100);\n    cout << *ptr;\n    return 0;\n}",
    "1D Arrays": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    cout << arr[0];\n    return 0;\n}",
    "2D Arrays": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int matrix[2][2] = {{1, 2}, {3, 4}};\n    cout << matrix[0][0];\n    return 0;\n}",
    "String Manipulation": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string str = \"NeuroPath\";\n    cout << str.length();\n    return 0;\n}",
    "Singly Linked": "#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int data;\n    Node* next;\n};\n\nint main() {\n    Node* head = new Node{1, nullptr};\n    return 0;\n}",
    "Doubly Linked": "#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int data;\n    Node* prev;\n    Node* next;\n};\n\nint main() {\n    return 0;\n}",
    "Circular": "#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int data;\n    Node* next;\n};\n\nint main() {\n    return 0;\n}",
    "Binary Trees": "#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n};\n\nint main() {\n    return 0;\n}",
    "BST": "#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n};\n\nint main() {\n    return 0;\n}",
    "Heaps": "#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    priority_queue<int> pq;\n    pq.push(10);\n    return 0;\n}",
    "Stack Basics": "#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    stack<int> s;\n    s.push(10);\n    cout << s.top();\n    return 0;\n}",
    "Queue Basics": "#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    queue<int> q;\n    q.push(10);\n    cout << q.front();\n    return 0;\n}",
    "Advanced Queues": "#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    priority_queue<int> pq;\n    pq.push(10);\n    cout << pq.top();\n    return 0;\n}"
  }

  const flowcharts = {
    "Syntax Basics": `graph TD\n    A["Start"] --> B["#include &lt;iostream&gt;"]\n    B --> C["using namespace std;"]\n    C --> D["int main()"]\n    D --> E["cout << 'Hello World';"]\n    E --> F["return 0;"]\n    F --> G["End"]`,
    "Data Types": `graph LR\n    A["Data Types"] --> B("Primitive")\n    A --> C("Derived")\n    A --> D("User-Defined")\n    B --> E["int, float, char, bool"]\n    C --> F["Array, Pointer, Reference"]\n    D --> G["Class, Struct, Enum"]`,
    "Control Flow": `graph TD\n    A["Start"] --> B{"Condition True?"}\n    B -- Yes --> C["Execute Block"]\n    C --> A\n    B -- No --> D["Exit Loop"]`,
    "Pointer Basics": `graph LR\n    A["Variable (val = 42)"] -->|Memory Address| B["Pointer (*ptr)"]\n    B -->|Dereference| C["Value (42)"]`,
    "Dynamic Allocation": `graph TD\n    A["Start"] --> B["new int[5]"]\n    B --> C{"Use Array"}\n    C --> D["delete[] arr"]\n    D --> E["Memory Freed (Heap)"]`,
    "Smart Pointers": `graph LR\n    A["Smart Pointer"] --> B("unique_ptr")\n    A --> C("shared_ptr")\n    A --> D("weak_ptr")\n    B --> E["Exclusive Ownership"]\n    C --> F["Shared Ownership (Ref Count)"]`,
    "1D Arrays": `graph LR\n    A["arr[0]"] --- B["arr[1]"] --- C["arr[2]"] --- D["arr[3]"] --- E["arr[4]"]`,
    "2D Arrays": `graph TD\n    A["Row 0"] --> B["[0][0]"] & C["[0][1]"]\n    D["Row 1"] --> E["[1][0]"] & F["[1][1]"]`,
    "String Manipulation": `graph LR\n    A["std::string"] --> B["length()"] & C["append()"] & D["substr()"]`,
    "Singly Linked": `graph LR\n    A["Head"] -->|next| B["Node 1"] -->|next| C["Node 2"] -->|next| D["nullptr"]`,
    "Doubly Linked": `graph LR\n    A["Node 1"] <-->|next & prev| B["Node 2"] <-->|next & prev| C["Node 3"]`,
    "Circular": `graph LR\n    A["Head"] --> B["Node 1"] --> C["Node 2"] --> D["Node 3"]\n    D -->|next points to Head| A`,
    "Binary Trees": `graph TD\n    A["Root"] --> B["Left Child"] & C["Right Child"]\n    B --> D["Leaf"] & E["Leaf"]`,
    "BST": `graph TD\n    A["Root (50)"] --> B["Left (&lt; 50)"] & C["Right (&gt; 50)"]\n    B --> D["30"]\n    C --> E["70"]`,
    "Heaps": `graph TD\n    A["Max Heap Root (100)"] --> B["Child (80)"] & C["Child (90)"]\n    B --> D["Leaf (40)"] & E["Leaf (50)"]`,
    "Stack Basics": `graph TD\n    A["Empty Stack"] --> B["push(10)"]\n    B --> C["push(20)"]\n    C --> D["Top: 20"]\n    D --> E["pop()"]\n    E --> F["Top: 10"]`,
    "Queue Basics": `graph LR\n    A["Back"] --> B["push(20)"] --> C["10"] --> D["Front"]\n    D --> E["pop() removes 10"]`,
    "Advanced Queues": `graph TD\n    A["push(30), push(10), push(50)"] --> B["Priority Queue"]\n    B --> C["Top is 50"]\n    C --> D["pop() removes 50"]`
  }

  const mindmaps = {
    "Syntax Basics": `mindmap\n  root((Syntax Basics))\n    Structure\n      Include\n      namespace\n      int main\n    I/O\n      cout\n      cin\n    Rules\n      Semicolons\n      Return 0`,
    "Data Types": `mindmap\n  root((Data Types))\n    Primitives\n      int\n      float\n      char\n      bool\n    Modifiers\n      unsigned\n      long\n      short`,
    "Control Flow": `mindmap\n  root((Control Flow))\n    Conditionals\n      If Else\n      switch\n    Loops\n      for\n      while\n      Do While\n    Jumps\n      break\n      continue`,
    "Pointer Basics": `mindmap\n  root((Pointers))\n    Memory Addresses\n      Address Of\n      Hexadecimal\n    Dereferencing\n      Value At\n      Accessing Data\n    Types\n      Null Pointers\n      Void Pointers`,
    "Dynamic Allocation": `mindmap\n  root((Dynamic Memory))\n    Heap vs Stack\n      Manual Lifetime\n      Larger Pool\n    Operators\n      new\n      delete\n      new array\n      delete array\n    Risks\n      Memory Leaks\n      Dangling Pointers`,
    "Smart Pointers": `mindmap\n  root((Smart Pointers))\n    Header\n      memory header\n    unique ptr\n      Exclusive Ownership\n    shared ptr\n      Reference Counting\n    weak ptr\n      Breaks Cyclic References`,
    "1D Arrays": `mindmap\n  root((1D Arrays))\n    Characteristics\n      Fixed Size\n      Contiguous Memory\n      Zero Indexed\n    Operations\n      Traversal\n      Insertion\n      Deletion`,
    "2D Arrays": `mindmap\n  root((2D Arrays))\n    Structure\n      Rows and Columns\n      Matrices\n    Memory\n      Row Major Order\n    Access\n      matrix row col`,
    "String Manipulation": `mindmap\n  root((Strings))\n    std string\n      Dynamic Size\n    Operations\n      Concatenation\n      append\n      substr\n      length\n    Search\n      find`,
    "Singly Linked": `mindmap\n  root((Singly Linked))\n    Node Structure\n      Data\n      Next Pointer\n    Key Pointers\n      Head\n      Tail\n    Operations\n      Traversal\n      Insert at Head`,
    "Doubly Linked": `mindmap\n  root((Doubly Linked))\n    Node Structure\n      Prev Pointer\n      Data\n      Next Pointer\n    Advantages\n      Bidirectional Traversal\n      Easier Deletion\n    Disadvantages\n      Extra Memory\n      Complex Updates`,
    "Circular": `mindmap\n  root((Circular List))\n    Structure\n      Tail points to Head\n      No NULL at end\n    Variations\n      Singly Circular\n      Doubly Circular\n    Use Cases\n      Round Robin Scheduling`,
    "Stack Basics": `mindmap\n  root((Stacks))\n    Concept\n      LIFO\n      Push\n      Pop\n      Peek\n    Implementations\n      Arrays\n      Linked Lists\n    Use Cases\n      Undo\n      Call Stack\n      Brackets`,
    "Queue Basics": `mindmap\n  root((Queues))\n    Concept\n      FIFO\n      Enqueue\n      Dequeue\n    Implementations\n      Arrays\n      Linked Lists\n    Use Cases\n      Spooling\n      Scheduling`,
    "Advanced Queues": `mindmap\n  root((Advanced Queues))\n    Priority Queue\n      Heaps\n      Dijkstra\n    Deque\n      Double ended\n      Insert Both\n      Remove Both`,
    "Binary Trees": `mindmap\n  root((Binary Trees))\n    Structure\n      Root\n      Left Child\n      Right Child\n      Leaves\n    Traversals\n      Inorder\n      Preorder\n      Postorder`,
    "BST": `mindmap\n  root((BST))\n    Properties\n      Left Less Than Root\n      Right Greater Than Root\n    Time Complexity\n      Search Log N\n    Balancing\n      AVL\n      Red Black`,
    "Heaps": `mindmap\n  root((Heaps))\n    Types\n      Max Heap\n      Min Heap\n    Properties\n      Complete Tree\n      Heap Order\n    Applications\n      Priority Queues\n      Heap Sort`
  }

  const moduleSubtopics = curriculumMap[topicId] || ["General Analysis"]
  const [activeSubtopic, setActiveSubtopic] = useState(moduleSubtopics[0])

  const [workspaces, setWorkspaces] = useState({
    [moduleSubtopics[0]]: {
        code: defaultCode[moduleSubtopics[0]] || "// Write C++ logic here...",
        threads: [{ id: 1, title: "Thread 1 (General)", messages: [{ role: 'ai', text: `[SYSTEM] Workspace: ${moduleSubtopics[0].toUpperCase()}\n\nReady.` }] }],
        activeThreadId: 1
    }
  })

  const currentSpace = workspaces[activeSubtopic] || { code: "// Loading...", threads: [], activeThreadId: 1 }

  const [whiteboardMode, setWhiteboardMode] = useState("code")
  const [consoleOutput, setConsoleOutput] = useState("Compiler Ready.")
  const [isCompiling, setIsCompiling] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMemoryOpen, setIsMemoryOpen] = useState(false)
  
  const [flowchartSvg, setFlowchartSvg] = useState("")
  const [mindmapSvg, setMindmapSvg] = useState("") 

  const [chatWidth, setChatWidth] = useState(450) 
  const [terminalHeight, setTerminalHeight] = useState(180)
  const [memoryWidth, setMemoryWidth] = useState(250) 
  
  const [isResizingChat, setIsResizingChat] = useState(false)
  const [isResizingTerminal, setIsResizingTerminal] = useState(false)
  const [isResizingMemory, setIsResizingMemory] = useState(false) 
  
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false) 
  const [isZenMode, setIsZenMode] = useState(false)
  const [isZenChatOpen, setIsZenChatOpen] = useState(false) 
  
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingChat && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = containerRect.right - e.clientX
        if (newWidth > 250 && newWidth < containerRect.width * 0.6) setChatWidth(newWidth)
      }
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
    const handleMouseUp = () => { setIsResizingChat(false); setIsResizingTerminal(false); setIsResizingMemory(false); document.body.style.cursor = 'default'; }
    
    if (isResizingChat || isResizingTerminal || isResizingMemory) { 
      document.addEventListener('mousemove', handleMouseMove); 
      document.addEventListener('mouseup', handleMouseUp); 
      document.body.style.userSelect = 'none'; 
    }
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); }
  }, [isResizingChat, isResizingTerminal, isResizingMemory, chatWidth, isZenMode])

  useEffect(() => {
    if (whiteboardMode !== 'flowchart' && whiteboardMode !== 'mind map') return; 

    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkTheme ? 'dark' : 'default',
      fontFamily: 'var(--font-body)',
      securityLevel: 'loose', 
    })
    
    const renderChart = async () => {
      // CLEAR PREVIOUS DIAGRAM TO PREVENT GHOSTING
      if (whiteboardMode === 'flowchart') setFlowchartSvg("")
      if (whiteboardMode === 'mind map') setMindmapSvg("")

      try {
        let chartText = "";
        if (whiteboardMode === 'flowchart') {
          chartText = flowcharts[activeSubtopic] || "graph TD\n    A[Module logic pending...]"
        } else if (whiteboardMode === 'mind map') {
          chartText = mindmaps[activeSubtopic] || "mindmap\n  root((Pending...))"
        }
        
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chartText)
        
        // CONVERT THE SVG TO A STATIC IMAGE URL
        const imageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        
        if (whiteboardMode === 'flowchart') setFlowchartSvg(imageUrl)
        if (whiteboardMode === 'mind map') setMindmapSvg(imageUrl)
        
      } catch (error) {
        console.error("Mermaid parsing error:", error)
        // CONVERT ERROR MESSAGE TO STATIC IMAGE URL TOO
        const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="50"><text x="10" y="25" fill="#e53e3e" font-family="sans-serif">Syntax Error in Diagram</text></svg>`
        const errorUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(errorSvg)}`
        
        if (whiteboardMode === 'flowchart') setFlowchartSvg(errorUrl)
        if (whiteboardMode === 'mind map') setMindmapSvg(errorUrl)
      }
    }

    renderChart()
  }, [whiteboardMode, activeSubtopic, isDarkTheme])

  const handleSubtopicChange = (newSub) => {
    if (!workspaces[newSub]) {
        setWorkspaces(prev => ({ ...prev, [newSub]: {
            code: defaultCode[newSub] || "// Code...",
            threads: [{ id: 1, title: "Thread 1", messages: [{ role: 'ai', text: `[SYSTEM] Workspace: ${newSub.toUpperCase()}` }] }],
            activeThreadId: 1
        }}))
    }
    setActiveSubtopic(newSub)
  }

  const handleCodeChange = (newCode) => setWorkspaces(prev => ({ ...prev, [activeSubtopic]: { ...prev[activeSubtopic], code: newCode } }))

  const handleNewThread = () => {
    const newId = currentSpace.threads.length + 1
    const newTitle = `Thread ${newId}`
    setWorkspaces(prev => ({
        ...prev,
        [activeSubtopic]: {
            ...prev[activeSubtopic],
            threads: [...prev[activeSubtopic].threads, { id: newId, title: newTitle, messages: [{ role: 'ai', text: `[NEW THREAD] Ready.` }] }],
            activeThreadId: newId
        }
    }))
  }

  const handleRenameThread = () => {
    const currentThread = currentSpace.threads.find(t => t.id === currentSpace.activeThreadId)
    setRenameVal(currentThread.title)
    setIsRenaming(true)
  }

  const saveThreadName = () => {
    if (renameVal.trim() !== "") {
      setWorkspaces(prev => ({
        ...prev,
        [activeSubtopic]: {
          ...prev[activeSubtopic],
          threads: prev[activeSubtopic].threads.map(t =>
            t.id === currentSpace.activeThreadId ? { ...t, title: renameVal } : t
          )
        }
      }))
    }
    setIsRenaming(false)
  }

  const handleDeleteThread = () => {
    const space = workspaces[activeSubtopic];
    if (space.threads.length <= 1) return; 

    setWorkspaces(prev => {
        const currentSpace = prev[activeSubtopic];
        const updatedThreads = currentSpace.threads.filter(t => t.id !== currentSpace.activeThreadId);
        
        return {
            ...prev,
            [activeSubtopic]: {
                ...currentSpace,
                threads: updatedThreads,
                activeThreadId: updatedThreads[0].id 
            }
        }
    });
  }

  const handleSwitchThread = (threadId) => setWorkspaces(prev => ({ ...prev, [activeSubtopic]: { ...prev[activeSubtopic], activeThreadId: threadId } }))

  const handleSend = () => {
    if (currentQuery.trim() === "") return;
    const userMsg = { role: 'user', text: currentQuery }
    setWorkspaces(prev => {
        const space = prev[activeSubtopic]
        const updatedThreads = space.threads.map(t => t.id === space.activeThreadId ? { ...t, messages: [...t.messages, userMsg] } : t)
        return { ...prev, [activeSubtopic]: { ...space, threads: updatedThreads } }
    })
    setCurrentQuery("")
    setIsTyping(true)
    setTimeout(() => {
        const aiMsg = { role: 'ai', text: `Analyzing logic...` }
        setWorkspaces(prev => {
            const space = prev[activeSubtopic]
            const updatedThreads = space.threads.map(t => t.id === space.activeThreadId ? { ...t, messages: [...t.messages, aiMsg] } : t)
            return { ...prev, [activeSubtopic]: { ...space, threads: updatedThreads } }
        })
        setIsTyping(false)
    }, 1000)
  }

  const handlePassQuiz = () => {
    const levelRewards = { "intro": 1, "pointers": 2, "arrays": 3, "linked_lists": 4, "stacks_queues": 5, "trees": 6 };
    levelUp(levelRewards[topicId] || 1); 
    navigate('/hub', { replace: true }); 
  }

  const handleRunCode = () => {
    setIsCompiling(true)
    setConsoleOutput("Compiling...")
    setTimeout(() => { setIsCompiling(false); setConsoleOutput(`[SUCCESS] Output:\nHello World\nExecution Time: 0.012s`); setIsTerminalMinimized(false); }, 1000)
  }

  const toggleZenMode = () => {
    const enteringZen = !isZenMode
    setIsZenMode(enteringZen)
    setIsZenChatOpen(false) 
    if (enteringZen) {
      setIsTerminalMinimized(true) 
    }
  }

  const activeMessages = currentSpace.threads.find(t => t.id === currentSpace.activeThreadId)?.messages || []

  const modeTabs = ['code', 'memory map', 'reading', 'video', 'flowchart', 'mind map'];

  return (
    <div className="focus-layout" style={{ position: "relative" }}>
      {isTakingQuiz && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(5px)" }}>
          <div className="focus-layout" style={{ width: "500px", height: "auto", padding: "40px", textAlign: "center", border: "1px solid var(--accent)" }}>
            <h2 style={{ color: "var(--accent)", letterSpacing: "2px" }}>MASTERY GATE</h2>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px" }}>
              <button className="logic-btn" onClick={() => setIsTakingQuiz(false)}>ABORT</button>
              <button className="logic-btn" onClick={handlePassQuiz} style={{ background: "#68d391", color: "#1a1a1a", borderColor: "#68d391" }}>PASS</button>
            </div>
          </div>
        </div>
      )}

      <div className="top-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button className="logic-btn" onClick={() => navigate('/hub')} style={{ width: "auto" }}>◀ RETURN</button>
          <h2 className="nav-title" style={{ margin: 0 }}>MODULE <span style={{ color: "var(--accent)" }}>// {topicId.toUpperCase()}</span></h2>
        </div>
        
        {isZenMode && (
          <div style={{ display: "flex", gap: "8px", flex: 1, justifyContent: "center" }}>
            {modeTabs.map(mode => (
              <button key={mode} className={`logic-btn ${whiteboardMode === mode ? 'active' : ''}`} onClick={() => setWhiteboardMode(mode)} style={{ padding: "6px 12px", fontSize: "0.75rem", textTransform: "uppercase", background: whiteboardMode === mode ? 'var(--accent)' : 'transparent', color: whiteboardMode === mode ? 'var(--bg-color)' : 'var(--text-main)', borderColor: "var(--glass-border)" }}>
                {mode}
              </button>
            ))}
          </div>
        )}

        <div className="profile-area" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button className="logic-btn" onClick={() => setIsTakingQuiz(true)} style={{ width: "auto", padding: "8px 16px", borderColor: "#68d391", color: "#68d391" }}>TEST MASTERY</button>
          <button className="logic-btn" onClick={toggleTheme} style={{ width: "35px", height: "35px", padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{isDarkTheme ? "🌙" : "☀️"}</button>
          <button className="logic-btn" style={{ width: "35px", height: "35px", padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        </div>
      </div>

      <div className="content-stage" ref={containerRef}>
        <div className="whiteboard-zone" style={{ flex: 1, minWidth: 0, position: "relative" }}>
          
          {isZenMode && (
            <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 110, display: "flex", gap: "10px", alignItems: "center" }}>
              <button 
                onClick={toggleZenMode}
                className="logic-btn"
                title="Exit Zen Mode"
                style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-color)", color: "var(--text-main)", border: "1px solid var(--glass-border)", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}
              >
                ⤡
              </button>
              
              <button 
                onClick={() => setIsZenChatOpen(!isZenChatOpen)}
                className="logic-btn"
                title="Toggle AI Interface"
                style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isZenChatOpen ? "var(--accent)" : "var(--bg-color)", color: isZenChatOpen ? "var(--bg-color)" : "var(--accent)", border: `1px solid ${isZenChatOpen ? "var(--accent)" : "var(--glass-border)"}`, boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
          )}

          {!isZenMode && (
            <div className="sticky-header-group">
              <div className="subtopic-bar">
                {moduleSubtopics.map((sub, index) => (
                  <button key={index} className={`subtopic-pill ${activeSubtopic === sub ? 'active' : ''}`} onClick={() => handleSubtopicChange(sub)}>{sub}</button>
                ))}
              </div>

              <div className="whiteboard-header">
                <div style={{ display: "flex", gap: "8px" }}>
                    {modeTabs.map(mode => (
                        <button key={mode} className={`logic-btn ${whiteboardMode === mode ? 'active' : ''}`} onClick={() => setWhiteboardMode(mode)} style={{ padding: "6px 12px", fontSize: "0.75rem", textTransform: "uppercase", background: whiteboardMode === mode ? 'var(--accent)' : 'transparent', color: whiteboardMode === mode ? 'var(--bg-color)' : 'var(--text-main)' }}>
                          {mode}
                        </button>
                    ))}
                </div>
                <button
                  className={`logic-btn ${isZenMode ? 'active' : ''}`}
                  onClick={toggleZenMode}
                  title="Enter Zen Mode"
                  style={{ padding: "6px 10px", fontSize: "1rem" }}
                >
                  ⤢
                </button>
              </div>
            </div>
          )}

          <div className="scrollable-content" style={{ padding: isZenMode ? "0" : "20px", overflowY: (whiteboardMode === 'flowchart' || whiteboardMode === 'mind map') ? 'hidden' : 'auto' }}>
            {whiteboardMode === 'code' && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
                    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                        <div style={{ flex: 1, position: "relative", border: isZenMode ? "none" : "1px solid var(--glass-border)", borderRadius: isZenMode ? "0" : "8px", overflow: "hidden" }}>
                            <Editor
                                height="100%"
                                defaultLanguage="cpp"
                                theme="vs-dark"
                                value={currentSpace.code}
                                onChange={handleCodeChange}
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
            )}

            {whiteboardMode === 'memory map' && (
                 <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: isZenMode ? "40px" : "0", color: "var(--text-main)", overflowY: "auto", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
                     <h2 style={{ color: "var(--accent)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px", borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px" }}>
                       Memory Architecture // {activeSubtopic}
                     </h2>
                     
                     <div style={{ display: "flex", flex: 1, gap: "20px" }}>
                         <div style={{ flex: 1, border: "1px solid rgba(74, 222, 128, 0.5)", borderRadius: "8px", padding: "20px", background: "rgba(74, 222, 128, 0.05)" }}>
                             <h3 style={{ color: "#4ade80", marginTop: 0, display: "flex", justifyContent: "space-between" }}>STACK <span>(Static)</span></h3>
                             <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>Auto-managed memory. LIFO structure. Stores local variables and function calls.</p>
                             <div style={{ borderBottom: "1px solid rgba(74, 222, 128, 0.3)", paddingBottom: "10px", marginTop: "15px", fontFamily: "monospace" }}>0x7ffee... main()</div>
                         </div>
                         
                         <div style={{ flex: 1, border: "1px dashed rgba(246, 173, 85, 0.5)", borderRadius: "8px", padding: "20px", background: "rgba(246, 173, 85, 0.05)" }}>
                             <h3 style={{ color: "#f6ad55", marginTop: 0, display: "flex", justifyContent: "space-between" }}>HEAP <span>(Dynamic)</span></h3>
                             <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>Manually managed memory. Requires explicit allocation (new) and deallocation (delete).</p>
                             <div style={{ borderBottom: "1px dashed rgba(246, 173, 85, 0.3)", paddingBottom: "10px", marginTop: "15px", fontFamily: "monospace", color: "var(--text-muted)" }}>[ Unallocated Space ]</div>
                         </div>
                     </div>
                 </div>
            )}

            {whiteboardMode === 'reading' && (
                <div style={{ color: "var(--text-main)", maxWidth: "800px", margin: "0 auto", padding: isZenMode ? "40px" : "0" }}>
                    <h1 style={{ color: "var(--accent)", fontSize: "2rem", marginBottom: "20px" }}>{activeSubtopic}</h1>
                    <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
                        In C++, <strong>{activeSubtopic}</strong> forms the fundamental building block of logic.
                        Unlike higher-level languages, C++ gives you direct control over memory...
                    </p>
                </div>
            )}

            {whiteboardMode === 'video' && (
                <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "80%", aspectRatio: "16/9", background: "#000", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--glass-border)" }}>
                        <span style={{ color: "var(--text-muted)" }}>▶ YouTube Embed</span>
                    </div>
                </div>
            )}

            {whiteboardMode === 'flowchart' && (
                 <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: isZenMode ? "40px" : "0", overflow: "auto" }}>
                     {flowchartSvg && <img src={flowchartSvg} alt="Flowchart" style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain" }} />}
                 </div>
            )}

            {whiteboardMode === 'mind map' && (
                 <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: isZenMode ? "40px" : "0", overflow: "auto" }}>
                     {mindmapSvg && <img src={mindmapSvg} alt="Mind Map" style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain" }} />}
                 </div>
            )}
          </div>
        </div>

        {!isZenMode && <div className="resizer-vertical" onMouseDown={() => { setIsResizingChat(true); document.body.style.cursor = 'col-resize'; }}></div>}

        {(!isZenMode || isZenChatOpen) && (
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
        )}

      </div>
    </div>
  )
}

export default FocusRoom