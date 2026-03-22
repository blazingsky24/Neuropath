import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import mermaid from 'mermaid'
import TerminalChat from './components/TerminalChat'
import CodeWorkspace from './components/CodeWorkspace'
import './FocusRoom.css'

function FocusRoom({ levelUp }) {
  const { topicId } = useParams()
  const navigate = useNavigate()
  
  const [isTakingQuiz, setIsTakingQuiz] = useState(false)

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
  
  const [flowchartSvg, setFlowchartSvg] = useState("")
  const [mindmapSvg, setMindmapSvg] = useState("") 

  const [chatWidth, setChatWidth] = useState(450) 
  const [isResizingChat, setIsResizingChat] = useState(false)
  
  const [isZenMode, setIsZenMode] = useState(false)
  const [isZenChatOpen, setIsZenChatOpen] = useState(false) 
  
  const containerRef = useRef(null)

  // Only the Chat Resize logic remains here
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingChat && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = containerRect.right - e.clientX
        if (newWidth > 250 && newWidth < containerRect.width * 0.6) setChatWidth(newWidth)
      }
    }
    const handleMouseUp = () => { setIsResizingChat(false); document.body.style.cursor = 'default'; }
    
    if (isResizingChat) { 
      document.addEventListener('mousemove', handleMouseMove); 
      document.addEventListener('mouseup', handleMouseUp); 
      document.body.style.userSelect = 'none'; 
    }
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); }
  }, [isResizingChat, chatWidth])

  useEffect(() => {
    if (whiteboardMode !== 'flowchart' && whiteboardMode !== 'mind map') return; 

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      fontFamily: 'var(--font-body)',
      securityLevel: 'loose', 
    })
    
    const renderChart = async () => {
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
        const imageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        
        if (whiteboardMode === 'flowchart') setFlowchartSvg(imageUrl)
        if (whiteboardMode === 'mind map') setMindmapSvg(imageUrl)
        
      } catch (error) {
        console.error("Mermaid parsing error:", error)
        const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="50"><text x="10" y="25" fill="#e53e3e" font-family="sans-serif">Syntax Error in Diagram</text></svg>`
        const errorUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(errorSvg)}`
        
        if (whiteboardMode === 'flowchart') setFlowchartSvg(errorUrl)
        if (whiteboardMode === 'mind map') setMindmapSvg(errorUrl)
      }
    }

    renderChart()
  }, [whiteboardMode, activeSubtopic])

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

  const handleUpdateSpace = (updatedSpace) => {
    setWorkspaces(prev => ({
      ...prev,
      [activeSubtopic]: updatedSpace
    }))
  }

  const handlePassQuiz = () => {
    const levelRewards = { "intro": 1, "pointers": 2, "arrays": 3, "linked_lists": 4, "stacks_queues": 5, "trees": 6 };
    levelUp(levelRewards[topicId] || 1); 
    navigate('/hub', { replace: true }); 
  }

  const toggleZenMode = () => {
    const enteringZen = !isZenMode
    setIsZenMode(enteringZen)
    setIsZenChatOpen(false) 
  }

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
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--accent)", background: "var(--glass-border)" }}></div>
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
            
            {/* THE NEW MODULAR CODE WORKSPACE COMPONENT */}
            {whiteboardMode === 'code' && (
                <CodeWorkspace
                    code={currentSpace.code}
                    onCodeChange={handleCodeChange}
                    isZenMode={isZenMode}
                    chatWidth={chatWidth}
                />
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
          <TerminalChat
            currentSpace={currentSpace}
            chatWidth={chatWidth}
            isZenMode={isZenMode}
            isZenChatOpen={isZenChatOpen}
            onUpdateSpace={handleUpdateSpace}
          />
        )}

      </div>
    </div>
  )
}

export default FocusRoom