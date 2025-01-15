import { createContext, useState, useContext, FC, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    loginAuth: (newToken: string) => void;
    logoutAuth: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const loginAuth = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logoutAuth = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, loginAuth, logoutAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
