import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Quiz.css' 

function Quiz() { 
  const [step, setStep] = useState(0)
  const [isFinished, setIsFinished] = useState(false) 
  const [isAnalyzing, setIsAnalyzing] = useState(false) 
  const [selectedAnswers, setSelectedAnswers] = useState([])
  
  const navigate = useNavigate()

  const questions = [
    {
      q: <span>Level 1: What is the output of <code className="inline-code">cout &lt;&lt; (5 &gt; 3);</code> in C++?</span>,
      options: ["5", "1", "True", "0"],
      answer: 1 
    },
    {
      q: <span>Level 2: Which operator is used to access the memory address of a variable?</span>,
      options: ["*", "&", "%", "->"],
      answer: 1 
    },
    {
      q: <span>Level 3: In a dynamically allocated array, what keyword frees the memory?</span>,
      options: ["delete[]", "free()", "remove", "clear"],
      answer: 0 
    }
  ]

  const handleSelect = (index) => {
    const updatedAnswers = [...selectedAnswers]
    updatedAnswers[step] = index                
    setSelectedAnswers(updatedAnswers)          
  }

  const handlePrev = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setIsAnalyzing(true)
    }
  }

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        setIsFinished(true)
        setIsAnalyzing(false)
      }, 2000) 
      return () => clearTimeout(timer)
    }
  }, [isAnalyzing])

  // Kept this function so your AI can still use it silently in the background!
  const determineRank = () => {
    let finalScore = 0;
    selectedAnswers.forEach((ans, index) => {
      if (ans === questions[index].answer) finalScore++;
    })
    if (finalScore === 3) return "S-CLASS (SPECIAL GRADE)"
    if (finalScore === 2) return "A-CLASS (GRADE 1)"
    if (finalScore === 1) return "B-CLASS (GRADE 2)"
    return "NOVICE (GRADE 4)"
  }

  // UI: THE LOADING SCREEN
  if (isAnalyzing) {
    return (
      <div className="quiz-glass analyzing-container">
         <div className="spinner"></div>
         <h2 className="analyzing-text">ANALYZING NEURAL PATHWAYS...</h2>
         <p className="analyzing-sub">Calibrating adaptive learning curve</p>
      </div>
    )
  }

  // UI: THE RESULTS SCREEN
  if (isFinished === true) {
    let correctCount = 0;
    selectedAnswers.forEach((ans, index) => {
      if (ans === questions[index].answer) correctCount++;
    });
    const incorrectCount = questions.length - correctCount;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="quiz-glass">
        <div className="status-badge">DIAGNOSTIC COMPLETE</div>

        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Correct</span>
            <span className="stat-value success">{correctCount}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Errors</span>
            <span className="stat-value error">{incorrectCount}</span>
          </div>
        </div>

        <button onClick={() => navigate('/hub')} className="logic-btn full-width">
          INITIALIZE TRAINING
        </button>
      </div>
    )
  }

  // UI: THE QUESTION SCREEN
  const progressPercentage = ((step + 1) / questions.length) * 100;

  return (
    <div className="quiz-glass">
      
      <div className="quiz-header">
        <div className="quiz-meta">
            <span className="system-ping"></span>
            <span className="step-counter">DIAGNOSTIC {step + 1} // {questions.length}</span>
        </div>
        <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <h2 className="question-text">{questions[step].q}</h2>
      
      <div className="options-grid">
        {questions[step].options.map((opt, index) => (
          <button 
            key={index} 
            onClick={() => handleSelect(index)} 
            className={`option-btn ${selectedAnswers[step] === index ? "selected" : ""}`}
          >
            <span className="opt-letter">{['A', 'B', 'C', 'D'][index]}</span>
            {opt}
          </button>
        ))}
      </div>

      <div className="nav-bar">
        {step > 0 ? <button onClick={handlePrev} className="logic-btn outline">PREV</button> : <div></div>}
        <button 
          onClick={handleNext} 
          className="logic-btn" 
          disabled={selectedAnswers[step] == null}
        >
          {step === questions.length - 1 ? "SUBMIT ANALYSIS" : "NEXT"}
        </button>
      </div>
    </div>
  )
}

export default Quiz