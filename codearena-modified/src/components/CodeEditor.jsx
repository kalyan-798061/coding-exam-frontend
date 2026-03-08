import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { executeCode } from "../services/executionService";

const LANGUAGES = ["python", "javascript", "java", "cpp", "c"];

const LANG_LABELS = {
  python: "Python 3",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
  c: "C",
};

/**
 * CodeEditor — Monaco-powered editor with language selector and run button.
 */
export default function CodeEditor({
  code, setCode,
  language, setLanguage,
  puzzleInput,
  executionOutput, setExecutionOutput,
  isExecuting, setIsExecuting,
  disabled,
  starterTemplates,
}) {
  const outputRef = useRef(null);

  // Load starter template when language changes
  useEffect(() => {
    if (starterTemplates && starterTemplates[language]) {
      setCode(starterTemplates[language]);
    }
  }, [language, starterTemplates]);

  const handleRun = async () => {
    if (disabled || isExecuting || !code.trim()) return;
    try {
      setIsExecuting(true);
      setExecutionOutput({ status: "running" });
      const result = await executeCode({ code, language, puzzleInput });
      setExecutionOutput(result);
      // Auto-scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setExecutionOutput({ status: "error", stderr: err.message || "Execution failed." });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClear = () => {
    setExecutionOutput(null);
    if (starterTemplates?.[language]) setCode(starterTemplates[language]);
  };

  return (
    <div className="editor-panel">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="lang-selector-wrap">
          <select
            className="lang-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={disabled}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{LANG_LABELS[l]}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-actions">
          <button className="btn-ghost" onClick={handleClear} disabled={disabled}>
            Reset
          </button>
          <button
            className={`btn-run ${isExecuting ? "btn-run-loading" : ""}`}
            onClick={handleRun}
            disabled={disabled || isExecuting || !code.trim()}
          >
            {isExecuting ? (
              <><span className="spin-sm" /> Running...</>
            ) : (
              <><span className="run-icon">▶</span> Run Code</>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="monaco-wrap">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language === "c" ? "c" : language}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            wordWrap: "on",
            readOnly: disabled,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
          }}
        />
      </div>

      {/* Output Panel */}
      {executionOutput && (
        <div className="output-panel" ref={outputRef}>
          <div className="output-header">
            <span className="output-title">Output</span>
            {executionOutput.status === "running" && (
              <span className="output-badge badge-running">Running</span>
            )}
            {executionOutput.status === "success" && (
              <span className="output-badge badge-success">Success</span>
            )}
            {executionOutput.status === "error" && (
              <span className="output-badge badge-error">Error</span>
            )}
            <button className="output-close" onClick={() => setExecutionOutput(null)}>✕</button>
          </div>

          {executionOutput.status === "running" && (
            <div className="output-running">
              <div className="loading-dots"><span /><span /><span /></div>
              <span>Executing...</span>
            </div>
          )}

          {executionOutput.status === "success" && (
            <pre className="output-content output-stdout">{executionOutput.stdout || "(no output)"}</pre>
          )}

          {executionOutput.status === "error" && (
            <pre className="output-content output-stderr">{executionOutput.stderr}</pre>
          )}

          {executionOutput.executionTime && (
            <div className="output-meta">Executed in {executionOutput.executionTime}ms</div>
          )}
        </div>
      )}
    </div>
  );
}
