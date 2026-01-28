import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import RegistrationForm from './components/Registration/RegistrationForm';
import RegistrationList from './components/Registration/RegistrationList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ALL PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            
            {/* COMMON ROUTES - Available for both roles */}
            <Route path="/register-form" element={<RegistrationForm />} />
            
            {/* Role-specific routes handled inside components */}
            <Route path="/my-registrations" element={<RegistrationList />} />
            <Route path="/admin/registrations" element={<RegistrationList />} />
          </Route>
          
          {/* Default route */}
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;