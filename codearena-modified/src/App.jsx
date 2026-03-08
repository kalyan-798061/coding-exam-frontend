import { useState } from "react";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ProblemPanel from "./components/ProblemPanel";
import ResultsModal from "./components/ResultsModal";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";

const TIMER_DURATION = 60 * 60;

export default function App() {

  const [view, setView] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [question, setQuestion] = useState(null);
  const [puzzleInput, setPuzzleInput] = useState("");

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  const [answer, setAnswer] = useState("");
  const [resultsModal, setResultsModal] = useState(null);

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [challengeEnded, setChallengeEnded] = useState(false);

  const [executionOutput, setExecutionOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState(null);

  /* ───────────────── LOGIN SUCCESS ───────────────── */

  const handleLoginSuccess = (data) => {
    setLoggedInUser({ name: "user" });
    setQuestion(data);
    setPuzzleInput(data.puzzle_input);
    setView("dashboard");
  };

  /* ───────────────── SUBMIT ANSWER ───────────────── */

  const handleSubmit = async () => {

    if (!answer.trim() || challengeEnded || isSubmitting) return;

    alert("Answer Submitted");

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:8000/api/submit/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: loggedInUser.name,
          answer: answer.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      /* next question */
      if (data.status === "next_question") {
        setQuestion(data);
        setPuzzleInput(data.puzzle_input);
        setAnswer("");
        setExecutionOutput(null);
      }

      /* exam finished */
      if (data.status === "finished") {
        setResultsModal(data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ───────────────── LOGOUT ───────────────── */

  const handleLogout = () => {
    setLoggedInUser(null);
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

  /* ───────────────── DASHBOARD ───────────────── */

  const displayName = loggedInUser?.name || "Challenger";

  return (
    <div className="app-root">

      <Header
        username={displayName}
        timeLeft={timeLeft}
        challengeEnded={challengeEnded}
        onLogout={handleLogout}
      />

      {error && (
        <div className="error-banner">
          ⚠ {error}
        </div>
      )}

      <main className="main-split">

        <div className="split-left">
          <ProblemPanel
            question={question}
            puzzleInput={puzzleInput}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={challengeEnded}
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
            starterTemplates={question?.starterTemplates}
          />
        </div>

      </main>

      {resultsModal && (
        <ResultsModal
          result={resultsModal}
          onClose={() => setResultsModal(null)}
        />
      )}

    </div>
  );
}