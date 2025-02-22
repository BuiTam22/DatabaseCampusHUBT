import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Avatar,
  Typography,
  IconButton,
  styled,
  Skeleton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from '../../utils/axios'; // Using our configured axios instance

const StoryCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: 120,
  height: 200,
  borderRadius: theme.spacing(1),
  marginRight: theme.spacing(1),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
}));

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using the base URL configured in axios instance
        const response = await axios.get('/stories');
        setStories(response.data || []);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(err.message || 'Failed to load stories');
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Fetch stories again
    fetchStories();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', overflowX: 'auto', pb: 1 }}>
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={120}
            height={200}
            sx={{ mr: 1, borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/stories');
      setStories(response.data || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.message || 'Failed to load stories');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {/* Create Story Card */}
        <StoryCard sx={{ background: 'white' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar
              src={currentUser?.image}
              sx={{
                width: 40,
                height: 40,
                mb: 1
              }}
            />
            <IconButton
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <AddIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Create Story
            </Typography>
          </Box>
        </StoryCard>

        {/* Story List */}
        {stories.filter(story => story?.id && story?.user).map((story) => (
          <StoryCard
            key={story.id}
            sx={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${story.imageUrl || ''})`
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                padding: 0.5,
                borderRadius: '50%',
                backgroundColor: 'primary.main'
              }}
            >
              <Avatar
                src={story.user?.image}
                alt={story.user?.fullName || story.user?.username}
                sx={{ width: 40, height: 40 }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                color: 'white',
                textShadow: '0 0 4px rgba(0,0,0,0.5)'
              }}
            >
              {story.user?.fullName || story.user?.username}
            </Typography>
          </StoryCard>
        ))}
      </Box>

      {/* Error Snackbar with Retry */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleRetry}
            >
              <AddIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Stories;