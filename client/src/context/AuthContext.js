import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Set header BEFORE making request
      axios.defaults.headers.common['x-auth-token'] = token;
      
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          'x-auth-token': token
        }
      });
      setUser(res.data);
    }
  } catch (err) {
    console.error('Auth check error:', err.response?.data || err.message);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      toast.success('Registered successfully!');
      navigate('/dashboard');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    }
  };

  const googleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    checkUser();
    navigate('/dashboard');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    googleLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};