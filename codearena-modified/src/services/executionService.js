/**
 * executionService.js
 *
 * Wraps @codesandbox/sdk for remote code execution.
 * Falls back to a mock executor in development mode.
 */

// Attempt to import the SDK (will be installed via npm)
let sandboxSdk = null;
try {
  sandboxSdk = await import("@codesandbox/sdk");
} catch {
  console.warn("[executionService] @codesandbox/sdk not available, using mock executor.");
}

/**
 * Execute code against the puzzle input.
 * @param {object} params
 * @param {string} params.code       - Source code to run
 * @param {string} params.language   - Language identifier
 * @param {string} params.puzzleInput - Puzzle input to pass as stdin/variable
 * @returns {Promise<{ status: "success" | "error", stdout?: string, stderr?: string, executionTime?: number }>}
 */
export async function executeCode({ code, language, puzzleInput }) {
  const start = Date.now();

  // ── Use CodeSandbox SDK if available ────────────────────────────────────────
  if (sandboxSdk) {
    try {
      const { execute } = sandboxSdk;
      const result = await execute({
        code,
        language,
        inputs: { data: puzzleInput },
      });

      const executionTime = Date.now() - start;

      if (result.error) {
        return { status: "error", stderr: result.error, executionTime };
      }

      return {
        status: "success",
        stdout: result.output || result.stdout || "(no output)",
        executionTime,
      };
    } catch (err) {
      return {
        status: "error",
        stderr: err.message || "CodeSandbox execution failed.",
        executionTime: Date.now() - start,
      };
    }
  }

  // ── Mock executor for development ───────────────────────────────────────────
  return mockExecute({ code, language, puzzleInput, start });
}

async function mockExecute({ code, language, puzzleInput, start }) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  const executionTime = Date.now() - start;

  // Simulate occasional errors
  if (code.includes("syntax_error_test")) {
    return {
      status: "error",
      stderr: `SyntaxError: invalid syntax (line 3)\n  >>> syntax_error_test\n         ^\nExpected expression`,
      executionTime,
    };
  }

  // Mock output based on language
  const outputs = {
    python:     "142\n[Finished in 0.08s]",
    javascript: "142\n[Node.js v20.0.0]",
    java:       "142\n[JVM exit code: 0]",
    cpp:        "142\n[clang++ 15.0]",
    c:          "142\n[gcc 12.3.0]",
  };

  return {
    status: "success",
    stdout: outputs[language] || "142",
    executionTime,
  };
}
