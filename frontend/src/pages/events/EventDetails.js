import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  AttachMoney as PriceIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_EVENTS } from './EventsPage';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = MOCK_EVENTS.find(e => e.id === parseInt(eventId));

  if (!event) {
    return (
      <Container>
        <Typography>Event not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Image */}
      <Box
        sx={{
          position: 'relative',
          height: 300,
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={event.imageUrl}
          alt={event.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            {event.title}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<CategoryIcon />}
              label={event.category}
              sx={{ bgcolor: 'primary.main', color: 'white' }}
            />
            <Chip
              icon={<PriceIcon />}
              label={event.price}
              sx={{ bgcolor: 'success.main', color: 'white' }}
            />
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About This Event
              </Typography>
              <Typography paragraph>
                {event.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date & Time"
                    secondary={`${new Date(event.date).toLocaleDateString()} at ${event.time}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location"
                    secondary={event.location}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Organizer"
                    secondary={event.organizer}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Agenda Section */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Event Schedule
              </Typography>
              <List>
                {['Registration', 'Opening Ceremony', 'Main Event', 'Networking'].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      secondary={`${index + 8}:00 AM - ${index + 9}:00 AM`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, mb: 3, position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registration Status
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Available Spots
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.attendees}/{event.maxAttendees}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(event.attendees / event.maxAttendees) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  mb: 2,
                }}
              >
                Register Now
              </Button>

              <Typography variant="subtitle2" gutterBottom>
                Attendees
              </Typography>
              <AvatarGroup max={5} sx={{ justifyContent: 'center', mb: 1 }}>
                {Array(event.attendees).fill().map((_, i) => (
                  <Avatar 
                    key={i}
                    src={`https://i.pravatar.cc/150?img=${i + 1}`}
                  />
                ))}
              </AvatarGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails; 