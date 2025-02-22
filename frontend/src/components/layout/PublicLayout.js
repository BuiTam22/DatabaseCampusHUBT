import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthService from '../../services/authService';

const PublicLayout = () => {
  // Redirect to home if already authenticated
  if (AuthService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Outlet />
    </Box>
  );
};

export default PublicLayout; 