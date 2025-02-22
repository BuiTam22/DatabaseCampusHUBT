import React, { useState } from 'react';
import {
  Box, TextField, Button, IconButton, Stack,
  Typography, Avatar, Select, MenuItem,
  FormControl, InputLabel, Alert, Divider
} from '@mui/material';
import {
  Image as ImageIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ApiService from '../../services/apiService';
import AuthService from '../../services/authService';

const PostForm = ({ onSuccess, onError }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [type, setType] = useState('NORMAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = AuthService.getCurrentUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('type', type);
      if (media) {
        formData.append('media', media);
      }

      const newPost = await ApiService.createPost(formData);
      onSuccess(newPost);
      setContent('');
      setMedia(null);
      setType('NORMAL');
    } catch (err) {
      const errorMsg = err.message || 'Failed to create post';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Avatar src={user?.image} />
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight="medium">
            {user?.fullName}
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 120, mt: 1 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="NORMAL">Normal</MenuItem>
              <MenuItem value="ANNOUNCEMENT">Announcement</MenuItem>
              <MenuItem value="EVENT">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      {media && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <img
            src={URL.createObjectURL(media)}
            alt="Preview"
            style={{ 
              width: '100%',
              maxHeight: 300,
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
          <IconButton
            onClick={() => setMedia(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <input
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          id="media-input"
          onChange={(e) => setMedia(e.target.files[0])}
          disabled={loading}
        />
        <label htmlFor="media-input">
          <IconButton component="span" disabled={loading}>
            <ImageIcon />
          </IconButton>
        </label>

        <Button
          variant="contained"
          type="submit"
          disabled={loading || (!content.trim() && !media)}
        >
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </Stack>
    </Box>
  );
};

export default PostForm;
