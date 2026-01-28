import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Users DB
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {user && (
              <>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  sx={{ color: 'white' }}
                >
                  Dashboard
                </Button>
                {user.role === 'user' && (
                  <Button
                    component={RouterLink}
                    to="/register-form"
                    sx={{ color: 'white' }}
                  >
                    New Registration
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button
                    component={RouterLink}
                    to="/admin/registrations"
                    sx={{ color: 'white' }}
                  >
                    All Registrations
                  </Button>
                )}
              </>
            )}
          </Box>
          
          <Box>
            {user ? (
              <>
                <Typography component="span" sx={{ mr: 2 }}>
                  Welcome, {user.name} ({user.role})
                </Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ color: 'white' }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  sx={{ color: 'white' }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;