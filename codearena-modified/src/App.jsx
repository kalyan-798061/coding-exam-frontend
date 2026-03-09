import { useState } from "react";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ProblemPanel from "./components/ProblemPanel";
import ResultsModal from "./components/ResultsModal";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import StartExam from "./components/StartExam";
import QuestionNavigator from "./components/QuestionNavigator";
import FeedbackPopup from "./components/FeedbackPopup";
import { API_ENDPOINTS } from "./config";

const TIMER_DURATION = 60 * 60;

export default function App() {

  // Views: login, register, exam-start, question-select, question-view
  const [view, setView] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // All questions from backend
  const [questions, setQuestions] = useState([]);
  const [solvedQuestionIds, setSolvedQuestionIds] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  // Current selected question
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  const [answer, setAnswer] = useState("");
  const [resultsModal, setResultsModal] = useState(null);
  const [feedbackPopup, setFeedbackPopup] = useState(null);

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [challengeEnded, setChallengeEnded] = useState(false);

  const [executionOutput, setExecutionOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState(null);

  // Get current question object
  const currentQuestion = questions.find(q => q.question_id === currentQuestionId) || null;
  const puzzleInput = currentQuestion?.puzzle_input || "";

  /* ───────────────── LOGIN SUCCESS ───────────────── */

  const handleLoginSuccess = (data) => {
    setLoggedInUser({ name: data.name || "user" });
    
    // data now contains: { status, questions, solved_question_ids, total_score }
    if (data.questions && data.questions.length > 0) {
      setQuestions(data.questions);
      setSolvedQuestionIds(data.solved_question_ids || []);
      setTotalScore(data.total_score || 0);
    }
    
    // Go to exam start screen (not directly to questions)
    setView("exam-start");
  };

  /* ───────────────── START EXAM ───────────────── */

  const handleStartExam = () => {
    setView("question-select");
  };

  /* ───────────────── SELECT QUESTION ───────────────── */

  const handleSelectQuestion = (questionId) => {
    setCurrentQuestionId(questionId);
    setAnswer("");
    setExecutionOutput(null);
    setView("question-view");
  };

  /* ───────────────── BACK TO QUESTIONS ───────────────── */

  const handleBackToQuestions = () => {
    setView("question-select");
    setCurrentQuestionId(null);
  };

  /* ───────────────── SUBMIT ANSWER ───────────────── */

  const handleSubmit = async () => {

    if (!answer.trim() || challengeEnded || isSubmitting || !currentQuestionId) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(API_ENDPOINTS.submit, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question_id: currentQuestionId,
          answer: answer.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      // Show feedback popup
      setFeedbackPopup(data);

      // Update state based on result
      if (data.status === "correct") {
        // Add to solved list if not already there
        if (!solvedQuestionIds.includes(currentQuestionId)) {
          setSolvedQuestionIds(prev => [...prev, currentQuestionId]);
        }
        setTotalScore(data.score);
        
        // Check if all solved
        if (data.all_solved) {
          // Will show final results after closing feedback
        }
      } else if (data.status === "already_solved") {
        setTotalScore(data.score);
      }
      // For "wrong" status, user can retry (popup shows Try Again button)

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ───────────────── FEEDBACK POPUP HANDLERS ───────────────── */

  const handleFeedbackClose = () => {
    const wasCorrect = feedbackPopup?.status === "correct" || feedbackPopup?.status === "already_solved";
    setFeedbackPopup(null);
    
    if (wasCorrect) {
      setAnswer("");
      // Return to question selector
      setView("question-select");
      setCurrentQuestionId(null);
    }
  };

  const handleFeedbackRetry = () => {
    setFeedbackPopup(null);
    setAnswer("");
    // Stay on current question for retry
  };

  /* ───────────────── LOGOUT ───────────────── */

  const handleLogout = () => {
    setLoggedInUser(null);
    setQuestions([]);
    setSolvedQuestionIds([]);
    setCurrentQuestionId(null);
    setTotalScore(0);
    setView("login");
  };

  const handleRegisterSuccess = () => setView("login");

  /* ───────────────── AUTH VIEWS ───────────────── */

  if (view === "register") {
    return <RegisterPage onSuccess={handleRegisterSuccess} />;
  }

  if (view === "login") {
    return (
      <LoginPage
        onSuccess={handleLoginSuccess}
        onRegister={() => setView("register")}
      />
    );
  }

  /* ───────────────── EXAM START SCREEN ───────────────── */

  if (view === "exam-start") {
    return (
      <div className="app-root">
        <Header
          username={loggedInUser?.name || "Challenger"}
          timeLeft={timeLeft}
          challengeEnded={challengeEnded}
          onLogout={handleLogout}
          totalScore={totalScore}
          showTimer={false}
        />
        <StartExam 
          username={loggedInUser?.name || "Challenger"} 
          onStart={handleStartExam} 
        />
      </div>
    );
  }

  /* ───────────────── QUESTION SELECT SCREEN ───────────────── */

  if (view === "question-select") {
    return (
      <div className="app-root">
        <Header
          username={loggedInUser?.name || "Challenger"}
          timeLeft={timeLeft}
          challengeEnded={challengeEnded}
          onLogout={handleLogout}
          totalScore={totalScore}
        />
        <QuestionNavigator
          questions={questions}
          solvedQuestionIds={solvedQuestionIds}
          onSelectQuestion={handleSelectQuestion}
        />
      </div>
    );
  }

  /* ───────────────── QUESTION VIEW (Solving) ───────────────── */

  const displayName = loggedInUser?.name || "Challenger";

  return (
    <div className="app-root">

      <Header
        username={displayName}
        timeLeft={timeLeft}
        challengeEnded={challengeEnded}
        onLogout={handleLogout}
        totalScore={totalScore}
      />

      {error && (
        <div className="error-banner">
          {error}
          <button className="retry-btn" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <main className="main-split">

        <div className="split-left">
          {/* Back to Questions Button */}
          <div className="back-nav">
            <button className="btn-back" onClick={handleBackToQuestions}>
              <span className="back-arrow">←</span>
              Back to Questions
            </button>
            <span className="current-question-label">
              Question {questions.findIndex(q => q.question_id === currentQuestionId) + 1} of {questions.length}
            </span>
          </div>

          {/* Problem Panel for current question */}
          <ProblemPanel
            question={currentQuestion}
            puzzleInput={puzzleInput}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={challengeEnded || solvedQuestionIds.includes(currentQuestionId)}
          />
        </div>

        <div className="split-right">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            puzzleInput={puzzleInput}
            executionOutput={executionOutput}
            setExecutionOutput={setExecutionOutput}
            isExecuting={isExecuting}
            setIsExecuting={setIsExecuting}
            disabled={challengeEnded}
            starterTemplates={currentQuestion?.starterTemplates}
          />
        </div>

      </main>

      {/* Feedback Popup */}
      {feedbackPopup && (
        <FeedbackPopup
          feedback={feedbackPopup}
          onClose={handleFeedbackClose}
          onRetry={handleFeedbackRetry}
        />
      )}

      {/* Final Results Modal */}
      {resultsModal && (
        <ResultsModal
          result={resultsModal}
          onClose={() => setResultsModal(null)}
        />
      )}

    </div>
  );
}
