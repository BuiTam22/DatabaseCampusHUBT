import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const MOCK_EVENTS = [
  {
    id: 1,
    title: "Competitive Programming Challenge 2024",
    description: "Join our intensive coding competition featuring algorithmic challenges, data structures, and problem-solving tasks. Compete with top programmers and win exciting prizes!",
    date: "2024-03-15",
    time: "10:00 AM",
    location: "Online & Tech Hub Center",
    category: "Competitive Programming",
    imageUrl: "https://images.unsplash.com/photo-1623479322729-28b25c16b011",
    attendees: 145,
    maxAttendees: 300,
    price: "Free",
    organizer: "CodeMaster Community",
    difficulty: "Advanced",
    prizes: {
      first: "$1000",
      second: "$500",
      third: "$250"
    },
    languages: ["C++", "Java", "Python"],
    rounds: [
      {
        name: "Qualification Round",
        duration: "2 hours",
        problems: 3
      },
      {
        name: "Semi Finals",
        duration: "3 hours",
        problems: 4
      },
      {
        name: "Finals",
        duration: "4 hours",
        problems: 5
      }
    ]
  },
  {
    id: 2,
    title: "Hackathon: AI Innovation Challenge",
    description: "Build innovative AI solutions in this 24-hour hackathon. Focus on machine learning, natural language processing, and computer vision projects.",
    date: "2024-04-20",
    time: "9:00 AM",
    location: "Innovation Center",
    category: "Hackathon",
    imageUrl: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c",
    attendees: 80,
    maxAttendees: 100,
    price: "$30",
    organizer: "AI Research Group",
    difficulty: "Intermediate",
    prizes: {
      first: "$2000",
      second: "$1000",
      third: "$500"
    },
    teamSize: "2-4 members",
    technologies: ["TensorFlow", "PyTorch", "OpenCV"],
    tracks: [
      "Healthcare AI",
      "Environmental Solutions",
      "Education Technology"
    ]
  },
  {
    id: 3,
    title: "Web Development Championship",
    description: "Showcase your web development skills in this competitive event. Build responsive, accessible, and innovative web applications.",
    date: "2024-05-10",
    time: "9:30 AM",
    location: "Digital Arena, New York",
    category: "Web Development",
    imageUrl: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d",
    attendees: 75,
    maxAttendees: 150,
    price: "$25",
    organizer: "WebDev Masters",
    difficulty: "Intermediate",
    prizes: {
      first: "$1500",
      second: "$750",
      third: "$350"
    },
    technologies: ["React", "Node.js", "MongoDB"],
    challenges: [
      "Frontend Challenge",
      "Full Stack Implementation",
      "UI/UX Design"
    ]
  }
];

const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const filteredEvents = MOCK_EVENTS.filter(event => {
    if (searchTerm) {
      return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             event.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Events
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            }}
          >
            Create Event
          </Button>
        </Stack>

        {/* Search and Filter */}
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            placeholder="Search events..."
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
        </Box>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ mt: 3 }}
        >
          <Tab label="All Events" />
          <Tab label="My Events" />
          <Tab label="Past Events" />
        </Tabs>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2, 
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={event.imageUrl}
                  alt={event.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  {event.price}
                </Box>
              </Box>
              
              <CardContent>
                <Stack spacing={2}>
                  <Typography 
                    variant="h6" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 56,
                    }}
                  >
                    {event.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<EventIcon />}
                      label={new Date(event.date).toLocaleDateString()}
                      size="small"
                    />
                    <Chip
                      icon={<LocationIcon />}
                      label={event.location.split(',')[0]}
                      size="small"
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: 40,
                    }}
                  >
                    {event.description}
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Attendees
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                          {Array(event.attendees).fill().map((_, i) => (
                            <Avatar 
                              key={i}
                              src={`https://i.pravatar.cc/150?img=${i + 1}`}
                              sx={{ width: 24, height: 24 }}
                            />
                          ))}
                        </AvatarGroup>
                        <Typography variant="caption" color="text.secondary">
                          {event.attendees}/{event.maxAttendees}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={event.category}
                      size="small"
                      color="primary"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          {/* Add form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventsPage; 