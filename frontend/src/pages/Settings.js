import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Stack,
  Alert,
  Card,
  Grid,
  Avatar,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  Save as SaveIcon,
  NotificationsActive as NotificationIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Security as SecurityIcon,
  Chat as ChatIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import authService from '../services/authService';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/settings/account') setActiveTab(0);
    else if (path === '/settings/preferences') setActiveTab(1);
    else if (path === '/settings/privacy') setActiveTab(2);
    else navigate('/settings/account');
  }, [location, navigate]);

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
    setSuccessMessage('');
    if (tabIndex === 0) navigate('/settings/account');
    else if (tabIndex === 1) navigate('/settings/preferences');
    else if (tabIndex === 2) navigate('/settings/privacy');
  };

  const SettingsTab = ({ icon, label, active, onClick }) => (
    <Card
      onClick={onClick}
      elevation={active ? 8 : 0}
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        background: active 
          ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
          : 'transparent',
        color: active ? 'white' : 'text.primary',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: active ? 'transparent' : 'divider',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: active ? 8 : 2,
          borderColor: 'transparent',
          background: active 
            ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
            : 'rgba(79, 70, 229, 0.1)',
        },
        borderRadius: 3,
      }}
    >
      <Avatar
        sx={{
          width: 45,
          height: 45,
          bgcolor: active ? 'rgba(255,255,255,0.2)' : 'primary.lighter',
          color: active ? 'white' : 'primary.main',
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: active ? 600 : 500 }}>
          {label}
        </Typography>
        <Typography variant="caption" color={active ? 'rgba(255,255,255,0.8)' : 'text.secondary'}>
          {label === 'Account' ? 'Personal & security' : 
           label === 'Preferences' ? 'Customize your experience' : 
           'Privacy controls'}
        </Typography>
      </Box>
    </Card>
  );

  const SectionCard = ({ title, icon, children, action }) => (
    <Card
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.lighter',
                color: 'primary.main',
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          {action}
        </Box>
        {children}
      </Stack>
    </Card>
  );

  const StyledTextField = ({ ...props }) => (
    <TextField
      {...props}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        },
      }}
    />
  );

  const AccountSettings = () => (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ 
        fontWeight: 700,
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2
      }}>
        Account Settings
      </Typography>

      <SectionCard 
        title="Personal Information" 
        icon={<PersonIcon />}
        action={
          <Tooltip title="Edit information">
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <Stack spacing={3}>
          <StyledTextField
            fullWidth
            label="Full Name"
            defaultValue={user?.fullName}
          />
          <StyledTextField
            fullWidth
            label="Email"
            defaultValue={user?.email}
            type="email"
          />
          <StyledTextField
            fullWidth
            label="Username"
            defaultValue={user?.username}
          />
        </Stack>
      </SectionCard>

      <SectionCard 
        title="Security" 
        icon={<SecurityIcon />}
      >
        <Stack spacing={3}>
          <StyledTextField
            fullWidth
            label="Current Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            fullWidth
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </SectionCard>

      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          alignSelf: 'flex-start',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
          },
          boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
        }}
      >
        Save Changes
      </Button>
    </Stack>
  );

  const PreferencesSettings = () => (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ 
        fontWeight: 700,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2
      }}>
        Preferences
      </Typography>

      <SectionCard title="Notifications" icon={<NotificationIcon />}>
        <Stack spacing={2}>
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Email notifications"
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Push notifications"
          />
          <FormControlLabel
            control={<Switch color="primary" />}
            label="SMS notifications"
          />
        </Stack>
      </SectionCard>

      <SectionCard title="Appearance" icon={<DarkModeIcon />}>
        <Stack spacing={2}>
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Dark mode"
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Show online status"
          />
        </Stack>
      </SectionCard>

      <SectionCard title="Language & Region" icon={<LanguageIcon />}>
        <TextField
          select
          fullWidth
          label="Language"
          defaultValue="en"
          SelectProps={{
            native: true,
          }}
        >
          <option value="en">English</option>
          <option value="vi">Vietnamese</option>
          <option value="es">Spanish</option>
        </TextField>
      </SectionCard>

      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          alignSelf: 'flex-start',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        }}
      >
        Save Preferences
      </Button>
    </Stack>
  );

  const PrivacySettings = () => (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ 
        fontWeight: 700,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 2
      }}>
        Privacy Settings
      </Typography>

      <SectionCard title="Profile Privacy" icon={<ShieldIcon />}>
        <Stack spacing={2}>
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Make profile public"
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Show email address"
          />
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Show phone number"
          />
        </Stack>
      </SectionCard>

      <SectionCard title="Post Privacy" icon={<ChatIcon />}>
        <Stack spacing={2}>
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Allow comments on posts"
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Show post likes count"
          />
        </Stack>
      </SectionCard>

      <SectionCard title="Activity Status" icon={<VisibilityIcon />}>
        <Stack spacing={2}>
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Show when I'm online"
          />
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Show when I'm typing"
          />
        </Stack>
      </SectionCard>

      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          alignSelf: 'flex-start',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        }}
      >
        Save Privacy Settings
      </Button>
    </Stack>
  );

  return (
    <Box sx={{ 
      bgcolor: '#f8fafc',
      minHeight: '100vh',
      pt: 4,
      pb: 4,
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      <Container maxWidth="lg">
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            }}
          >
            {successMessage}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
              <SettingsTab
                icon={<PersonIcon />}
                label="Account"
                active={activeTab === 0}
                onClick={() => handleTabChange(0)}
              />
              <SettingsTab
                icon={<SettingsIcon />}
                label="Preferences"
                active={activeTab === 1}
                onClick={() => handleTabChange(1)}
              />
              <SettingsTab
                icon={<ShieldIcon />}
                label="Privacy"
                active={activeTab === 2}
                onClick={() => handleTabChange(2)}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={9}>
            {activeTab === 0 && <AccountSettings />}
            {activeTab === 1 && <PreferencesSettings />}
            {activeTab === 2 && <PrivacySettings />}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Settings;
