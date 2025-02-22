import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Import only the specific icons we need
import {
  Add as AddIcon,
  PostAdd as PostAddIcon,
  WebStories as WebStoriesIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import ApiService from '../services/apiService';
import CreatePost from '../components/post/CreatePost';
import CreateStory from '../components/story/CreateStory';
import PostCard from '../components/post/PostCard';
import authService from '../services/authService';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const open = Boolean(anchorEl);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchPosts = async (pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);

      const token = authService.getToken();
      if (!token) {
        authService.logout();
        return;
      }

      const response = await ApiService.getFeedPosts(pageNum);
      
      if (response?.data) {
        const postsData = response.data.content || response.data;
        const mappedPosts = postsData.map(post => ({
          id: post.postId || post.id,
          content: post.content,
          user: {
            id: post.user?.userID,
            userID: post.user?.userID,
            fullName: post.user?.fullName,
            username: post.user?.username,
            image: post.user?.image ? `${process.env.REACT_APP_API_URL}/uploads/${post.user?.image}` : null,
            role: post.user?.role,
            status: post.user?.status
          },
          createdAt: post.createdAt,
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          sharesCount: post.sharesCount || 0,
          media: Array.isArray(post.mediaList) 
            ? post.mediaList.map(media => ({
                url: `${process.env.REACT_APP_API_URL}/uploads/${media.url}`,
                type: media.type || 'image',
                width: media.width,
                height: media.height
              }))
            : []
        }));

        setPosts(pageNum === 0 ? mappedPosts : prev => [...prev, ...mappedPosts]);
        setHasMore(!response.data.last);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        authService.logout();
      } else {
        setError(error.message || 'Failed to load posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.createPost(postData);

      if (response?.data) {
        const newPost = {
          id: response.data.postId,
          content: response.data.content,
          user: {
            id: currentUser.userID,
            userID: currentUser.userID,
            fullName: currentUser.fullName,
            username: currentUser.username,
            image: currentUser.image,
            role: currentUser.role,
            status: currentUser.status
          },
          createdAt: response.data.createdAt,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          media: Array.isArray(response.data.mediaList) 
            ? response.data.mediaList.map(media => ({
                url: `${process.env.REACT_APP_API_URL}/uploads/${media.url}`,
                type: media.type || 'image',
                width: media.width,
                height: media.height
              }))
            : []
        };

        setPosts(prevPosts => {
          const updatedPosts = [newPost, ...prevPosts];
          if (updatedPosts.length > 10) {
            setHasMore(true);
          }
          return updatedPosts;
        });

        handleClose();
        
        setSnackbarMessage('Post created successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response?.status === 401) {
        authService.logout();
      } else {
        setError('Failed to create post. Please try again.');
        setSnackbarMessage('Failed to create post');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = authService.getToken();
      if (!token) {
        authService.logout();
        return;
      }
      await ApiService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.response?.status === 401) {
        authService.logout();
      } else {
        setError('Failed to delete post');
      }
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          authService.logout();
          return;
        }

        const userResponse = await ApiService.getCurrentUser();
        if (userResponse?.data) {
          setCurrentUser(userResponse.data);
          await fetchPosts(0);
        }
      } catch (error) {
        console.error('Error initializing page:', error);
        if (error.response?.status === 401) {
          authService.logout();
        }
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    console.log('Current posts state:', posts);
  }, [posts]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowCreatePost(false);
    setShowCreateStory(false);
  };

  const handleCreate = (type) => {
    if (type === 'post') {
      setShowCreatePost(true);
      setShowCreateStory(false);
    } else if (type === 'story') {
      setShowCreatePost(false);
      setShowCreateStory(true);
    }
  };

  if (error) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setError(null);
            fetchPosts(0);
          }}
          sx={{ mt: 2, display: 'block', mx: 'auto' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Create Post Dialog */}
        {showCreatePost && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Create Post</Typography>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <CreatePost 
              onSubmit={handleCreatePost}
              onClose={handleClose}
              currentUser={currentUser}
              loading={loading}
            />
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              fontWeight: 'bold',
            }}
          >
            Latest Posts
          </Typography>
          
          <Box>
            <IconButton
              color="primary"
              onClick={handleClick}
              sx={{ 
                border: 1, 
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              width: showCreatePost || showCreateStory ? '500px' : '200px',
              padding: '8px',
              borderRadius: '12px',
              mt: 1,
              '& .MuiList-root': {
                padding: 0,
              }
            }
          }}
        >
          {!showCreatePost && !showCreateStory ? (
            // Show initial menu options
            <>
              <MenuItem 
                onClick={() => handleCreate('post')}
                sx={{ borderRadius: '8px', mb: 1, p: 1.5 }}
              >
                <ListItemIcon>
                  <PostAddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Create Post" />
              </MenuItem>

              <MenuItem 
                onClick={() => handleCreate('story')}
                sx={{ borderRadius: '8px', p: 1.5 }}
              >
                <ListItemIcon>
                  <WebStoriesIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Create Story" />
              </MenuItem>
            </>
          ) : showCreatePost ? (
            // Show create post form
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Create Post</Typography>
                <IconButton size="small" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <CreatePost 
                onClose={handleClose} 
                user={currentUser} 
                onSubmit={handleCreatePost} 
              />
            </Box>
          ) : (
            // Show create story form
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Create Story</Typography>
                <IconButton size="small" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <CreateStory onClose={handleClose} />
            </Box>
          )}
        </Menu>

        {/* Posts List */}
        <Box sx={{ mt: 3 }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDelete={handleDeletePost}
            />
          ))}

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => fetchPosts(page + 1)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Load More'}
              </Button>
            </Box>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">
                No posts yet. Be the first to create one!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Posts; 