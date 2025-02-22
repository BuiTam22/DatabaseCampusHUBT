import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { loginSuccess } from '../../store/slices/authSlice';
import axios from '../../utils/axios';

const validationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username should be at least 3 characters')
    .max(50, 'Username should not exceed 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password should be at least 6 characters')
    .max(40, 'Password should not exceed 40 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name should be at least 2 characters')
    .max(100, 'Full name should not exceed 100 characters')
});

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError(null);
    
    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      
      // Remove confirmPassword before sending to server
      const { confirmPassword, ...registrationData } = formData;
      
      // Send registration request
      const response = await axios.post('/api/auth/register', registrationData);
      
      const { token, ...user } = response.data;
      
      // Save token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update auth context
      dispatch(loginSuccess({ token, user }));
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle Yup validation errors
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        // Handle server errors
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Registration failed';
        setServerError(errorMessage);
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="fullName"
              label="Full Name"
              id="fullName"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;