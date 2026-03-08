/**
 * ResultsModal — shows final exam score.
 */

export default function ResultsModal({ result, onClose }) {

  const score = result?.final_score ?? 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-card results-modal">

        <div style={{ fontSize: "48px", marginBottom: "15px" }}>
          🏆
        </div>

        <h2 className="result-title">
          Exam Completed
        </h2>

        <div style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginTop: "10px",
          marginBottom: "20px"
        }}>
          Score: {score}
        </div>

        <p className="result-message">
          Thank you for participating in the coding challenge.
        </p>

        <div className="result-actions">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}