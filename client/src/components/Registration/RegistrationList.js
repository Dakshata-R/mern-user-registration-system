import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const endpoint = user.role === 'admin' 
        ? `${process.env.REACT_APP_API_URL}/registrations`
        : `${process.env.REACT_APP_API_URL}/registrations/my-registrations`;
      
      const res = await axios.get(endpoint);
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch registrations');
    }
  };

  // Check if current user can edit this registration
  const canEdit = (registration) => {
    if (user.role === 'admin') return true;
    
    // User can edit if they own this registration
    const isOwnRegistration = registration.user === user.id || 
                              registration.user?._id === user.id;
    return isOwnRegistration;
  };

  // Check if current user can delete this registration
  const canDelete = (registration) => {
    if (user.role === 'admin') return true;
    
    // User can delete if they own this registration
    const isOwnRegistration = registration.user === user.id || 
                              registration.user?._id === user.id;
    return isOwnRegistration;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/registrations/${id}`);
      toast.success('Registration deleted successfully');
      fetchRegistrations();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Delete failed');
    }
  };

  const handleEditClick = (registration) => {
    // Check permissions
    if (!canEdit(registration)) {
      toast.error('You do not have permission to edit this registration');
      return;
    }
    
    setEditingRegistration(registration);
    
    // Prepare data for editing
    const registrationForEdit = {
      ...registration,
      skills: Array.isArray(registration.skills) 
        ? registration.skills.join(', ') 
        : registration.skills || '',
      dob: registration.dob ? new Date(registration.dob).toISOString().split('T')[0] : ''
    };
    
    setEditFormData(registrationForEdit);
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/registrations/${editingRegistration._id}`,
        editFormData
      );
      toast.success('Registration updated successfully');
      setEditDialogOpen(false);
      fetchRegistrations();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setEditingRegistration(null);
    setEditFormData({});
  };

  // Define the fields to display
  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'dept', label: 'Department' },
    { key: 'regNumber', label: 'Reg Number' },
    { key: 'email', label: 'Email' },
    { key: 'cgpa', label: 'CGPA' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'gender', label: 'Gender' },
    { key: 'skills', label: 'Skills' },
    { key: 'institute', label: 'Institute' }
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {user.role === 'admin' ? 'All Registrations' : 'My Registrations'}
          </Typography>
          
        </Box>
        
        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {user.role === 'admin' && (
                  <TableCell>
                    <Typography fontWeight="bold">Created By</Typography>
                  </TableCell>
                )}
                {displayFields.map((field) => (
                  <TableCell key={field.key}>
                    <Typography fontWeight="bold">{field.label}</Typography>
                  </TableCell>
                ))}
                <TableCell>
                  <Typography fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={displayFields.length + (user.role === 'admin' ? 2 : 1)} align="center">
                    <Typography color="text.secondary" py={3}>
                      No registrations found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                registrations.map((registration) => {
                  const userCanEdit = canEdit(registration);
                  const userCanDelete = canDelete(registration);
                  
                  return (
                    <TableRow 
                      key={registration._id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                        } 
                      }}
                    >
                      {user.role === 'admin' && (
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {registration.user?.name || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {registration.user?.email || 'No email'}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      
                      {displayFields.map((field) => (
                        <TableCell key={field.key}>
                          {field.key === 'dob' ? (
                            formatDate(registration[field.key])
                          ) : field.key === 'skills' ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Array.isArray(registration[field.key]) 
                                ? registration[field.key].map((skill, index) => (
                                    <Chip 
                                      key={index} 
                                      label={skill.trim()} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  ))
                                : registration[field.key]?.split(',').map((skill, index) => (
                                    <Chip 
                                      key={index} 
                                      label={skill.trim()} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  ))
                              }
                            </Box>
                          ) : field.key === 'cgpa' ? (
                            <Chip 
                              label={registration[field.key] || 'N/A'} 
                              color={registration[field.key] >= 8 ? 'success' : 'default'}
                              size="small"
                            />
                          ) : (
                            <Typography>
                              {registration[field.key] || 'N/A'}
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                      
                      {/* Actions Column */}
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* Edit Button */}
                          {userCanEdit && (
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(registration)}
                              title="Edit"
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          
                          {/* Delete Button */}
                          {userCanDelete && (
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(registration._id)}
                              title="Delete"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                          
                          {/* No permissions message */}
                          {!userCanEdit && !userCanDelete && (
                            <Typography variant="caption" color="text.secondary">
                              No actions
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCancelEdit} maxWidth="md" fullWidth>
          <DialogTitle>
            {user.role === 'admin' 
              ? 'Edit Registration' 
              : 'Edit Your Registration'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                {/* Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Grid>

                {/* Department */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="dept"
                      value={editFormData.dept || ''}
                      label="Department"
                      onChange={handleEditChange}
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
                    fullWidth
                    label="Registration Number"
                    name="regNumber"
                    value={editFormData.regNumber || ''}
                    onChange={handleEditChange}
                    required
                    InputProps={{
                      readOnly: user.role === 'user' // Users cannot change reg number
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Grid>

                {/* CGPA */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CGPA"
                    name="cgpa"
                    type="number"
                    inputProps={{ min: "0", max: "10", step: "0.01" }}
                    value={editFormData.cgpa || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Grid>

                {/* Date of Birth */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editFormData.dob || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Grid>

                {/* Mobile */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    value={editFormData.mobile || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={editFormData.gender || ''}
                      label="Gender"
                      onChange={handleEditChange}
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
                    fullWidth
                    label="Skills (comma separated)"
                    name="skills"
                    value={editFormData.skills || ''}
                    onChange={handleEditChange}
                    placeholder="React, Node.js, MongoDB, etc."
                    required
                  />
                </Grid>

                {/* Institute */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Institute Name"
                    name="institute"
                    value={editFormData.institute || ''}
                    onChange={handleEditChange}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update Registration
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default RegistrationList;