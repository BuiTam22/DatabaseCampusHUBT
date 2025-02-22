import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  LinearProgress,
  Stack,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  Drawer,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  MenuBook as TheoryIcon,
  Code as PracticeIcon,
  PlayCircle as VideoIcon,
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  MenuOpen as MenuOpenIcon,
  PlayArrow as PlayIcon,
  Description as DocIcon,
  QuestionAnswer as TestIcon,
  DoneAll as SubmitIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../data/mockCourses';
import { useSidebar } from '../contexts/SidebarContext';
import CodeEditor from '../components/course/CodeEditor';
import ApiService from '../services/apiService';

const CourseLearn = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isCollapsed, setIsCollapsed } = useSidebar();
  
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [progress, setProgress] = useState(30);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const currentCourse = MOCK_COURSES.find(c => c.id === parseInt(courseId));
    setCourse(currentCourse);
    if (currentCourse?.lessons?.length > 0) {
      setSelectedLesson(currentCourse.lessons[0]);
    }
  }, [courseId]);

  useEffect(() => {
    // Collapse sidebar when entering course learn page
    setIsCollapsed(true);
    
    return () => {
      // Restore sidebar state when leaving
      setIsCollapsed(false);
    };
  }, [setIsCollapsed]);

  useEffect(() => {
    if (selectedLesson?.type === 'practical') {
      setCode(selectedLesson.initialCode || '');
      setOutput(''); // Reset output khi chuyển bài
    }
  }, [selectedLesson]);

  const drawerWidth = '20%';

  const renderSidebar = () => (
    <Box sx={{ 
      width: isCollapsed ? 80 : 320,
      minWidth: isCollapsed ? 80 : 320,
      borderRight: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      height: '100%',
      transition: 'all 0.3s ease',
    }}>
      {!isCollapsed && (
        <Box sx={{ mb: 2, px: 2, pt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Course Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'success.main',
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {progress}% Complete
          </Typography>
        </Box>
      )}

      <List sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        px: isCollapsed ? 1 : 2,
        pt: isCollapsed ? 2 : 0,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '3px',
        },
      }}>
        {course?.lessons.map((lesson, index) => (
          <ListItemButton 
            key={lesson.id}
            selected={selectedLesson?.id === lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              transition: 'all 0.2s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 1 : 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.lighter',
                '&:hover': {
                  backgroundColor: 'primary.lighter',
                },
              },
              '&:hover': {
                backgroundColor: 'grey.50',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: isCollapsed ? 'auto' : 48,
              mr: isCollapsed ? 0 : 2 
            }}>
              {lesson.type === 'theory' ? (
                lesson.completed ? 
                  <CompletedIcon color="success" /> : 
                  <VideoIcon color={selectedLesson?.id === lesson.id ? 'primary' : 'inherit'} />
              ) : (
                lesson.completed ?
                  <CompletedIcon color="success" /> :
                  <PracticeIcon color={selectedLesson?.id === lesson.id ? 'primary' : 'inherit'} />
              )}
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText 
                primary={lesson.title}
                secondary={`${lesson.duration} • ${lesson.type === 'theory' ? 'Video' : 'Practice'}`}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: selectedLesson?.id === lesson.id ? 'medium' : 'normal',
                  color: selectedLesson?.id === lesson.id ? 'primary.main' : 'inherit',
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const renderContent = (lesson) => {
    switch (lesson.type) {
      case 'theory':
        return (
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <Box sx={{ 
              flex: 1,
              position: 'relative',
              bgcolor: '#000',
            }}>
              <iframe
                src={lesson.content[0].url}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allowFullScreen
              />
            </Box>
            <Box sx={{ 
              p: 2, 
              borderTop: 1, 
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Resume Video
                </Button>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {lesson.content[0].title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<DocIcon />}
                    size="small"
                  >
                    Notes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TestIcon />}
                    size="small"
                  >
                    Quiz
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        );

      case 'practical':
        return (
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}>
            {/* Problem Description - 35% */}
            <Box sx={{ 
              width: '35%',
              minWidth: '350px',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflow: 'auto',
              bgcolor: 'background.paper',
              p: 3,
            }}>
              <Typography variant="h6" gutterBottom>
                {lesson.title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ mb: 3, whiteSpace: 'pre-wrap' }}
              >
                {lesson.description}
              </Typography>

              {lesson.examples?.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Examples:
                  </Typography>
                  {lesson.examples.map((example, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Input:
                      </Typography>
                      <Box sx={{
                        margin: '8px 0',
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        '& pre': {
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          wordBreak: 'break-all',
                          overflowWrap: 'break-word',
                          fontFamily: '"Fira Code", monospace',
                          fontSize: '14px',
                          lineHeight: '1.5',
                        }
                      }}>
                        <pre>{example.input}</pre>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Output:
                      </Typography>
                      <Box sx={{
                        margin: '8px 0',
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        '& pre': {
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          wordBreak: 'break-all',
                          overflowWrap: 'break-word',
                          fontFamily: '"Fira Code", monospace',
                          fontSize: '14px',
                          lineHeight: '1.5',
                        }
                      }}>
                        <pre>{example.output}</pre>
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>

            {/* Code Editor Section - 65% */}
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Editor Header */}
              <Box sx={{ 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: '#1e1e1e',
              }}>
                <Chip 
                  label={lesson.language || 'javascript'}
                  size="small"
                  sx={{ 
                    bgcolor: '#2d2d2d',
                    color: '#d4d4d4',
                    borderRadius: 1,
                  }}
                />
              </Box>

              {/* Code Editor */}
              <Box sx={{ 
                flex: 1,
                overflow: 'hidden',
              }}>
                <CodeEditor
                  value={code}
                  onChange={(newCode) => {
                    setCode(newCode);
                    if (output) setOutput('');
                  }}
                  language={lesson.language || 'javascript'}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    lineNumbers: 'on',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    fontFamily: '"Fira Code", monospace',
                    fontLigatures: true,
                  }}
                />
              </Box>

              {/* Output Panel */}
              {output && (
                <Box sx={{
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: '#1e1e1e',
                }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="#d4d4d4">
                      Output:
                    </Typography>
                    <Box sx={{
                      mt: 1,
                      maxHeight: '200px',
                      overflow: 'auto',
                      '& pre': {
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        wordBreak: 'break-all',
                        overflowWrap: 'break-word',
                        fontFamily: '"Fira Code", monospace',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: (theme) => output.includes('Error') || output.includes('Failed') 
                          ? '#f14c4c' 
                          : '#4caf50',
                      }
                    }}>
                      <pre>{output}</pre>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );

      default:
        return (
          <Typography variant="body1" sx={{ p: 3 }}>
            Content type not supported: {lesson.type}
          </Typography>
        );
    }
  };

  const updateLessonStatus = async (lessonId, status) => {
    try {
      const updatedCourse = {
        ...course,
        lessons: course.lessons.map(lesson => 
          lesson.id === lessonId 
            ? { ...lesson, completed: status === 'completed' }
            : lesson
        )
      };
      setCourse(updatedCourse);
      
      // Cập nhật progress
      const completedLessons = updatedCourse.lessons.filter(l => l.completed).length;
      const totalLessons = updatedCourse.lessons.length;
      const newProgress = Math.round((completedLessons / totalLessons) * 100);
      setProgress(newProgress);
      
    } catch (error) {
      console.error('Failed to update lesson status:', error);
    }
  };

  if (!course) return null;

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
        {/* Left Side - Course Content */}
        {renderSidebar()}

        {/* Right Side - Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* Content Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => navigate('/courses')}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6">
                {selectedLesson?.title || course.title}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton>
                <BookmarkIcon />
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Main Content Area */}
          {selectedLesson ? (
            <Box sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {renderContent(selectedLesson)}
            </Box>
          ) : (
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
            }}>
              <Typography variant="h6" color="text.secondary">
                Select a lesson to begin
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default CourseLearn; 