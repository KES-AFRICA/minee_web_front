/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.eneo-actifs.cm",
  timeout: 10000,
});

// Intercepteur pour injecter le token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("eneo_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials);
    localStorage.setItem("eneo_token", response.data.token);
    return response.data.user;
  },
};

export const assetService = {
  getAll: () => api.get("/assets"),
  // ... autres fonctions
};
