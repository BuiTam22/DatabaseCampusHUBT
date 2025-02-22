import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { xs: 2, sm: 4, md: 30 }, // Responsive margin
          mr: { xs: 2, sm: 4 }, // Add right margin for balance
          width: '100%',
          maxWidth: 'calc(100vw - 240px)', // Account for sidebar
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;