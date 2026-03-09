import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config";

export default function LoginPage({ onSuccess, onRegister }) {

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [waiting, setWaiting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  /* ───────── TIMER FOR WAITING SCREEN ───────── */

  useEffect(() => {
    if (!waiting || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const diff = Math.max(0, Math.floor((start - now) / 1000));

      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
        window.location.reload(); // reload to login again
      }

    }, 1000);

    return () => clearInterval(interval);

  }, [waiting, startTime]);


  /* ───────── LOGIN FUNCTION ───────── */

  const handleLogin = async () => {

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSubmitting(true);

    try {

      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      /* exam started */
      if (data.status === "exam") {
        // Fetch all questions
        const qResponse = await fetch(
          API_ENDPOINTS.generateQuestionOrder,
          {
            method: "GET",
            credentials: "include"
          }
        );

        const questionData = await qResponse.json();

        if (!qResponse.ok) {
          throw new Error(questionData.error || "Failed to load questions");
        }

        // Pass questions data to parent
        onSuccess({
          name: name,
          ...questionData
        });
      }

      /* exam not started yet */
      else if (data.status === "not_started") {
        setWaiting(true);
        setStartTime(data.start_time);
      }

      /* exam finished */
      else if (data.status === "ended") {
        setError("Exam already ended.");
      }

      else {
        setError(data.error || "Unknown error");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Server error.");
    }

    setSubmitting(false);
  };


  /* ───────── WAITING SCREEN ───────── */

  if (waiting) {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="auth-root">
        <div className="auth-card">

          <h2 className="auth-title">Contest Not Started</h2>

          <p className="auth-subtitle">
            The exam will start soon.
          </p>

          <div style={{fontSize:"32px", marginTop:"20px"}}>
            {minutes}:{seconds.toString().padStart(2,"0")}
          </div>

          <p style={{marginTop:"15px"}}>
            Please wait...
          </p>

        </div>
      </div>
    );
  }


  /* ───────── NORMAL LOGIN SCREEN ───────── */

  return (
    <div className="auth-root">

      <div className="auth-card">

        <div className="auth-brand">
          <span className="brand-icon">⚔</span>
          <span className="brand-name">
            Code<span className="brand-accent">Arena</span>
          </span>
        </div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue competing</p>

        {error && (
          <div className="auth-error">
            ⚠ {error}
          </div>
        )}

        <div className="auth-field">

          <label className="auth-label">Name</label>

          <input
            className="auth-input"
            type="text"
            placeholder="Enter your registered name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

        </div>

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Enter Arena →"}
        </button>

        <p className="auth-switch">
          New here?{" "}
          <button className="auth-link" onClick={onRegister}>
            Create an account
          </button>
        </p>

      </div>
    </div>
  );
}