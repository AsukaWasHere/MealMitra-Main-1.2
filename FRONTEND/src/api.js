import axios from "axios";

const API = axios.create({
  // Point to your existing backend on port 5001
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5001",
  headers: { "Content-Type": "application/json" }
});

// This interceptor correctly attaches the token to every request
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;