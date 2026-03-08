import { useState } from "react";

/**
 * PuzzleInput — shows the user's unique puzzle input in a scrollable box with copy button.
 */
export default function PuzzleInput({ puzzleInput }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!puzzleInput) return;
    try {
      await navigator.clipboard.writeText(puzzleInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = puzzleInput;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="puzzle-input-wrap">
      <div className="puzzle-input-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Your Puzzle Input</h2>
        <div className="puzzle-input-actions">
          <span className="puzzle-unique-badge">Unique to you</span>
          <button
            className={`btn-copy ${copied ? "btn-copied" : ""}`}
            onClick={handleCopy}
            disabled={!puzzleInput}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="puzzle-input-box">
        {puzzleInput ? (
          <pre className="puzzle-input-content">{puzzleInput}</pre>
        ) : (
          <div className="puzzle-input-loading">
            <div className="loading-spinner-sm" />
            <span>Loading your puzzle input...</span>
          </div>
        )}
      </div>
    </div>
  );
}
