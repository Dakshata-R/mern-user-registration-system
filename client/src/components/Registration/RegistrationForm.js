import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    regNumber: '',
    email: '',
    cgpa: '',
    dob: '',
    mobile: '',
    gender: '',
    skills: '',
    institute: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/registrations', formData);
      toast.success('Registration submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Submission failed');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Student Registration Form
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              {/* Department Dropdown */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="dept"
                    value={formData.dept}
                    label="Department"
                    onChange={handleChange}
                  >
                    <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                    <MenuItem value="ECE">Electronics & Communication</MenuItem>
                    <MenuItem value="MECH">Mechanical Engineering</MenuItem>
                    <MenuItem value="CIVIL">Civil Engineering</MenuItem>
                    <MenuItem value="EEE">Electrical & Electronics</MenuItem>
                    <MenuItem value="IT">Information Technology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Registration Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Registration Number"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              {/* CGPA */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="CGPA"
                  name="cgpa"
                  type="number"
                  inputProps={{ min: "0", max: "10", step: "0.01" }}
                  value={formData.cgpa}
                  onChange={handleChange}
                />
              </Grid>

              {/* Date of Birth - SIMPLE DATE INPUT */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dob}
                  onChange={handleChange}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>

              {/* Mobile Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  inputProps={{ pattern: "[0-9]{10}", title: "10 digit mobile number" }}
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </Grid>

              {/* Gender Dropdown */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Skills */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Skills (comma separated)"
                  name="skills"
                  placeholder="React, Node.js, MongoDB, etc."
                  value={formData.skills}
                  onChange={handleChange}
                />
              </Grid>

              {/* Institute Name */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Institute Name"
                  name="institute"
                  value={formData.institute}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegistrationForm;