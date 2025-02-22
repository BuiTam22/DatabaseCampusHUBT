import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';

const TechnicalSettings = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Settings
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Cache Size</Typography>
              <Slider
                defaultValue={50}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={100}
              />
              
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel>Data Sync Frequency</InputLabel>
                <Select defaultValue={30}>
                  <MenuItem value={15}>Every 15 minutes</MenuItem>
                  <MenuItem value={30}>Every 30 minutes</MenuItem>
                  <MenuItem value={60}>Every hour</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                sx={{ mt: 2 }}
                control={<Switch defaultChecked />}
                label="Enable Background Sync"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Data Management
            </Typography>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Auto-save drafts"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Cache images"
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" color="error" sx={{ mr: 1 }}>
                  Clear Cache
                </Button>
                <Button variant="outlined">
                  Export Data
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TechnicalSettings;
