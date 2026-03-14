import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Quiz.css' 

function Quiz({ isDarkTheme, toggleTheme }) { 
  const [step, setStep] = useState(0)
  const [isFinished, setIsFinished] = useState(false) 
  const [selectedAnswers, setSelectedAnswers] = useState([])
  
  const navigate = useNavigate()

  const questions = [
    {
      q: "Level 1: What is the output of 'cout << (5 > 3);' in C++?",
      options: ["5", "1", "True", "0"],
      answer: 1 
    },
    {
      q: "Level 2: Which operator is used to access the memory address of a variable?",
      options: ["*", "&", "%", "->"],
      answer: 1 
    },
    {
      q: "Level 3: In a dynamically allocated array, what keyword frees the memory?",
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
      setIsFinished(true) 
    }
  }

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

  const themeButton = (
    <button 
      className="logic-btn" 
      onClick={toggleTheme} 
      title={isDarkTheme ? "Switch to Canvas" : "Switch to Ink"}
      style={{ 
        position: 'absolute', top: '20px', right: '20px', zIndex: 100,
        width: '45px', height: '45px', borderRadius: '50%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 
      }}
    >
      {isDarkTheme ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );

  if (isFinished === true) {
    let correctCount = 0;
    selectedAnswers.forEach((ans, index) => {
      if (ans === questions[index].answer) correctCount++;
    });
    const incorrectCount = questions.length - correctCount;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <>
        {themeButton}
        <div className="quiz-glass">
          <h2 style={{ color: "var(--accent)", letterSpacing: "2px", textTransform: "uppercase" }}>Diagnostic Report</h2>
          <div className="stats-container">
            <div className="stat-box">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value" style={{ textShadow: "0 0 15px var(--accent-glow)" }}>{accuracy}%</span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Correct</span>
              <span className="stat-value" style={{ color: "#68d391", textShadow: "0 0 15px rgba(104, 211, 145, 0.3)" }}>{correctCount}</span>
            </div>

            <div className="stat-box">
              <span className="stat-label">Errors</span>
              <span className="stat-value" style={{ color: "var(--accent)", textShadow: "0 0 15px var(--accent-glow)" }}>{incorrectCount}</span>
            </div>
          </div>

          <button onClick={() => navigate('/hub')} className="logic-btn" style={{ width: "100%" }}>
            ENTER NEUROPATH
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      {themeButton}
      <div className="quiz-glass">
        <p style={{ color: "var(--text-muted)", textAlign: "left", marginBottom: "10px", fontWeight: "bold" }}>QUESTION 0{step + 1} // 0{questions.length}</p>
        <h2 style={{ fontSize: "1.4rem", color: "var(--text-main)", marginBottom: "20px" }}>{questions[step].q}</h2>
        <div className="options-grid">
          {questions[step].options.map((opt, index) => (
            <button 
              key={index} 
              onClick={() => handleSelect(index)} 
              className={`option-btn ${selectedAnswers[step] === index ? "selected" : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="nav-bar">
          {step > 0 ? <button onClick={handlePrev} className="logic-btn">PREV</button> : <div></div>}
          <button onClick={handleNext} className="logic-btn" disabled={selectedAnswers[step] == null}>
            {step === questions.length - 1 ? "SUBMIT ANALYSIS" : "NEXT"}
          </button>
        </div>
      </div>
    </>
  )
}

export default Quiz