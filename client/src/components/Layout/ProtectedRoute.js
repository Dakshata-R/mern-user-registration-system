import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  return <ProtectedRoute roles={['admin']} />;
};

export const UserRoute = () => {
  return <ProtectedRoute roles={['user']} />;
};