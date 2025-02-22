import React from 'react';
import { Container, Typography, Box, Paper, Breadcrumbs, Link, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
    Home as HomeIcon, 
    ArrowBack as ArrowBackIcon,
    Security as SecurityIcon,
    Person as PersonIcon,
    Share as ShareIcon,
    Lock as LockIcon,
    Gavel as GavelIcon,
    Cookie as CookieIcon,
    ContactSupport as ContactIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                    <Typography color="text.primary">Privacy Policy</Typography>
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
                        Privacy Policy
                    </Typography>

                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary" 
                        sx={{ mb: 4, fontStyle: 'italic' }}
                    >
                        Last updated: February 20, 2024
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <PolicySection
                            icon={<PersonIcon />}
                            title="1. Information We Collect"
                            items={[
                                "Name and contact information",
                                "Student ID and academic information",
                                "Profile information and photos",
                                "Login credentials"
                            ]}
                        />

                        <PolicySection
                            icon={<SecurityIcon />}
                            title="2. How We Use Your Information"
                            items={[
                                "Provide and maintain our services",
                                "Authenticate your identity",
                                "Send important notifications",
                                "Improve our services",
                                "Respond to your requests"
                            ]}
                        />

                        <PolicySection
                            icon={<ShareIcon />}
                            title="3. Information Sharing"
                            items={[
                                "We do not sell your personal information",
                                "HUBT administrators and faculty",
                                "Service providers who assist in operating our platform",
                                "Law enforcement when required by law"
                            ]}
                        />

                        <PolicySection
                            icon={<LockIcon />}
                            title="4. Data Security"
                            items={[
                                "We implement security measures to protect your data",
                                "We use encryption for sensitive information",
                                "We regularly monitor for security threats"
                            ]}
                        />

                        <PolicySection
                            icon={<GavelIcon />}
                            title="5. Your Rights"
                            items={[
                                "Access your personal information",
                                "Correct inaccurate information",
                                "Request deletion of your data",
                                "Opt-out of certain data collection"
                            ]}
                        />

                        <PolicySection
                            icon={<CookieIcon />}
                            title="6. Cookies and Tracking"
                            items={[
                                "We use cookies to improve user experience",
                                "You can control cookie settings in your browser",
                                "We collect usage data to analyze service performance"
                            ]}
                        />

                        <Box sx={{ 
                            mt: 4, 
                            p: 3, 
                            bgcolor: 'primary.light', 
                            borderRadius: 2,
                            color: 'white'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ContactIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Contact Us
                                </Typography>
                            </Box>
                            <Typography>
                                For privacy-related questions or concerns, contact:
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Email: privacy@hubt.edu.vn<br />
                                Phone: 1900xxxx<br />
                                Address: HUBT Campus, Hanoi, Vietnam
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

const PolicySection = ({ icon, title, items }) => (
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
                mr: 2, 
                color: 'primary.main',
                display: 'flex'
            }}>
                {icon}
            </Box>
            <Typography 
                variant="h5"
                sx={{ 
                    color: 'primary.main',
                    fontWeight: 600
                }}
            >
                {title}
            </Typography>
        </Box>
        <List sx={{ pl: 6 }}>
            {items.map((item, index) => (
                <ListItem 
                    key={index}
                    sx={{ 
                        pl: 0,
                        borderLeft: '3px solid',
                        borderColor: 'primary.light',
                        ml: 2
                    }}
                >
                    <ListItemText 
                        primary={item}
                        primaryTypographyProps={{
                            sx: { pl: 2 }
                        }}
                    />
                </ListItem>
            ))}
        </List>
    </Box>
);

export default PrivacyPolicy; 