import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true
});

/* ───────── LOGIN ───────── */

export async function loginUser(name) {
  try {
    const { data } = await client.post("/login_url/", { name });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Login failed");
  }
}

/* ───────── REGISTER ───────── */

export async function registerUser({ name, department, year }) {
  try {
    const { data } = await client.post("/register_url/", {
      name,
      department,
      year
    });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Registration failed");
  }
}

/* ───────── SUBMIT ANSWER ───────── */

export async function submitAnswer({ name, answer }) {
  try {
    const { data } = await client.post("/submit/", {
      name,
      answer
    });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Submission failed");
  }
}