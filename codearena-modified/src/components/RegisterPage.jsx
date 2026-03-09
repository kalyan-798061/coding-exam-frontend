import { useState } from "react";
import { registerUser } from "../services/auth";
import { API_ENDPOINTS } from "../config";

/**
 * RegisterPage — New user registration form.
 * Collects name, department, and year.
 * On success, stores user in localStorage and calls onSuccess() to navigate to login.
 */
export default function RegisterPage({ onSuccess }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
const handleRegister = async () => {
  setError("");

  if (!name.trim() || !department.trim() || !year.toString().trim()) {
    setError("All fields are required.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(API_ENDPOINTS.register, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        department,
        year
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    if (data.status === "Registered successfully") {
      onSuccess(); // redirect to login page
    } else {
      setError(data.error || "Registration failed");
    }

  } catch (err) {
    console.error("Register error:", err);
    setError("Server error. Please try again.");
  }

  setSubmitting(false);
};

  return (
    <div className="auth-root">
      {/* Background glow effect */}
      <div className="auth-glow" />

      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <span className="brand-icon">⚔</span>
          <span className="brand-name">
            Code<span className="brand-accent">Arena</span>
          </span>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to join the arena</p>

        {/* Error message */}
        {error && (
          <div className="auth-error">
            <span>⚠ {error}</span>
          </div>
        )}

        {/* Name field */}
        <div className="auth-field">
          <label className="auth-label">Name</label>
          <input
            className="auth-input"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            autoFocus
          />
        </div>

        {/* Department field */}
        <div className="auth-field">
          <label className="auth-label">Department</label>
          <input
            className="auth-input"
            type="text"
            placeholder="e.g.Information Technology"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        {/* Year field */}
        <div className="auth-field">
          <label className="auth-label">Year</label>
          <input
            className="auth-input"
            type="number"
            placeholder="e.g. 2"
            min="1"
            max="6"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        {/* Submit button */}
        <button
          className="auth-btn"
          onClick={handleRegister}
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register →"}
        </button>

        {/* Link to login */}
        <p className="auth-switch">
          Already registered?{" "}
          <button className="auth-link" onClick={onSuccess}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
