import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AuthService from '../../services/authService';
import { useSidebar } from '../../contexts/SidebarContext';

const AuthLayout = () => {
  const { isCollapsed } = useSidebar();

  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8, // for navbar height
          ml: isCollapsed ? '80px' : '280px', // match sidebar width
          transition: 'margin-left 0.3s ease',
          width: `calc(100% - ${isCollapsed ? '80px' : '280px'})`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;