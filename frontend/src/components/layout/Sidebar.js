import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Leaderboard as LeaderboardIcon,
  SmartToy as AIIcon,
  PostAdd as PostIcon,
  Assignment as ExamIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import AuthService from '../../services/authService';

const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        await AuthService.getCurrentUser();
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Helper function to safely get user stats
  const getUserStats = () => {
    if (!user) return null;
    return {
      coursesEnrolled: user.stats?.coursesEnrolled || 0,
      coursesCompleted: user.stats?.coursesCompleted || 0,
      achievements: user.stats?.achievements || 0
    };
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Posts', icon: <PostIcon />, path: '/posts' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messaging' },
    { text: 'AI Chat', icon: <AIIcon />, path: '/ai/chat' },
    { text: 'Exams', icon: <ExamIcon />, path: '/exams' },
    { text: 'Rankings', icon: <LeaderboardIcon />, path: '/rankings' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings/account' },
  ];

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 64,
      left: 0,
      bottom: 0,
      width: isCollapsed ? 80 : 280,
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider',
      transition: 'width 0.3s ease',
      zIndex: 1200,
    }}>
      {/* Menu Header */}
      <Box sx={{ 
        height: 48, // Match height with menu items
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: isCollapsed ? 1 : 2.5, // Match padding with menu items
      }}>
        {!isCollapsed && (
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Menu
          </Typography>
        )}
        <IconButton 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          size="small"
          sx={{ 
            color: 'text.secondary',
            minWidth: 0,
            p: 1, // Consistent padding
          }}
        >
          {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ 
        height: 'calc(100% - 160px)',
        overflow: 'auto',
        pt: 0, // Remove top padding
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
      }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48, // Match height with header
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                },
                '&:hover': {
                  bgcolor: 'grey.50',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <Tooltip title={isCollapsed ? item.text : ''} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 3,
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {!isCollapsed && (
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    }
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Profile Section */}
      {!isCollapsed && (
        <Box sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}>
          {loading ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </Stack>
          ) : error ? (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          ) : user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                src={user.avatar} 
                alt={user.fullName}
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                {user.fullName?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  noWrap 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {user.fullName}
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                >
                  <Chip
                    label={user.role || 'Student'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 20 }}
                  />
                  {getUserStats() && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      noWrap
                    >
                      {getUserStats().coursesEnrolled} Courses
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
