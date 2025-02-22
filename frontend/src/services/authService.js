import axios from '../utils/axios';
import { API_BASE_URL } from '../config';

const AUTH_API = `${API_BASE_URL}/auth`;

class AuthService {
  constructor() {
    this.currentUser = null;
    this.fetchingUser = null;
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token || !this.isValidToken(token)) {
        this.clearAuth();
        return null;
      }

      // Thử lấy từ cache trước
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        this.currentUser = JSON.parse(cachedUser);
        return this.currentUser;
      }

      // Nếu không có cache, gọi API
      const response = await axios.get(`${AUTH_API}/me`);
      if (response.data) {
        this.currentUser = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        return this.currentUser;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuth();
      return null;
    }
  }

  handleUnauthorized() {
    this.clearAuth();
    window.location.href = '/login';
  }

  clearAuth() {
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async register(registerData) {
    try {
      const response = await axios.post(`${AUTH_API}/register`, registerData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      this.clearAuth(); // Xóa token cũ
      
      const response = await axios.post(`${AUTH_API}/login`, credentials);
      const { token, ...userData } = response.data;
      
      if (!token) {
        throw new Error('Login failed - No token received');
      }

      // Lưu token và user data
      this.setToken(token);
      this.currentUser = userData;
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${AUTH_API}/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = localStorage.getItem('user');
    return token && this.isValidToken(token) && user;
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  setToken(token) {
    if (!token) {
      return;
    }
    localStorage.setItem('token', token);
  }

  setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isValidToken(token) {
    if (!token) return false;
    try {
      // Kiểm tra token format
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Kiểm tra expiration
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch {
      return false;
    }
  }
}

export default new AuthService();