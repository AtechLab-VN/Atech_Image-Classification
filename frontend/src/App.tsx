import React, { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import Training from './pages/Training';
import ModelDownload from './pages/ModelDownload';
import CameraTest from './pages/CameraTest';
import ImageTest from './pages/ImageTest';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Image Classification System
        </Typography>
        
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Training" />
            <Tab label="Model Download" />
            <Tab label="Camera Test" />
            <Tab label="Image Test" />
          </Tabs>
        </Paper>

        <TabPanel value={value} index={0}>
          <Training />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ModelDownload />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CameraTest />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ImageTest />
        </TabPanel>
      </Box>
    </Container>
  );
}

export default App;