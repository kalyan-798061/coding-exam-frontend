/**
 * Submission — answer input field and submit button.
 * Shows solved status when question is already completed.
 */
export default function Submission({ answer, setAnswer, onSubmit, isSubmitting, disabled, isSolved }) {
  const canSubmit = answer.trim().length > 0 && !disabled && !isSubmitting && !isSolved;

  return (
    <div className="submission-wrap">
      <h2 className="section-title">Your Answer</h2>
      
      {isSolved ? (
        <div className="submission-solved">
          <span className="solved-icon">✓</span>
          <span className="solved-text">You have already solved this question!</span>
        </div>
      ) : (
        <>
          <p className="submission-hint">
            Run your code against the puzzle input, then enter your computed answer below.
          </p>

          {/* Answer input + Submit button */}
          <div className="submission-input-row">
            <input
              className="answer-input"
              type="text"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={disabled}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit()}
            />
            <button
              className={`btn-submit ${isSubmitting ? "btn-submit-loading" : ""}`}
              onClick={onSubmit}
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <><span className="spin-sm" /> Submitting...</>
              ) : (
                <><span className="submit-icon">🚀</span> Submit</>
              )}
            </button>
          </div>

          {disabled && !isSolved && (
            <p className="submission-disabled-note">⏰ Challenge has ended. Submissions are closed.</p>
          )}
        </>
      )}
    </div>
  );
}
