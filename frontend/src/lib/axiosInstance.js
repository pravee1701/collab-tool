import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
