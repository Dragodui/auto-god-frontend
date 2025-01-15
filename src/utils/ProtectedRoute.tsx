import { FC, ReactNode } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {

  const authContext = useAuth();
  if (!authContext) {
    throw new Error("AuthContext is null");
  }
  const {token} = authContext;
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
