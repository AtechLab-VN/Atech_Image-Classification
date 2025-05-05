import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const ImageTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ predicted_class: string; similarity: number } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleTest = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8000/api/v1/test', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error testing image:', error);
      alert('Failed to test image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Test with Image Upload
      </Typography>
      <Typography variant="body1" paragraph>
        Upload an image and test it with the trained model.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            sx={{ mr: 2 }}
          >
            Select Image
          </Button>
        </label>
        {selectedFile && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleTest}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Testing...' : 'Test Image'}
          </Button>
        )}
      </Box>

      {previewUrl && (
        <Box sx={{ mb: 3 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
          />
        </Box>
      )}

      {result && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">Test Result:</Typography>
          <Typography>Predicted Class: {result.predicted_class}</Typography>
          <Typography>Confidence: {(result.similarity * 100).toFixed(2)}%</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ImageTest; 