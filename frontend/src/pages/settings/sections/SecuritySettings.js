import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Divider
} from '@mui/material';
import {
  Notifications,
  Lock,
  Security
} from '@mui/icons-material';

const SecuritySettings = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Preferences
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Lock />
                </ListItemIcon>
                <ListItemText
                  primary="Account Privacy"
                  secondary="Make your account private"
                />
                <ListItemSecondaryAction>
                  <Switch edge="end" />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Login Notifications"
                  secondary="Get notified of new logins"
                />
                <ListItemSecondaryAction>
                  <Switch edge="end" defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Session Management"
                  secondary="Manage your active sessions"
                />
                <ListItemSecondaryAction>
                  <Button color="error" size="small">
                    End All
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecuritySettings;
