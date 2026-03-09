/**
 * QuestionNavigator — Full-screen question selector.
 * Shows all 5 questions as cards for user to select.
 */
export default function QuestionNavigator({
  questions,
  solvedQuestionIds,
  onSelectQuestion,
}) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="question-select-screen">
      <div className="question-select-header">
        <h1 className="question-select-title">Select a Challenge</h1>
        <div className="question-select-progress">
          <span className="progress-text">
            {solvedQuestionIds.length} / {questions.length} Solved
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(solvedQuestionIds.length / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="question-cards-grid">
        {questions.map((q, index) => {
          const isSolved = solvedQuestionIds.includes(q.question_id);

          return (
            <button
              key={q.question_id}
              className={`question-card ${isSolved ? "question-card-solved" : ""}`}
              onClick={() => onSelectQuestion(q.question_id)}
            >
              <div className="question-card-header">
                <span className="question-card-number">Q{index + 1}</span>
                <span className={`question-card-difficulty badge-${q.difficulty}`}>
                  {q.difficulty}
                </span>
                {isSolved && <span className="question-card-check">✓</span>}
              </div>
              <h3 className="question-card-title">{q.title}</h3>
              <p className="question-card-points">
                {q.points || (q.difficulty === 'easy' ? 10 : 20)} points
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
