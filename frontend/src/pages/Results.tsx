import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Result {
  id: number;
  filename: string;
  similarity: number;
}

interface ResultsProps {
  results: Result[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Kết quả tìm kiếm
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/search')}
        >
          Quay lại
        </Button>
      </Box>

      {results.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy kết quả phù hợp
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {results.map((result) => (
            <Grid item xs={12} sm={6} md={4} key={result.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:8000/api/v1/images/${result.filename}`}
                  alt={result.filename}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Similarity: {(result.similarity * 100).toFixed(2)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Results; 