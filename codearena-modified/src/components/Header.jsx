import { useMemo } from "react";

/**
 * Header — sticky top bar with platform branding, centered timer, and user info.
 * Enhanced: shows logged-in user's name and a Logout button.
 * Props:
 *   username       — display name
 *   timeLeft       — seconds remaining
 *   challengeEnded — boolean
 *   onLogout       — (NEW) callback to log out user
 */
export default function Header({ username, timeLeft, challengeEnded, onLogout }) {
  const formatted = useMemo(() => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    return `${h > 0 ? String(h).padStart(2, "0") + ":" : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [timeLeft]);

  const urgency = timeLeft <= 300; // last 5 minutes

  return (
    <header className="header">
      {/* Brand */}
      <div className="header-brand">
        <span className="brand-icon">⚔</span>
        <span className="brand-name">Code<span className="brand-accent">Arena</span></span>
      </div>

      {/* Timer */}
      <div className={`timer-wrap ${urgency ? "timer-urgent" : ""} ${challengeEnded ? "timer-ended" : ""}`}>
        <span className="timer-label">{challengeEnded ? "ENDED" : "TIME LEFT"}</span>
        <span className="timer-value">{challengeEnded ? "00:00" : formatted}</span>
      </div>

      {/* User + Logout */}
      <div className="header-user">
        <div className="avatar">{username[0].toUpperCase()}</div>
        <span className="username">{username}</span>

        {/* Logout button — clears session and redirects to login */}
        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Log out">
            <span className="logout-icon">⏏</span>
            <span className="logout-label">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
