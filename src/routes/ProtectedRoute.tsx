import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Loader } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
