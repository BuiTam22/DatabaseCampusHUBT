import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Stack,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  LinearProgress,
  AvatarGroup,
  IconButton,
  CardActions,
  Alert,
  Paper,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  PlayCircleOutline as VideoIcon,
  Description as DocumentIcon,
  Quiz as QuizIcon,
  Group as GroupIcon,
  PlayCircle as PlayCircleIcon,
  Download as DownloadIcon,
  Lock as LockIcon,
  Code as PracticeIcon,
  Add as AddIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Work as WorkIcon,
  Devices as DevicesIcon,
  EmojiEvents as EmojiEventsIcon,
  Update as UpdateIcon,
  Support as SupportIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_COURSES } from '../data/mockCourses'; // Import mock data
import ApiService from '../services/apiService';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        // Find course from MOCK_COURSES
        const foundCourse = MOCK_COURSES.find(c => c.id === parseInt(courseId));
        
        if (!foundCourse) {
          setError('Course not found');
          return;
        }

        setCourse(foundCourse);
        // Check enrollment status
        setIsEnrolled(foundCourse.isEnrolled || false);
        
      } catch (err) {
        setError('Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update enrollment status
      setIsEnrolled(true);
      
      // Navigate to learning page
      navigate(`/courses/${courseId}/learn`);
    } catch (err) {
      setError('Failed to enroll in course');
    }
  };

  const handleStartLearning = () => {
    navigate(`/courses/${courseId}/learn`);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Course not found</Typography>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircleIcon />;
      case 'practical':
        return <AssignmentIcon />;
      case 'quiz':
        return <QuizIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  const renderLessonContent = (content) => (
    <Box sx={{ pl: 4 }}>
      {content.map((item, index) => (
        <ListItem key={index} sx={{ py: 1 }}>
          <ListItemIcon>
            {getLessonIcon(item.type)}
          </ListItemIcon>
          <ListItemText 
            primary={item.description}
            secondary={`Duration: ${item.duration}`}
          />
        </ListItem>
      ))}
    </Box>
  );

  const CurriculumTab = () => (
    <Box>
      {course?.lessons?.map((lesson, index) => (
        <Card key={lesson.id} sx={{ mb: 2, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {index + 1}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {lesson.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lesson.duration} • {lesson.type}
                  </Typography>
                </Box>
              </Box>
              {!isEnrolled && (
                <Chip 
                  icon={<LockIcon />}
                  label="Locked"
                  color="default"
                  size="small"
                />
              )}
            </Box>
            
            {isEnrolled && lesson.content && (
              renderLessonContent(lesson.content)
            )}
          </CardContent>
        </Card>
      ))}

      {isEnrolled ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Course Resources
          </Typography>
          <Grid container spacing={2}>
            {course?.resources?.map((resource, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <DownloadIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {resource.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {resource.type.toUpperCase()}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      startIcon={<DownloadIcon />}
                      onClick={() => window.open(resource.url)}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Course Resources Locked
          </Typography>
          <Typography color="text.secondary" paragraph>
            Enroll in this course to access all learning materials and resources
          </Typography>
          <Button
            variant="contained"
            onClick={handleEnroll}
            startIcon={<AddIcon />}
          >
            Enroll Now
          </Button>
        </Box>
      )}
    </Box>
  );

  const ReviewTab = () => (
    <Box>
      {/* Review Summary */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h2" color="primary" gutterBottom>
              {course?.rating || 0}
            </Typography>
            <Rating value={course?.rating || 0} precision={0.5} readOnly size="large" sx={{ mb: 2 }} />
            <Typography variant="subtitle1">
              {course?.reviewCount || 0} Reviews
            </Typography>
            <Box sx={{ mt: 3 }}>
              {[5, 4, 3, 2, 1].map((star) => (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ minWidth: 30 }}>{star}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={course?.ratingDistribution?.[star] || 0}
                    sx={{ flex: 1, mx: 1, height: 8, borderRadius: 1 }}
                  />
                  <Typography sx={{ minWidth: 40 }}>
                    {course?.ratingDistribution?.[star] || 0}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Review List */}
          {course?.reviews?.map((review, index) => (
            <Card key={index} sx={{ mb: 2, p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar src={review?.userAvatar} />
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review?.userName || 'Anonymous'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review?.date).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Rating value={review?.rating || 0} size="small" readOnly sx={{ my: 1 }} />
                  <Typography variant="body2" paragraph>
                    {review?.comment || ''}
                  </Typography>
                  {review?.response && (
                    <Box sx={{ ml: 4, mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Instructor Response:
                      </Typography>
                      <Typography variant="body2">
                        {review.response}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );

  const InstructorTab = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card sx={{ textAlign: 'center', p: 3 }}>
          <Avatar
            src={course?.instructor?.avatar || ''}
            sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            {course?.instructor?.name || 'Instructor Name'}
          </Typography>
          <Typography color="primary" gutterBottom>
            {typeof course?.instructor?.title === 'string' ? course.instructor.title : 'Instructor'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <Box textAlign="center">
              <Typography variant="h6">{course?.instructor?.totalStudents || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Students</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{course?.instructor?.totalCourses || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Courses</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{course?.instructor?.rating || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Avg Rating</Typography>
            </Box>
          </Stack>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PersonIcon />}
            sx={{ mb: 2 }}
          >
            View Profile
          </Button>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          About the Instructor
        </Typography>
        <Typography paragraph>
          {course?.instructor?.bio || 'No bio available'}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Expertise
        </Typography>
        <Grid container spacing={1} sx={{ mb: 4 }}>
          {course?.instructor?.expertise?.map((skill, index) => (
            <Grid item key={index}>
              <Chip label={skill} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom>
          Other Courses by {course?.instructor?.name || 'Instructor'}
        </Typography>
        <Grid container spacing={2}>
          {course?.instructor?.otherCourses?.map((otherCourse, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {otherCourse.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={otherCourse.rating} size="small" readOnly />
                    <Typography variant="caption">
                      ({otherCourse.students} students)
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Course Image */}
            <Box sx={{ 
              position: 'relative',
              height: 300,
              borderRadius: 3,
              overflow: 'hidden',
              mb: 3 
            }}>
              <img
                src={course.imageUrl}
                alt={course.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white'
              }}>
                <Chip
                  label={course.category}
                  sx={{ mb: 1, bgcolor: 'primary.main', color: 'white' }}
                />
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {course.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Rating value={course.rating} precision={0.5} readOnly />
                  <Typography>({course.reviewCount} reviews)</Typography>
                  <Typography>•</Typography>
                  <Typography>{course.enrolledStudents.count} students</Typography>
                </Stack>
              </Box>
            </Box>

            {/* Course Stats */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">{course.totalLessons}</Typography>
                  <Typography color="text.secondary">Total Lessons</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">{course.duration}</Typography>
                  <Typography color="text.secondary">Course Duration</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <WorkIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6">{course.level}</Typography>
                  <Typography color="text.secondary">Difficulty Level</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Enrollment Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              position: 'sticky',
              top: 24,
              borderRadius: 3,
              boxShadow: 3
            }}>
              <CardContent>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {course.price}
                  </Typography>
                  {course.originalPrice && (
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {course.originalPrice}
                    </Typography>
                  )}
                </Box>

                {isEnrolled ? (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleStartLearning}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    }}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleEnroll}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    }}
                  >
                    Enroll Now
                  </Button>
                )}

                {/* Course Features */}
                <List dense>
                  {[
                    { icon: <AccessTimeIcon />, text: `${course.duration} of content` },
                    { icon: <DevicesIcon />, text: 'Access on all devices' },
                    { icon: <AssignmentIcon />, text: `${course.assignments} assignments` },
                    { icon: <EmojiEventsIcon />, text: 'Certificate of completion' },
                    { icon: <UpdateIcon />, text: 'Lifetime access' },
                    { icon: <SupportIcon />, text: '24/7 Support' },
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>

                {/* Share & Save */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShareIcon />}
                  >
                    Share
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<BookmarkIcon />}
                  >
                    Save
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ mt: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none' },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Curriculum" />
          <Tab label="Instructor" />
          <Tab label="Reviews" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Course Description
              </Typography>
              <Typography paragraph>{course.description}</Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                What you'll learn
              </Typography>
              <Grid container spacing={2}>
                {course?.learningOutcomes?.map((outcome, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="body2">{outcome}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>

              {/* Show notification when not enrolled */}
              {!isEnrolled && (
                <Alert 
                  severity="info" 
                  sx={{ mt: 4 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleEnroll}
                    >
                      Enroll Now
                    </Button>
                  }
                >
                  Enroll in this course to access all learning materials and practice exercises
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Course Progress
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Students Enrolled
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={((course?.enrolledStudents?.count || 0) / (course?.capacity || 1)) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {course?.enrolledStudents?.count || 0} of {course?.capacity || 0} spots taken
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Enrollments
                  </Typography>
                  <AvatarGroup max={5} sx={{ justifyContent: 'center', mb: 2 }}>
                    {course?.enrolledStudents?.users?.map((student, index) => (
                      <Avatar 
                        key={index}
                        src={student.avatar}
                        alt={student.name}
                      />
                    ))}
                  </AvatarGroup>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Join {course?.enrolledStudents?.count || 0} other students
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Curriculum Tab */}
        <TabPanel value={currentTab} index={1}>
          <CurriculumTab />
        </TabPanel>

        {/* Instructor Tab */}
        <TabPanel value={currentTab} index={2}>
          <InstructorTab />
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={currentTab} index={3}>
          <ReviewTab />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default CourseDetails;