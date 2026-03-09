/**
 * FeedbackPopup — Shows popup for correct/wrong answer feedback.
 * Allows resubmission for wrong answers.
 */
export default function FeedbackPopup({ feedback, onClose, onRetry }) {
  if (!feedback) return null;

  const isCorrect = feedback.status === "correct";
  const isAlreadySolved = feedback.status === "already_solved";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card feedback-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={`feedback-icon ${isCorrect || isAlreadySolved ? "feedback-correct" : "feedback-wrong"}`}>
          {isCorrect || isAlreadySolved ? "✓" : "✗"}
        </div>

        {/* Title */}
        <h2 className="feedback-title">
          {isCorrect ? "Correct!" : isAlreadySolved ? "Already Solved!" : "Wrong Answer"}
        </h2>

        {/* Message */}
        <p className="feedback-message">{feedback.message}</p>

        {/* Score */}
        {feedback.marks_awarded !== undefined && feedback.marks_awarded > 0 && (
          <div className="feedback-points">+{feedback.marks_awarded} points</div>
        )}

        {/* Total Score */}
        <div className="feedback-score">
          Total Score: <span className="score-value">{feedback.score}</span>
        </div>

        {/* Actions */}
        <div className="feedback-actions">
          {!isCorrect && !isAlreadySolved && (
            <button className="btn-retry" onClick={onRetry}>
              Try Again
            </button>
          )}
          <button className="btn-primary" onClick={onClose}>
            {isCorrect || isAlreadySolved ? "Continue" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
