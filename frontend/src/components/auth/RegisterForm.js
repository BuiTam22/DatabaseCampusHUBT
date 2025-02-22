import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    School as SchoolIcon
} from '@mui/icons-material';
import AuthService from '../../services/authService';
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
    marginBottom: theme.spacing(0.5),
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

const LicenseText = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    textAlign: 'center',
    marginTop: theme.spacing(1),
    '& a': {
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        school: '',
        fullName: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const [showPasswordGuide, setShowPasswordGuide] = useState(false);
    const [showUsernameGuide, setShowUsernameGuide] = useState(false);

    useEffect(() => {
        const loadSchools = async () => {
            try {
                const schoolsList = await schoolService.getSchools();
                setSchools(schoolsList);
            } catch (error) {
                setError('Failed to load schools list');
            }
        };
        loadSchools();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Show guides when user starts typing
        if (name === 'password' && !showPasswordGuide) {
            setShowPasswordGuide(true);
        }
        if (name === 'username' && !showUsernameGuide) {
            setShowUsernameGuide(true);
        }
    };

    // Tính toán ngày tối đa (người dùng phải ít nhất 13 tuổi)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13);
    const formattedMaxDate = maxDate.toISOString().split('T')[0];

    // Tính toán ngày tối thiểu (giả sử người dùng không quá 100 tuổi)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    const formattedMinDate = minDate.toISOString().split('T')[0];

    const validateForm = () => {
        const errors = {};
        
        // Validate username
        if (formData.username.length < 3 || formData.username.length > 50) {
            errors.username = 'Username must be between 3 and 50 characters';
        }
        
        // Validate password - chỉ yêu cầu độ dài tối thiểu 8 ký tự
        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Validate fullName
        if (formData.fullName.length < 2 || formData.fullName.length > 100) {
            errors.fullName = 'Full name must be between 2 and 100 characters';
        }

        // Validate school
        if (!formData.school) {
            errors.school = 'Please select your school';
        }

        // Validate dateOfBirth
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = 'Please enter your date of birth';
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            // Kiểm tra tuổi tối thiểu (13 tuổi)
            if (age < 13) {
                errors.dateOfBirth = 'You must be at least 13 years old to register';
            }
            
            // Kiểm tra tuổi hợp lý (dưới 100 tuổi)
            if (age > 100) {
                errors.dateOfBirth = 'Please enter a valid date of birth';
            }
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setError(Object.values(validationErrors).join(', '));
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            await AuthService.register(registerData);
            navigate('/login', { 
                state: { message: 'Registration successful! Please login.' } 
            });
        } catch (err) {
            if (err.message.includes('disabled')) {
                setError('Your account has been disabled. Please contact support for assistance.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setError(`${provider} registration is not available yet. Please use email registration.`);
    };

    // Handle password field focus
    const handlePasswordFocus = () => {
        setShowPasswordGuide(true);
    };

    // Handle password field blur
    const handlePasswordBlur = () => {
        if (!formData.password) {
            setShowPasswordGuide(false);
        }
    };

    // Add username field handlers
    const handleUsernameFocus = () => {
        setShowUsernameGuide(true);
    };

    const handleUsernameBlur = () => {
        if (!formData.username) {
            setShowUsernameGuide(false);
        }
    };

    return (
        <>
            <AuthBackground />
            <AuthContainer>
                <StyledPaper elevation={0}>
                    <FormSide>
                        <Box sx={{ mb: 4 }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h2>
                            <p style={{ color: '#64748b' }}>Join our academic community</p>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        onFocus={handleUsernameFocus}
                                        onBlur={handleUsernameBlur}
                                        helperText={showUsernameGuide ? 
                                            "Username must be between 3 and 50 characters" : " "}
                                        error={error && error.includes('Username must be')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={handlePasswordFocus}
                                        onBlur={handlePasswordBlur}
                                        helperText={showPasswordGuide ? 
                                            "Password must be at least 8 characters long" : " "}
                                        error={error && error.includes('Password must be')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        helperText={error && error.includes('Passwords do not match') ? 
                                            'Passwords do not match' : " "}
                                        error={error && error.includes('Passwords do not match')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        select
                                        required
                                        fullWidth
                                        label="Trường học"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {schools.map((school) => (
                                            <MenuItem key={school} value={school}>
                                                {school}
                                            </MenuItem>
                                        ))}
                                    </StyledTextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            min: formattedMinDate,
                                            max: formattedMaxDate
                                        }}
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        helperText="You must be at least 13 years old"
                                        error={error && error.includes('date of birth')}
                                    />
                                </Grid>
                            </Grid>

                            <StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </StyledButton>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Button
                                        onClick={() => navigate('/login')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Sign in
                                    </Button>
                                </Typography>
                            </Box>
                        </Box>
                    </FormSide>

                    <BrandingSide>
                        <Logo>
                            <h1>Social HUBT</h1>
                            <p>Join Our Community!</p>
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
                            mt: 2,
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            textAlign: 'center'
                        }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    mb: 1
                                }}
                            >
                                By creating an account, you agree to our
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Link 
                                    href="/terms" 
                                    target="_blank"
                                    sx={{ 
                                        color: '#fff',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Terms of Service
                                </Link>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>and</Typography>
                                <Link 
                                    href="/privacy" 
                                    target="_blank"
                                    sx={{ 
                                        color: '#fff',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Privacy Policy
                                </Link>
                            </Box>
                        </Box>

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

export default RegisterForm; 