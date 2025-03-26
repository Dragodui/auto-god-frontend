import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from '../services/authService';
import { LoginData, RegisterData, User } from '@/types';
import { getCurrentProfileData } from '@/services/userService';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentProfileData();
        if (!('message' in response)) {
          setIsAuthenticated(true);
          setUserId(response._id);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error while checking user's authentication: ", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await loginApi(data);
      const me = await getCurrentProfileData();
      if (response && response.message === 'Logged in successfully') {
        setIsAuthenticated(true);
        setUserId((me as User)._id);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    await logoutApi();
    setIsAuthenticated(false);
  };

  const register = async (data: RegisterData) => {
    try {
      await registerApi(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register, userId }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
