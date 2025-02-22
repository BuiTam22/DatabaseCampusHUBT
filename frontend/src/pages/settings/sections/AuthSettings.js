import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Card,
  CardContent
} from '@mui/material';

const AuthSettings = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Login Methods
            </Typography>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email Authentication"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Google OAuth"
              />
              <FormControlLabel
                control={<Switch />}
                label="Two-factor Authentication"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Password Settings
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                margin="normal"
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                margin="normal"
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AuthSettings;
