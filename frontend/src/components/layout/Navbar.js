import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, ListItemIcon,
  InputBase, Badge, Box, alpha, Popover, Paper
} from '@mui/material';
import {
  Menu as MenuIcon, AccountCircle as ProfileIcon, Settings as SettingsIcon,
  ExitToApp as LogoutIcon, Search as SearchIcon, Notifications as NotificationsIcon
} from '@mui/icons-material';
import authService from '../../services/authService';
import debounce from 'lodash/debounce';
import SearchResults from '../search/SearchResults';
import ApiService from '../../services/apiService';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const searchInputRef = useRef(null);
  const user = authService.getCurrentUser();

  const notifications = useMemo(() => [
    { id: 1, text: 'New message from John', time: '5m ago' },
    { id: 2, text: 'You have a new follower', time: '10m ago' },
    { id: 3, text: 'Your post was liked', time: '30m ago' }
  ], []);

  const debouncedSearchHandler = useMemo(() => debounce(async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await ApiService.searchUsers(query);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  }, 300), []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchAnchorEl(searchInputRef.current);
    if (query.trim().length >= 2) debouncedSearchHandler(query);
    else setSearchResults([]);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#fff', color: '#333', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
          CampusHUBT
        </Typography>

        <Box sx={{ position: 'relative', backgroundColor: alpha('#000', 0.04), borderRadius: 20, width: '30%', minWidth: '200px', maxWidth: '400px' }}>
          <IconButton sx={{ position: 'absolute', p: 1 }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            ref={searchInputRef}
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setSearchAnchorEl(searchInputRef.current)}
            sx={{ width: '100%', pl: 6, py: 0.5, fontSize: '0.9rem' }}
          />
          <SearchResults results={searchResults} anchorEl={searchAnchorEl} onClose={() => setSearchResults([])} searchQuery={searchQuery} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '200px', justifyContent: 'flex-end' }}>
          <IconButton color="inherit" onClick={(e) => setNotificationsAnchorEl(e.currentTarget)} sx={{ mr: 2 }}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" edge="end" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar alt={user?.fullName} src={user?.image} sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <MenuItem onClick={() => {
            navigate('/profile');
            setAnchorEl(null);
          }}>
            <ListItemIcon>
              <ProfileIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}><ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>Settings</MenuItem>
          <MenuItem onClick={() => { authService.logout(); navigate('/login'); }}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>Logout</MenuItem>
        </Menu>

        <Popover anchorEl={notificationsAnchorEl} open={Boolean(notificationsAnchorEl)} onClose={() => setNotificationsAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ sx: { mt: 1.5, width: 320, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>
          <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</Typography>
            </Box>
            {notifications.map(({ id, text, time }) => (
              <MenuItem key={id} sx={{ py: 1.5, px: 2, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <Box><Typography variant="body2">{text}</Typography><Typography variant="caption" color="text.secondary">{time}</Typography></Box>
              </MenuItem>
            ))}
          </Paper>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
