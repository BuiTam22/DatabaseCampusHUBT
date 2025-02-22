import React from 'react';
import { Container, Typography, Box, Paper, Breadcrumbs, Link, Button } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 3 }}>
                    <Link
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                        href="/"
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Home
                    </Link>
                    <Typography color="text.primary">Terms of Service</Typography>
                </Breadcrumbs>

                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ mb: 3 }}
                    >
                        Back
                    </Button>

                    <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 700,
                            color: 'primary.main',
                            mb: 3
                        }}
                    >
                        Terms of Service
                    </Typography>
                    
                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary" 
                        sx={{ mb: 4, fontStyle: 'italic' }}
                    >
                        Last updated: February 20, 2024
                    </Typography>

                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                    }}>
                        <Section 
                            title="1. Acceptance of Terms"
                            content="By accessing and using Campus HUBT's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
                        />

                        <Section 
                            title="2. User Responsibilities"
                            content={[
                                "You must be a current student or staff member of HUBT to use this service.",
                                "You are responsible for maintaining the confidentiality of your account.",
                                "You agree to provide accurate and complete information when creating your account.",
                                "You must not use the service for any illegal or unauthorized purpose."
                            ]}
                        />

                        <Section 
                            title="3. Content Guidelines"
                            content={[
                                "Users must not post content that is illegal, offensive, or violates others' rights.",
                                "The platform reserves the right to remove any content that violates these guidelines.",
                                "Users retain ownership of their content but grant Campus HUBT a license to use it."
                            ]}
                        />

                        <Section 
                            title="4. Account Suspension"
                            content={[
                                "We reserve the right to suspend or terminate accounts that violate our terms.",
                                "Users will be notified of any violations before account suspension.",
                                "Suspended users may appeal through the provided channels."
                            ]}
                        />

                        <Section 
                            title="5. Service Modifications"
                            content={[
                                "We may modify or discontinue services at any time.",
                                "Users will be notified of significant changes to the service.",
                                "We are not liable for any modification or discontinuation of the service."
                            ]}
                        />

                        <Box sx={{ 
                            mt: 4, 
                            p: 3, 
                            bgcolor: 'primary.light', 
                            borderRadius: 2,
                            color: 'white'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Contact Information
                            </Typography>
                            <Typography>
                                For questions about these Terms of Service, please contact:
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Email: support@hubt.edu.vn<br />
                                Phone: 1900xxxx
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

const Section = ({ title, content }) => (
    <Box>
        <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                mb: 2
            }}
        >
            {title}
        </Typography>
        {Array.isArray(content) ? (
            content.map((item, index) => (
                <Typography 
                    key={index} 
                    paragraph
                    sx={{
                        pl: 2,
                        borderLeft: '3px solid',
                        borderColor: 'primary.light',
                        mb: 1.5
                    }}
                >
                    {item}
                </Typography>
            ))
        ) : (
            <Typography 
                paragraph
                sx={{
                    pl: 2,
                    borderLeft: '3px solid',
                    borderColor: 'primary.light'
                }}
            >
                {content}
            </Typography>
        )}
    </Box>
);

export default TermsOfService;