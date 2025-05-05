import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import TrainIcon from '@mui/icons-material/ModelTraining';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

const Training: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [training, setTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setError(null);
    }
  };

  const handleTrain = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    try {
      setTraining(true);
      setError(null);
      
      // Upload files
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // await axios.post('http://localhost:8000/api/v1/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      // Train model
      const response = await axios.post('http://localhost:8000/api/v1/train', formData);

      if (response.data.status === 'success') {
        setTrainingResult(response.data);
      } else {
        throw new Error(response.data.message || 'Training failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Training failed. Please try again.');
    } finally {
      setTraining(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleClearModel = async () => {
    try {
      await axios.delete('http://localhost:8000/api/v1/clear-model');
      setTrainingResult(null);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to clear model. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Training
      </Typography>
      <Typography variant="body1" paragraph>
        Select images and train the model for image classification.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Images
          </Typography>
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Select Files
              </Button>
            </label>
          </Box>

          {files.length > 0 && (
            <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <ImageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Train Model
          </Typography>
          <Typography variant="body2" paragraph>
            After selecting images, click the button below to train the model.
          </Typography>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleTrain}
              disabled={files.length === 0 || training}
              startIcon={training ? <CircularProgress size={20} /> : <TrainIcon />}
              fullWidth
            >
              {training ? 'Training...' : 'Train Model'}
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      {trainingResult && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Training Results
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleClearModel}
              >
                Clear Model
              </Button>
            </Box>
            <Typography variant="body2">
              Status: {trainingResult.status}
            </Typography>
            <Typography variant="body2">
              Message: {trainingResult.message}
            </Typography>
            {trainingResult.model_path && (
              <Typography variant="body2">
                Model saved at: {trainingResult.model_path}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Training; 