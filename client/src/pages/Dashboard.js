import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Role: {user?.role}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
    
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Create New Registration
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Submit a new registration with 10 fields of information.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register-form')}
                >
                  Start Registration
                </Button>
              </Paper>
            </Grid>
          
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                View Registrations
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {user?.role === 'admin' 
                  ? 'View all registrations with admin controls' 
                  : 'View your submitted registrations'}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(
                  user?.role === 'admin' 
                    ? '/admin/registrations' 
                    : '/my-registrations'
                )}
              >
                View Registrations
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;