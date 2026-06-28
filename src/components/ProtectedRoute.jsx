import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../App';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useStore();

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
