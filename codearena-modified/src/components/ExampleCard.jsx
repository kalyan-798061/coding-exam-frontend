/**
 * ExampleCard — displays a single input/output example with optional explanation.
 */
export default function ExampleCard({ index, example }) {
  return (
    <div className="example-card">
      <div className="example-header">
        <span className="example-label">Example {index}</span>
      </div>
      <div className="example-body">
        <div className="example-row">
          <span className="example-key">Input:</span>
          <code className="example-value">{example.input}</code>
        </div>
        <div className="example-row">
          <span className="example-key">Output:</span>
          <code className="example-value example-output">{example.output}</code>
        </div>
        {example.explanation && (
          <div className="example-row example-explanation-row">
            <span className="example-key">Explanation:</span>
            <span className="example-explanation">{example.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
