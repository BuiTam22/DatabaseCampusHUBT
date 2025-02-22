import React from 'react';
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  IconButton,
  Card,
  Grid,
  Tooltip,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import authService from '../services/authService';

const Profile = () => {
  const user = authService.getCurrentUser();

  const stats = [
    { label: 'Posts', value: '156' },
    { label: 'Followers', value: '2.1k' },
    { label: 'Following', value: '890' },
  ];

  const skills = [
    { name: 'React', level: 'Expert' },
    { name: 'JavaScript', level: 'Expert' },
    { name: 'Node.js', level: 'Advanced' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
  ];

  const posts = [
    {
      id: 1,
      title: 'Introduction to React Hooks',
      content: 'Learn about the power of React Hooks and how they can simplify your code...',
      date: '2 days ago',
      likes: 234,
      comments: 45,
      image: 'https://source.unsplash.com/random/800x400?tech',
    },
    {
      id: 2,
      title: 'Building Scalable Applications',
      content: 'Best practices for building scalable and maintainable applications...',
      date: '5 days ago',
      likes: 187,
      comments: 32,
      image: 'https://source.unsplash.com/random/800x400?coding',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: 0, pb: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Avatar
                  src={user?.image}
                  alt={user?.fullName}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    border: '4px solid #fff',
                    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                >
                  Edit
                </Button>
              </Box>

              <Typography variant="h5" sx={{ mt: 3, mb: 1, textAlign: 'center', fontWeight: 600 }}>
                {user?.fullName}
              </Typography>
              <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                Senior Software Engineer
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
                <IconButton color="primary"><TwitterIcon /></IconButton>
                <IconButton color="primary"><LinkedInIcon /></IconButton>
                <IconButton color="primary"><GitHubIcon /></IconButton>
              </Box>

              <Stack spacing={2}>
                {[
                  { icon: <LocationIcon />, text: 'Hanoi, Vietnam' },
                  { icon: <SchoolIcon />, text: 'Computer Science' },
                  { icon: <EmailIcon />, text: user?.email },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                    {item.icon}
                    <Typography>{item.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Card>

            {/* Skills Card */}
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Skills</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Tooltip key={index} title={`${skill.level}`}>
                    <Chip
                      label={skill.name}
                      variant="outlined"
                      color="primary"
                    />
                  </Tooltip>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Content */}
          <Grid item xs={12} md={8}>
            {/* Stats Card */}
            <Card sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Typography color="text.secondary">{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Posts */}
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Posts</Typography>
            <Stack spacing={3}>
              {posts.map((post) => (
                <Card key={post.id} sx={{ borderRadius: 2 }}>
                  <Box sx={{ position: 'relative', paddingTop: '50%', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={post.image}
                      alt={post.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>{post.title}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>{post.content}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FavoriteIcon color="error" fontSize="small" />
                          <Typography variant="body2">{post.likes}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CommentIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{post.comments}</Typography>
                        </Box>
                        <IconButton size="small">
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
