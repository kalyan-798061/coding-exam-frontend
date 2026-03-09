/**
 * executionService.js
 *
 * Sends code to the Django backend for real execution via subprocess.
 * The backend runs Python code and returns stdout/stderr.
 */

import { API_ENDPOINTS } from "../config";

/**
 * Execute code against the puzzle input by sending it to the backend.
 * @param {object} params
 * @param {string} params.code       - Source code to run
 * @param {string} params.language   - Language identifier (currently only "python")
 * @param {string} params.puzzleInput - Puzzle input to pass as stdin
 * @returns {Promise<{ status: "success" | "error", stdout?: string, stderr?: string, executionTime?: number }>}
 */
export async function executeCode({ code, language, puzzleInput }) {
  try {
    const response = await fetch(API_ENDPOINTS.runCode, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        puzzleInput: puzzleInput || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        stderr: data.error || "Execution request failed.",
        executionTime: data.executionTime || 0,
      };
    }

    return {
      status: data.status,
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      executionTime: data.executionTime || 0,
    };
  } catch (err) {
    return {
      status: "error",
      stderr: `Network error: ${err.message}. Make sure the backend server is running.`,
      executionTime: 0,
    };
  }
}
