import React, { useState, useEffect } from 'react';
import { useSidebar } from '../contexts/SidebarContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  LinearProgress,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Chip,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Group as GroupIcon,
  PostAdd as PostIcon,
  Message as MessageIcon,
  EmojiEvents as AchievementIcon,
  Assessment,
  TrendingUp,
  MoreVert,
  School as CourseIcon,
  Event as EventIcon,
  ArrowForward as ArrowIcon,
  Notifications as NotificationIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PostCard from '../components/PostCard';
import ApiService from '../services/apiService';

// Mock data for charts
const activityData = [
  { name: 'Mon', posts: 4, messages: 5, achievements: 2 },
  { name: 'Tue', posts: 3, messages: 8, achievements: 1 },
  { name: 'Wed', posts: 7, messages: 12, achievements: 3 },
  { name: 'Thu', posts: 5, messages: 6, achievements: 4 },
  { name: 'Fri', posts: 6, messages: 9, achievements: 2 },
  { name: 'Sat', posts: 8, messages: 15, achievements: 5 },
  { name: 'Sun', posts: 9, messages: 11, achievements: 3 }
];

const Dashboard = () => {
  const { isCollapsed } = useSidebar();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getPosts(page);
        
        console.log('Raw API Response:', response);

        // Kiểm tra và xử lý dữ liệu
        if (!response.content) {
          throw new Error('Định dạng dữ liệu không hợp lệ');
        }

        // Cập nhật state
        setPosts(prevPosts => (
          page === 1 ? response.content : [...prevPosts, ...response.content]
        ));

        // Cập nhật hasMore
        setHasMore(!response.last);

        // Kiểm tra nếu không có bài viết
        if (response.content.length === 0 && page === 1) {
          setError('Chưa có bài viết nào.');
        }

      } catch (err) {
        console.error('Chi tiết lỗi:', err);
        setError(err.message);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!posts.length) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography align="center">
          Chưa có bài viết nào.
        </Typography>
      </Container>
    );
  }

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'course',
      title: 'Started "Advanced Web Development"',
      time: '2 hours ago',
      icon: <CourseIcon color="primary" />,
    },
    {
      id: 2,
      type: 'event',
      title: 'Joined "Tech Meetup 2024"',
      time: '5 hours ago',
      icon: <EventIcon color="secondary" />,
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned "Code Master" badge',
      time: '1 day ago',
      icon: <AchievementIcon sx={{ color: '#FFD700' }} />,
    },
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Web Development Workshop',
      date: '2024-03-15',
      time: '14:00',
      participants: 45,
    },
    {
      id: 2,
      title: 'AI & ML Conference',
      date: '2024-03-20',
      time: '09:00',
      participants: 120,
    },
  ];

  // Mock data for course progress
  const courseProgress = [
    { name: 'Completed', value: 8 },
    { name: 'In Progress', value: 3 },
    { name: 'Not Started', value: 4 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 64,
      left: isCollapsed ? '80px' : '280px',
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1,
      borderLeft: '1px solid',
      borderColor: 'divider',
      transition: 'left 0.3s ease',
    }}>
      <Card
        elevation={0}
        sx={{ 
          height: '100%',
          display: 'flex',
          border: 'none',
          borderRadius: 0,
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        {/* Left Side - Overview */}
        <Box
          sx={{
            width: 320,
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
          }}
        >
          {/* Stats Overview */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatMiniCard
                  icon={<GroupIcon />}
                  title="Users"
                  value="1,234"
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={6}>
                <StatMiniCard
                  icon={<CourseIcon />}
                  title="Courses"
                  value="15"
                  color="#2e7d32"
                />
              </Grid>
              <Grid item xs={6}>
                <StatMiniCard
                  icon={<EventIcon />}
                  title="Events"
                  value="8"
                  color="#ed6c02"
                />
              </Grid>
              <Grid item xs={6}>
                <StatMiniCard
                  icon={<AchievementIcon />}
                  title="Badges"
                  value="98"
                  color="#9c27b0"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Recent Activities List */}
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '3px',
            }
          }}>
            <List>
              <ListItem sx={{ px: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Recent Activities
                </Typography>
              </ListItem>
              {recentActivities.map((activity) => (
                <ListItem 
                  key={activity.id}
                  sx={{
                    px: 2,
                    py: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.title}
                    secondary={activity.time}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Right Side - Main Content */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}>
            <Typography variant="h5" gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your progress and activities
            </Typography>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 3,
            bgcolor: 'grey.50',
          }}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<GroupIcon />}
                      title="Active Users"
                      value="1,234"
                      color="#1976d2"
                      progress={75}
                      trend="+12% this week"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<CourseIcon />}
                      title="Active Courses"
                      value="15"
                      color="#2e7d32"
                      progress={65}
                      trend="+3 new courses"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<EventIcon />}
                      title="Upcoming Events"
                      value="8"
                      color="#ed6c02"
                      progress={45}
                      trend="Next: Tomorrow"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      icon={<AchievementIcon />}
                      title="Achievements"
                      value="98"
                      color="#9c27b0"
                      progress={85}
                      trend="+5 this month"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Activity Chart */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">Activity Overview</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Weekly" color="primary" />
                      <Chip label="Monthly" variant="outlined" />
                    </Stack>
                  </Stack>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="posts" stroke="#1976d2" name="Posts" />
                      <Line type="monotone" dataKey="messages" stroke="#2e7d32" name="Messages" />
                      <Line type="monotone" dataKey="achievements" stroke="#ed6c02" name="Achievements" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Course Progress */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Course Progress</Typography>
                  <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={courseProgress}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {courseProgress.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
                      {courseProgress.map((item, index) => (
                        <Box key={item.name} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {item.name}
                          </Typography>
                          <Typography variant="h6" color={COLORS[index]}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Grid>

              {/* Upcoming Events */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
                  <List>
                    {upcomingEvents.map((event) => (
                      <ListItem 
                        key={event.id}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.light' }}>
                            <EventIcon color="secondary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={event.title}
                          secondary={`${event.date} at ${event.time} • ${event.participants} participants`}
                        />
                        <Button variant="outlined" size="small">
                          Join
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    endIcon={<ArrowIcon />}
                  >
                    View All Events
                  </Button>
                </Paper>
              </Grid>

              {/* Posts */}
              <Grid item xs={12}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                
                {loading && posts.length === 0 ? (
                  <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {Array.isArray(posts) && posts.map((post) => (
                      <Grid item xs={12} md={6} lg={4} key={post.id}>
                        <PostCard post={post} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                
                {hasMore && !loading && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setPage(prev => prev + 1)}
                    >
                      Tải thêm
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

// Mini stat card for left sidebar
const StatMiniCard = ({ icon, title, value, color }) => (
  <Card sx={{ 
    p: 1.5,
    bgcolor: `${color}08`,
    border: '1px solid',
    borderColor: `${color}22`,
  }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar
        sx={{ 
          width: 32,
          height: 32,
          bgcolor: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="subtitle1" fontWeight="medium">
          {value}
        </Typography>
      </Box>
    </Stack>
  </Card>
);

// StatCard component with added trend indicator
const StatCard = ({ icon, title, value, color, progress, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 40, height: 40 }}>
          {icon}
        </Avatar>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'success.main',
            bgcolor: 'success.light',
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {trend}
        </Typography>
      </Stack>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 6, 
          borderRadius: 5,
          bgcolor: `${color}15`,
          '& .MuiLinearProgress-bar': {
            bgcolor: color
          }
        }} 
      />
    </CardContent>
  </Card>
);

export default Dashboard;