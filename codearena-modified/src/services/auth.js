/**
 * auth.js — Frontend-only authentication helpers using localStorage.
 * No backend integration required. All data stored locally.
 */

const USERS_KEY = "codearena_users";
const LOGGED_IN_KEY = "codearena_logged_in";

/**
 * Register a new user. Stores user details in localStorage.
 * Returns { success: true } or { success: false, error: string }
 */
export function registerUser({ name, department, year }) {
  const trimmedName = name.trim();
  if (!trimmedName) return { success: false, error: "Name is required." };

  const users = getUsers();

  // Check for duplicate name
  if (users.find((u) => u.name.toLowerCase() === trimmedName.toLowerCase())) {
    return { success: false, error: "A user with this name already exists." };
  }

  const newUser = {
    name: trimmedName,
    department: department.trim(),
    year: String(year).trim(),
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

/**
 * Log in a user by name. Stores the logged-in user in localStorage.
 * Returns { success: true, user } or { success: false, error: string }
 */
export function loginUser(name) {
  const trimmedName = name.trim();
  if (!trimmedName) return { success: false, error: "Name is required." };

  const users = getUsers();
  const user = users.find((u) => u.name.toLowerCase() === trimmedName.toLowerCase());

  if (!user) {
    return { success: false, error: "No account found with this name. Please register first." };
  }

  localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));
  return { success: true, user };
}

/**
 * Get the currently logged-in user. Returns user object or null.
 */
export function getLoggedInUser() {
  try {
    const raw = localStorage.getItem(LOGGED_IN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Log out: clears logged-in user from localStorage.
 */
export function logoutUser() {
  localStorage.removeItem(LOGGED_IN_KEY);
}

/**
 * Get all registered users.
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save an answer submission to localStorage.
 */
export function saveSubmission({ userName, questionIndex, answer }) {
  const key = "codearena_submissions";
  let submissions = [];
  try {
    submissions = JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    submissions = [];
  }
  submissions.push({
    userName,
    questionIndex,
    answer,
    submittedAt: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(submissions));
}
