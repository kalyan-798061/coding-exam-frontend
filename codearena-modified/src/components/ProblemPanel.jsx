import ExampleCard from "./ExampleCard";
import PuzzleInput from "./PuzzleInput";
import Submission from "./Submission";
import TestCaseCard from "./TestCaseCard";

/**
 * ProblemPanel — full problem description, examples, puzzle input, and submission.
 */
export default function ProblemPanel({
  question, puzzleInput,
  answer, setAnswer,
  onSubmit, isSubmitting, disabled,
  testCases,
}) {
  if (!question) return null;

  // Check if disabled means it's solved (when disabled is true but challenge not ended)
  const isSolved = disabled && !question.challengeEnded;

  return (
    <div className="problem-panel">
      {/* Problem Header */}
      <div className="problem-header">
        <div className="problem-meta">
          <span className="problem-number">Question {question.question_id || question.id}</span>
          <span className={`difficulty-badge badge-${question.difficulty || "medium"}`}>
            {question.difficulty || "Medium"}
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

      {/* Test Cases — shows input and expected output for this question */}
      <TestCaseCard testCases={testCases} />

      {/* Submission */}
      <div className="problem-section">
        <Submission
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          disabled={disabled}
          isSolved={isSolved}
        />
      </div>
    </div>
  );
}
