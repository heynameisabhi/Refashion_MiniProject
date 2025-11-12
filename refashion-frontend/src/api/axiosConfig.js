import axios from 'axios';

// Use /api prefix to leverage Vite's proxy in development
// In production, set VITE_API_BASE_URL to your actual API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const storage = typeof window !== 'undefined' ? window.localStorage : null;

axiosInstance.interceptors.request.use((config) => {
  const storedToken = storage?.getItem('refashion_token');
  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      storage?.removeItem('refashion_token');
      storage?.removeItem('refashion_user');
    }
    return Promise.reject(error);
  },
);

export const setAuthToken = (token) => {
  if (token) {
    storage?.setItem('refashion_token', token);
  } else {
    storage?.removeItem('refashion_token');
  }
};

export const setUser = (user) => {
  if (user) {
    storage?.setItem('refashion_user', JSON.stringify(user));
  } else {
    storage?.removeItem('refashion_user');
  }
};

export const getStoredAuth = () => {
  if (!storage) {
    return { token: null, user: null };
  }
  const token = storage.getItem('refashion_token');
  const userRaw = storage.getItem('refashion_user');
  return {
    token,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
};

export default axiosInstance;

