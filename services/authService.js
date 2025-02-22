import ApiService from './apiService';
import { useNavigate } from 'react-router-dom';

class AuthService {
  redirectToLogin() {
    window.location.replace('/login');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(token) {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }

  async login(credentials) {
    try {
      const response = await ApiService.post('/auth/login', {
        usernameOrEmail: credentials.usernameOrEmail,
        password: credentials.password
      });

      // Trả về toàn bộ response data để xử lý ở component
      return response.data;
    } catch (error) {
      // Không tự động logout ở đây
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await ApiService.post('/auth/refresh-token', {
        refreshToken
      });

      if (response.data?.token) {
        this.setToken(response.data.token);
        return response.data.token;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      this.logout();
      this.redirectToLogin();
      throw error;
    }
  }

  async getAuthHeaderWithRefresh() {
    try {
      let token = this.getToken();
      
      if (!token || this.isTokenExpired(token)) {
        token = await this.refreshToken();
      }

      if (!token) {
        throw new Error('No valid token available');
      }

      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 <= Date.now();
    } catch (e) {
      return true;
    }
  }

  async isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  logout() {
    this.removeToken();
    this.setRefreshToken(null);
    localStorage.removeItem('user');
    this.redirectToLogin();
  }
}

export default new AuthService(); 