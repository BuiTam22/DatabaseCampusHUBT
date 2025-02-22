import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Stack,
  CardMedia,
  InputAdornment,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  AvatarGroup,
  Tab,
  Tabs,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../data/mockCourses';

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Language'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const { user } = useAuth();
  const canCreateCourse = user?.role === 'teacher' || user?.role === 'admin';
  const navigate = useNavigate();

  console.log('Current user:', user);

  const getLevelColor = (level) => {
    const colors = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336'
    };
    return colors[level] || '#4CAF50';
  };

  // Filter courses based on tab and search
  const filteredCourses = MOCK_COURSES?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || course.level === filter;
    
    // Filter for My Courses tab
    if (currentTab === 1) {
      const isInstructor = course.instructor === user?.fullName;
      const isEnrolled = course.enrolledStudents.users.some(
        student => student.name === user?.fullName || student.id === user?.id
      );
      
      console.log('Course:', course.title);
      console.log('User:', user);
      console.log('Is Instructor:', isInstructor);
      console.log('Is Enrolled:', isEnrolled);
      console.log('Enrolled Students:', course.enrolledStudents.users);
      
      return matchesSearch && matchesFilter && (isInstructor || isEnrolled);
    }
    
    return matchesSearch && matchesFilter;
  });

  // Tạm thời hardcode một số khóa học mẫu cho My Courses
  const mockMyCourses = {
    teaching: [
      {
        id: 1,
        title: "Advanced Web Development",
        description: "Master modern web development with JavaScript, React, and Node.js",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        level: "advanced",
        enrolledStudents: {
          count: 156,
          users: Array(3).fill().map((_, i) => ({
            avatar: `https://i.pravatar.cc/150?img=${i + 1}`
          }))
        },
        capacity: 200,
        instructor: "John Smith",
        progress: 80
      },
      {
        id: 2,
        title: "Mobile App Development",
        description: "Learn to build mobile apps with React Native",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
        level: "intermediate",
        enrolledStudents: {
          count: 85,
          users: Array(3).fill().map((_, i) => ({
            avatar: `https://i.pravatar.cc/150?img=${i + 4}`
          }))
        },
        capacity: 100,
        instructor: "John Smith",
        progress: 65
      }
    ],
    enrolled: [
      {
        id: 3,
        title: "UI/UX Design Masterclass",
        description: "Learn modern design principles and tools",
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
        level: "intermediate",
        instructor: "Sarah Johnson",
        progress: 45,
        enrolledStudents: {
          count: 98,
          users: Array(3).fill().map((_, i) => ({
            avatar: `https://i.pravatar.cc/150?img=${i + 7}`
          }))
        },
        capacity: 150
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Render My Courses section
  const renderMyCourses = () => {
    if (currentTab !== 1) return null;

    return (
      <>
        {/* Teaching Courses Section */}
        {mockMyCourses.teaching.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ 
              mb: 3,
              color: 'primary.main',
              fontWeight: 600 
            }}>
              Courses I Teach
            </Typography>
            <Grid container spacing={3}>
              {mockMyCourses.teaching.map((course) => (
                <Grid item xs={12} sm={6} lg={4} key={course.id}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={course.imageUrl}
                      alt={course.title}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          size="small"
                          label={course.level}
                          sx={{ bgcolor: getLevelColor(course.level), color: 'white' }}
                        />
                        <Chip 
                          size="small"
                          label={`${course.enrolledStudents.count} students`}
                        />
                      </Stack>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Course Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(course.enrolledStudents.count / course.capacity) * 100}
                          sx={{ height: 6, borderRadius: 3, mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                    <CardContent sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Stack direction="row" spacing={1}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<EditIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          Edit
                        </Button>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(`/courses/${course.id}/learn`)}
                          sx={{ 
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          }}
                        >
                          Continue Learning
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Enrolled Courses Section */}
        {mockMyCourses.enrolled.length > 0 && (
          <Box>
            <Typography variant="h5" sx={{ 
              mb: 3,
              color: 'primary.main',
              fontWeight: 600 
            }}>
              Enrolled Courses
            </Typography>
            <Grid container spacing={3}>
              {mockMyCourses.enrolled.map((course) => (
                <Grid item xs={12} sm={6} lg={4} key={course.id}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={course.imageUrl}
                      alt={course.title}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          size="small"
                          label={`By ${course.instructor}`}
                        />
                        <Chip 
                          size="small"
                          label={course.level}
                          sx={{ bgcolor: getLevelColor(course.level), color: 'white' }}
                        />
                      </Stack>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Your Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{ height: 6, borderRadius: 3, mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                    <CardContent sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/courses/${course.id}/learn`)}
                        sx={{ 
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        }}
                      >
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 1,
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Course Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Discover and explore available courses
        </Typography>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="All Courses" />
          <Tab label="My Courses" />
        </Tabs>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Level</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                {levels.map(level => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
            {canCreateCourse && currentTab === 1 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  textTransform: 'none',
                }}
              >
                Create Course
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Render appropriate content based on current tab */}
      {currentTab === 0 ? (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.imageUrl}
                    alt={course.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                    }}
                  />
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                    }}
                  >
                    {course.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Stack>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      color: 'white'
                    }}
                  >
                    <Chip
                      size="small"
                      label={course.level}
                      sx={{
                        bgcolor: getLevelColor(course.level),
                        color: 'white',
                        mb: 1
                      }}
                    />
                    <Typography variant="h6" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                      {course.title}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Avatar src={course.instructorAvatar} sx={{ width: 32, height: 32 }} />
                      <Typography variant="subtitle2">{course.instructor}</Typography>
                    </Stack>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Rating value={course.rating} precision={0.5} size="small" readOnly />
                        <Typography variant="h6" color="primary">
                          {course.price}
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        icon={<CalendarIcon sx={{ fontSize: '1rem' }} />}
                        label={new Date(course.startDate).toLocaleDateString()}
                      />
                      <Chip
                        size="small"
                        icon={<TimeIcon sx={{ fontSize: '1rem' }} />}
                        label={course.duration}
                      />
                    </Stack>

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Enrolled Students: {course.enrolledStudents.count}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                          {course.enrolledStudents.users.map((student, index) => (
                            <Avatar 
                              key={index}
                              src={student.avatar}
                              sx={{ width: 24, height: 24 }}
                            />
                          ))}
                        </AvatarGroup>
                        <Typography variant="caption" color="text.secondary">
                          {course.enrolledStudents.count}/{course.capacity} students
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>

                <CardContent sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Stack direction="row" justifyContent="space-between">
                    {canCreateCourse ? (
                      <>
                        <Button 
                          variant="outlined" 
                          startIcon={<EditIcon />}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            flex: 1,
                            mr: 1
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/courses/${course.id}`)}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            flex: 1,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          }}
                        >
                          View Details
                        </Button>
                      </>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/courses/${course.id}`)}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        renderMyCourses()
      )}

      {/* Create/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          {/* Add your form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManagement; 