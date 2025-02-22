import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  
  if (!AuthService.isAuthenticated()) {
    // Redirect to login with return url
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export default PrivateRoute;
