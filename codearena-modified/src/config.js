/**
 * Application configuration
 * 
 * Uses Vite environment variables (prefixed with VITE_)
 * Set these in .env.local for local development or in Railway dashboard for production
 */

// Backend API URL (Django)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Build full API endpoint URLs
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login_url/`,
  register: `${API_BASE_URL}/register_url/`,
  generateQuestionOrder: `${API_BASE_URL}/generate_question_order/`,
  submit: `${API_BASE_URL}/submit/`,
  runCode: `${API_BASE_URL}/run_code/`,
};
