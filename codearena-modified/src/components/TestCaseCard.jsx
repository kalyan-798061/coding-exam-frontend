/**
 * TestCaseCard — displays test cases for the current question.
 * Shows input and expected output in a styled card format.
 */
export default function TestCaseCard({ testCases }) {
  if (!testCases || testCases.length === 0) return null;

  return (
    <div className="problem-section">
      <h2 className="section-title">Test Cases</h2>
      <div className="testcase-list">
        {testCases.map((tc, i) => (
          <div key={i} className="testcase-card">
            <div className="testcase-header">
              <span className="testcase-label">Case {i + 1}</span>
            </div>
            <div className="testcase-body">
              <div className="testcase-row">
                <span className="testcase-key">Input:</span>
                <code className="testcase-value">{tc.input}</code>
              </div>
              <div className="testcase-row">
                <span className="testcase-key">Expected Output:</span>
                <code className="testcase-value testcase-output">{tc.expectedOutput}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
