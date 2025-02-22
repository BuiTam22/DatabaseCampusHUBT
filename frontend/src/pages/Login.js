import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import AuthService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usernameOrEmail || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await AuthService.login(formData);
      
      if (!response?.token) {
        throw new Error('Login failed - No token received');
      }

      // Kiểm tra user data từ response luôn
      if (!response.userID || !response.username) {
        throw new Error('Invalid user data received');
      }

      // Login thành công, chuyển hướng đến Dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 403) {
        setError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.');
      } else if (err.response?.status === 401) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
      AuthService.clearAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Đăng nhập
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username hoặc Email"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;