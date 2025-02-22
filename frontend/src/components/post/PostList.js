import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, CircularProgress, Alert, Fade, Button, Card, CardContent, Avatar, Stack, Skeleton, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { Post } from '../../models/Post';
import AuthService from '../../services/authService';
import ApiService from '../../services/apiService';
import PostForm from './PostForm';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1) => {
    if (!mountedRef.current || !AuthService.isAuthenticated()) {
      AuthService.handleUnauthorized();
      return;
    }

    try {
      setError(null);
      if (pageNum === 1) {
        setLoading(true);
      }

      const data = await ApiService.getPosts(pageNum);
      
      if (!mountedRef.current) return;
      
      const postsData = data.posts || data.content || data;
      const hasMoreData = data.hasMore || data.hasNext || false;
      
      const newPosts = postsData.map(post => new Post(post));
      setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(hasMoreData);
      setPage(pageNum);
    } catch (error) {
      if (mountedRef.current) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
    return () => {
      mountedRef.current = false;
      setMounted(false);
    };
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handlePostCreated = useCallback((newPost) => {
    if (!mountedRef.current) return;
    setPosts(prevPosts => [new Post(newPost), ...prevPosts]);
  }, []);

  const handleOpenCreatePost = () => setOpenCreateDialog(true);
  const handleCloseCreatePost = () => setOpenCreateDialog(false);

  return (
    <Box 
      sx={{
        maxWidth: '680px',
        mx: 'auto', // Center content
        width: '100%',
        px: { xs: 0, sm: 2 }, // Responsive padding
      }}
    >
      {/* Create Post Card */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={AuthService.getCurrentUser()?.image} />
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                bgcolor: 'grey.100',
                borderRadius: '20px',
                px: 100,
                '&:hover': {
                  bgcolor: 'grey.200'
                }
              }}
              onClick={handleOpenCreatePost}
            >
              What's on your mind?
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Create Post Dialog */}
      <Dialog 
        open={openCreateDialog}
        onClose={handleCloseCreatePost}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Create Post
          <IconButton onClick={handleCloseCreatePost}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <PostForm 
            onSuccess={(newPost) => {
              handlePostCreated(newPost);
              handleCloseCreatePost();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Posts List */}
      <Stack spacing={2}>
        {loading && page === 1 ? (
          [...Array(3)].map((_, i) => (
            <Skeleton 
              key={i} 
              variant="rectangular" 
              height={300}
              sx={{ borderRadius: 2 }}
            />
          ))
        ) : (
          posts.map((post) => (
            <PostCard key={post.postID} post={post} />
          ))
        )}
      </Stack>

      {/* Load More */}
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outlined"
            sx={{ borderRadius: 5 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'See More Posts'
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(PostList);