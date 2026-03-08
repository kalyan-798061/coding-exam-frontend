# ⚔ CodeArena

A modern competitive coding platform frontend inspired by Advent of Code.

## Stack
- React 18 + Vite
- Monaco Editor (`@monaco-editor/react`)
- `@codesandbox/sdk` for remote code execution
- Axios for API calls
- Pure CSS (no Tailwind classes in JSX — custom design system in `index.css`)

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set your API URL:
```
VITE_API_URL=http://localhost:3000/api
```

## API Contracts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions/:id` | Fetch question details |
| GET | `/api/puzzle/:questionId?userId=xxx` | Fetch unique puzzle input |
| POST | `/api/submit` | Submit answer `{ userId, questionId, answer }` |

### Question Response Shape
```json
{
  "id": "1",
  "day": 1,
  "title": "Trebuchet?!",
  "difficulty": "Easy | Medium | Hard",
  "description": "...",
  "tags": ["String Parsing"],
  "examples": [
    { "input": "...", "output": "...", "explanation": "..." }
  ],
  "constraints": ["..."],
  "starterTemplates": {
    "python": "...",
    "javascript": "...",
    "java": "...",
    "cpp": "...",
    "c": "..."
  }
}
```

### Submit Response Shape
```json
{
  "correct": true,
  "submittedAnswer": "142",
  "expectedAnswer": "142",
  "message": "Correct!",
  "points": 100
}
```

## Dev Mode
When backend APIs are unavailable, the app automatically falls back to rich mock data so the entire UI is explorable without a backend.

## Folder Structure
```
src/
  components/
    Header.jsx        — Sticky top bar: brand, timer, user
    CodeEditor.jsx    — Monaco editor + language selector + run button + output
    ProblemPanel.jsx  — Full problem description panel
    ExampleCard.jsx   — Single input/output example display
    PuzzleInput.jsx   — Scrollable puzzle input box + copy
    Submission.jsx    — Answer input + submit button
    ResultsModal.jsx  — Correct/Incorrect result overlay
  services/
    api.js            — Axios API calls with mock fallbacks
    executionService.js — CodeSandbox SDK wrapper with mock fallback
  App.jsx             — Root component: state, layout, data fetching
  main.jsx            — React entry point
  index.css           — Full design system (custom CSS variables, no Tailwind)
index.html
vite.config.js
package.json
```
