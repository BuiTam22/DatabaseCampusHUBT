import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Alert,
    Paper,
    Divider,
    IconButton,
    Grid,
    Typography,
    MenuItem,
    Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    Google as GoogleIcon,
    Facebook as FacebookIcon,
    GitHub as GitHubIcon,
    Microsoft as MicrosoftIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import authService from '../../services/authService';
import schoolService from '../../services/schoolService';

const AuthBackground = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    zIndex: -1
});

const AuthContainer = styled('div')({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
});

const StyledPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minHeight: '600px',
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '30px',
    overflow: 'hidden',
    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        maxWidth: '1000px'
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        maxWidth: '450px'
    }
}));

const FormSide = styled(Box)(({ theme }) => ({
    flex: '1',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column'
}));

const BrandingSide = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    [theme.breakpoints.up('md')]: {
        width: '40%'
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3)
    }
}));

const Logo = styled('div')(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    '& h1': {
        fontSize: '2.5rem',
        fontWeight: 800,
        marginBottom: theme.spacing(1),
        background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    '& p': {
        color: '#e3f2fd',
        fontSize: '1.1rem'
    }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        borderRadius: '15px',
        backgroundColor: '#f8fafc',
        '&:hover': {
            backgroundColor: '#f1f5f9'
        },
        '&.Mui-focused': {
            backgroundColor: '#fff',
            '& fieldset': {
                borderWidth: '2px',
                borderColor: theme.palette.primary.main
            }
        }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: theme.palette.primary.main
        }
    },
    '& .MuiSelect-select': {
        paddingTop: '12px',
        paddingBottom: '12px'
    },
    '& .MuiMenu-paper': {
        maxHeight: '300px'
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '15px',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
}));

const SocialButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '10px',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(2)
    }
}));

const FeatureList = styled('ul')(({ theme }) => ({
    listStyle: 'none',
    padding: 0,
    margin: theme.spacing(4, 0),
    '& li': {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        color: '#e3f2fd',
        '& svg': {
            marginRight: theme.spacing(1)
        }
    }
}));

const IconOnlyButton = styled(IconButton)(({ theme }) => ({
    width: '50px',
    height: '50px',
    margin: '0 8px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    opacity: 0.6,
    cursor: 'not-allowed',
    '&:hover': {
        opacity: 0.6,
        backgroundColor: '#ffffff'
    }
}));

const LicenseText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    textAlign: 'center',
    marginTop: theme.spacing(4),
    '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authService.login(formData);
            
            if (result.success) {
                navigate(location.state?.from || '/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            
            // Show additional guidance if account is disabled
            if (err.message.includes('disabled')) {
                setError(prev => `${prev}\n\nTo reactivate your account, please:\n1. Contact administrator via email support@hubt.edu.vn\n2. Or call hotline: 1900xxxx`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setError(`${provider} login is not available yet. Please use email login.`);
    };

    return (
        <>
            <AuthBackground />
            <AuthContainer>
                <StyledPaper elevation={0}>
                    <FormSide>
                        <Box sx={{ mb: 4 }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h2>
                            <p style={{ color: '#64748b' }}>Sign in to your account</p>
                        </Box>

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 3, 
                                    borderRadius: '12px',
                                    '& .MuiAlert-message': {
                                        whiteSpace: 'pre-line'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                                {success}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Username or Email"
                                        name="usernameOrEmail"
                                        autoComplete="email"
                                        autoFocus
                                        value={formData.usernameOrEmail}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </StyledButton>

                            <Divider sx={{ my: 3 }}>Coming Soon</Divider>

                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                mt: 2,
                                mb: 3 
                            }}>
                                <IconOnlyButton
                                    onClick={() => handleSocialLogin('Google')}
                                    sx={{ color: '#DB4437' }}
                                >
                                    <GoogleIcon />
                                </IconOnlyButton>

                                <IconOnlyButton
                                    onClick={() => handleSocialLogin('Facebook')}
                                    sx={{ color: '#1877f2' }}
                                >
                                    <FacebookIcon />
                                </IconOnlyButton>

                                <IconOnlyButton
                                    onClick={() => handleSocialLogin('GitHub')}
                                    sx={{ color: '#24292e' }}
                                >
                                    <GitHubIcon />
                                </IconOnlyButton>

                                <IconOnlyButton
                                    onClick={() => handleSocialLogin('Microsoft')}
                                    sx={{ color: '#00a4ef' }}
                                >
                                    <MicrosoftIcon />
                                </IconOnlyButton>
                            </Box>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Button
                                        onClick={() => navigate('/register')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Sign up
                                    </Button>
                                </Typography>
                            </Box>

                            <Divider sx={{ mt: 4, mb: 2 }} />
                        </Box>
                    </FormSide>

                    <BrandingSide>
                        <Logo>
                            <h1>Social HUBT</h1>
                            <p>Welcome Back!</p>
                        </Logo>
                        
                        <FeatureList>
                            <li>
                                <SchoolIcon /> Access your academic resources
                            </li>
                            <li>
                                <SchoolIcon /> Connect with your classmates
                            </li>
                            <li>
                                <SchoolIcon /> Stay updated with campus news
                            </li>
                            <li>
                                <SchoolIcon /> Participate in discussions
                            </li>
                        </FeatureList>

                        <Box sx={{ 
                            mt: 'auto', 
                            pt: 2,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <LicenseText sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                '& a': {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        color: '#fff'
                                    }
                                }
                            }}>
                                © 2024 Campus HUBT. All rights reserved.
                            </LicenseText>
                            <LicenseText sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                '& a': {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        color: '#fff'
                                    }
                                }
                            }}>
                                By using this service, you agree to our{' '}
                                <Link href="/terms" target="_blank">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/privacy" target="_blank">Privacy Policy</Link>
                            </LicenseText>
                            <LicenseText sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                '& a': {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        color: '#fff'
                                    }
                                }
                            }}>
                                Version 1.0.0 | Developed by{' '}
                                <Link href="https://github.com/ducquyen199" target="_blank">
                                    Nguyen Duc Quyen
                                </Link>
                            </LicenseText>
                        </Box>
                    </BrandingSide>
                </StyledPaper>
            </AuthContainer>
        </>
    );
};

export default LoginForm;