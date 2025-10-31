import axios from "axios";
import { useAuthStore } from "@store/useAuthStore";

const BASE_URL =
  // process.env.EXPO_PUBLIC_API_URL || "http://192.168.110.13:3000/api";
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.20:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default api;
