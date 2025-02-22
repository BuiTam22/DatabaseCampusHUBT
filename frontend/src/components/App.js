import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import AuthService from '../services/authService';
import { CircularProgress } from '@mui/material';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        if (!isAuth) {
          navigate('/login', { replace: true });
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return <CircularProgress />;
  }

  return isAuthenticated ? children : null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Redirect root to dashboard */}
        <Route 
          path="/" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App; 