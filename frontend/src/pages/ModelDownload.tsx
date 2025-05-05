import React from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';

const ModelDownload: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = 'http://localhost:8000/api/v1/download-model';
      link.download = 'model.zip';
      
      // Append to body and click
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading model:', error);
      alert('Failed to download model. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Download Model
      </Typography>
      <Typography variant="body1" paragraph>
        Download the trained model for offline use.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Downloading...' : 'Download Model'}
      </Button>
    </Box>
  );
};

export default ModelDownload; 