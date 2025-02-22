import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      
      // Decode JWT to get user info
      const user = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux state
      dispatch(loginSuccess({ token, user }));
      
      // Redirect to home
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return null;
};

export default OAuth2RedirectHandler; 