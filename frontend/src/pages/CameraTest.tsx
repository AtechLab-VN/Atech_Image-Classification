import React, { useRef, useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const CameraTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ predicted_class: string; similarity: number } | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please make sure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureAndTest = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setLoading(true);
      setResult(null);

      // Capture image from video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg');
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');

      // Send to backend
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
        Test with Camera
      </Typography>
      <Typography variant="body1" paragraph>
        Capture an image using your camera and test it with the trained model.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ maxWidth: '100%', display: stream ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        {!stream ? (
          <Button
            variant="contained"
            color="primary"
            onClick={startCamera}
            sx={{ mr: 2 }}
          >
            Start Camera
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={captureAndTest}
              disabled={loading}
              sx={{ mr: 2 }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Testing...' : 'Capture & Test'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={stopCamera}
            >
              Stop Camera
            </Button>
          </>
        )}
      </Box>

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

export default CameraTest; 