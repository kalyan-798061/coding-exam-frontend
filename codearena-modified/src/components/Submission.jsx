/**
 * Submission — answer input field, submit button, and next-question button.
 * Enhanced with:
 *   - onNext prop: advances to the next question
 *   - isLastQuestion prop: disables Next on the final question
 */
export default function Submission({ answer, setAnswer, onSubmit, isSubmitting, disabled, onNext, isLastQuestion }) {
  const canSubmit = answer.trim().length > 0 && !disabled && !isSubmitting;

  return (
    <div className="submission-wrap">
      <h2 className="section-title">Your Answer</h2>
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

      {/* Next question button — disabled on last question */}
      {onNext && (
        <button
          className="btn-next"
          onClick={onNext}
          disabled={isLastQuestion || disabled}
          title={isLastQuestion ? "This is the last question" : "Go to next question"}
        >
          {isLastQuestion ? "Last Question" : "Next Question →"}
        </button>
      )}

      {disabled && (
        <p className="submission-disabled-note">⏰ Challenge has ended. Submissions are closed.</p>
      )}
    </div>
  );
}
