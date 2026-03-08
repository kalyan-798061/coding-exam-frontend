/**
 * questions.js — Static question bank for CodeArena.
 * Used by the Next button to cycle through questions.
 * Each question maps to an existing question_id for API fetching.
 */

export const QUESTIONS = [
  {
    id: "1",
    label: "Question 1",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "15" },
      { input: "[10, 20, 30]", expectedOutput: "60" },
    ],
  },
  {
    id: "2",
    label: "Question 2",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "racecar", expectedOutput: "racecar" },
    ],
  },
  {
    id: "3",
    label: "Question 3",
    testCases: [
      { input: "16", expectedOutput: "4" },
      { input: "81", expectedOutput: "9" },
    ],
  },
  {
    id: "4",
    label: "Two Sum (LeetCode-style)",
    testCases: [
      { input: "[2,7,11,15], target=9", expectedOutput: "[0,1]" },
      { input: "[3,2,4], target=6", expectedOutput: "[1,2]" },
    ],
  },
];
