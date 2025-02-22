import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container
} from '@mui/material';
import {
  Lock as LockIcon,
  Build as BuildIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

import AuthSettings from './sections/AuthSettings';
import TechnicalSettings from './sections/TechnicalSettings';
import SecuritySettings from './sections/SecuritySettings';

const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`settings-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </Box>
);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: -2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Paper sx={{ mb: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<LockIcon />} label="Authentication" iconPosition="start" />
          <Tab icon={<BuildIcon />} label="Technical" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <AuthSettings />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <TechnicalSettings />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <SecuritySettings />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
