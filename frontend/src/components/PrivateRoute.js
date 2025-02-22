import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthService from '../services/authService';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return null; // hoặc loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute; 