import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // ADD THIS
import { useAuth } from '../../context/AuthContext'; // ADD THIS

const GoogleAuth = () => {
  const navigate = useNavigate(); // ADD THIS
  const { setUser } = useAuth(); // ADD THIS - Get setUser from AuthContext
  
  const responseGoogle = (credentialResponse) => {
    console.log('Google Login Successful:', credentialResponse);
    
    if (credentialResponse.credential) {
      toast.loading('Authenticating with Google...');
      
      axios.post(`${process.env.REACT_APP_API_URL}api/auth/google`, {
        token: credentialResponse.credential
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        toast.dismiss();
        toast.success('Google login successful!');
        
        // Store token and user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set axios default header
        axios.defaults.headers.common['x-auth-token'] = response.data.token;
        
        // Update AuthContext state WITHOUT reload
        if (setUser) {
          setUser(response.data.user); // This triggers React re-render
        }
        
        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      })
      .catch(error => {
        toast.dismiss();
        console.error('Full error:', error);
        const errorMsg = error.response?.data?.msg || 'Google authentication failed';
        toast.error(errorMsg);
      });
    }
  };

  const handleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={handleError}
        render={({ onClick }) => (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={onClick}
            sx={{ mb: 2 }}
          >
            Sign in with Google
          </Button>
        )}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;