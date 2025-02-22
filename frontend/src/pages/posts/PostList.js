import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  TextField,
  Fab,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    title: "Introduction to React",
    content: "Learn the basics of React and its core concepts...",
    type: "Tutorial",
    author: "John Doe",
    date: "2023-12-01",
    likes: 45,
    comments: 12
  },
  // Add more mock posts...
];

const PostCard = ({ post, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Chip label={post.type} size="small" color="primary" />
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {post.content}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            By {post.author} • {new Date(post.date).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {post.likes} likes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.comments} comments
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(post); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { onDelete(post.id); handleMenuClose(); }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

const PostList = () => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Posts</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            variant="outlined"
          >
            Filter
          </Button>
          <Button
            startIcon={<SortIcon />}
            variant="outlined"
          >
            Sort
          </Button>
        </Box>
      </Box>

      {/* Posts Grid */}
      <Grid container spacing={3}>
        {mockPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard 
              post={post}
              onEdit={(post) => console.log('Edit post:', post)}
              onDelete={(id) => console.log('Delete post:', id)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Floating Action Button for creating new post */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpenCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={handleFilterClose}>All Posts</MenuItem>
        <MenuItem onClick={handleFilterClose}>My Posts</MenuItem>
        <Divider />
        <MenuItem onClick={handleFilterClose}>Tutorial</MenuItem>
        <MenuItem onClick={handleFilterClose}>Announcement</MenuItem>
        <MenuItem onClick={handleFilterClose}>Event</MenuItem>
      </Menu>

      {/* Create Post Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Create New Post
          </Typography>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            margin="normal"
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpenCreateDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PostList;
