/**
 * StartExam — Initial screen after login with "Start Exam" button.
 */
export default function StartExam({ username, onStart }) {
  return (
    <div className="start-exam-screen">
      <div className="start-exam-card">
        <div className="start-exam-icon">⚔️</div>
        <h1 className="start-exam-title">Welcome, {username}!</h1>
        <p className="start-exam-subtitle">
          You will be presented with 5 coding challenges.
          <br />
          Solve them in any order you prefer.
        </p>
        <div className="start-exam-info">
          <div className="info-item">
            <span className="info-icon">📝</span>
            <span className="info-text">5 Questions</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⏱️</span>
            <span className="info-text">60 Minutes</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔄</span>
            <span className="info-text">Unlimited Retries</span>
          </div>
        </div>
        <button className="btn-start-exam" onClick={onStart}>
          Start Exam
        </button>
      </div>
    </div>
  );
}
