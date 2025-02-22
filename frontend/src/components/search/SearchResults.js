import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper,
  Popper,
  ClickAwayListener
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, anchorEl, onClose, searchQuery }) => {
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  // Thêm log để debug
  console.log('SearchResults props:', { results, searchQuery });
  
  const validResults = Array.isArray(results) ? results : [];
  console.log('Valid results:', validResults);

  if (!open) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ width: anchorEl?.offsetWidth, zIndex: 1400 }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper elevation={3} sx={{ mt: 1, maxHeight: 400, overflow: 'auto' }}>
          {validResults.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {searchQuery?.length >= 2 ? 'Do Not User' : 'Enter at least 2 characters'}
              </Typography>
            </Box>
          ) : (
            <List>
              {validResults.map((user) => (
                <ListItem
                  key={user.userID}
                  button
                  onClick={() => handleUserClick(user.userID)}
                  sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <ListItemAvatar>
                    <Avatar src={user.image} alt={user.username}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.fullName || user.username}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          @{user.username}
                        </Typography>
                        {user.role && (
                          <Typography variant="caption" color="primary">
                            {user.role}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default SearchResults; 