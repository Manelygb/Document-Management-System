// axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Add JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`, // ✅ FIXED
    };
  }
  return config;
});


// Add this utility function
export const debugLog = (scope: string, data: any) => {
  if (import.meta.env.MODE === "development") {
    console.log(`[${scope}]`, data);
  }
};

export default API;
