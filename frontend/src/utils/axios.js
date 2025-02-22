import axios from 'axios';
import authService from '../services/authService';
import { API_BASE_URL } from '../config';

const AUTH_API = `${API_BASE_URL}/auth`;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  config => {
    // Không thêm token cho login request
    if (config.url === '/auth/login') {
      return config;
    }

    const token = authService.getToken();
    if (token && authService.isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      authService.clearAuth();
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${AUTH_API}/refresh-token`, 
          { refreshToken },
          { skipAuthRefresh: true }
        );

        const { token } = response.data;
        if (!token || !authService.isValidToken(token)) {
          throw new Error('Invalid refresh token response');
        }

        authService.setToken(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        authService.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;