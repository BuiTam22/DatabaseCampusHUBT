import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NotFound = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const getMessage = () => {
        if (currentUser && currentUser.role !== 'ADMIN') {
            return "You don't have permission to access this page. This area is restricted to administrators only.";
        }
        return "The page you're looking for doesn't exist or has been moved.";
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                    py: 8
                }}
            >
                <Typography 
                    variant="h1" 
                    color="primary" 
                    sx={{ 
                        mb: 2,
                        fontSize: { xs: '4rem', md: '6rem' },
                        fontWeight: 'bold'
                    }}
                >
                    404
                </Typography>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: 3,
                        fontWeight: 'medium'
                    }}
                >
                    Access Denied
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mb: 4 }}
                >
                    {getMessage()}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{ 
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem'
                    }}
                >
                    Return to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound; 