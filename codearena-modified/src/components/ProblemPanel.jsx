import ExampleCard from "./ExampleCard";
import PuzzleInput from "./PuzzleInput";
import Submission from "./Submission";
import TestCaseCard from "./TestCaseCard";

const DIFFICULTY_COLORS = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

/**
 * ProblemPanel — full problem description, examples, puzzle input, and submission.
 * Enhanced with:
 *   - TestCaseCard section showing input/expected output
 *   - Next button to advance to the next question
 */
export default function ProblemPanel({
  question, puzzleInput,
  answer, setAnswer,
  onSubmit, isSubmitting, disabled,
  // NEW props:
  testCases,      // array of { input, expectedOutput }
  onNext,         // callback to go to next question
  isLastQuestion, // boolean — disables Next on last question
}) {
  if (!question) return null;

  return (
    <div className="problem-panel">
      {/* Problem Header */}
      <div className="problem-header">
        <div className="problem-meta">
          <span className="problem-number">Day {question.day || question.id}</span>
          <span className={`difficulty-badge ${DIFFICULTY_COLORS[question.difficulty] || "badge-medium"}`}>
            {question.difficulty}
          </span>
        </div>
        <h1 className="problem-title">{question.title}</h1>
        {question.tags && (
          <div className="problem-tags">
            {question.tags.map((tag) => (
              <span key={tag} className="problem-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="problem-section">
        <p className="problem-description">{question.description}</p>
        {question.descriptionExtra && (
          <p className="problem-description mt-3">{question.descriptionExtra}</p>
        )}
      </div>

      {/* Examples */}
      {question.examples && question.examples.length > 0 && (
        <div className="problem-section">
          <h2 className="section-title">Examples</h2>
          <div className="examples-list">
            {question.examples.map((ex, i) => (
              <ExampleCard key={i} index={i + 1} example={ex} />
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {question.constraints && (
        <div className="problem-section">
          <h2 className="section-title">Constraints</h2>
          <ul className="constraints-list">
            {question.constraints.map((c, i) => (
              <li key={i} className="constraint-item">
                <span className="constraint-dot" />
                <code className="constraint-text">{c}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Puzzle Input */}
      <div className="problem-section">
        <PuzzleInput puzzleInput={puzzleInput} />
      </div>

      {/* Test Cases (NEW) — shows input and expected output for this question */}
      <TestCaseCard testCases={testCases} />

      {/* Submission + Next button (NEW) */}
      <div className="problem-section">
        <Submission
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          disabled={disabled}
          /* Pass next-question controls down to Submission */
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      </div>
    </div>
  );
}
