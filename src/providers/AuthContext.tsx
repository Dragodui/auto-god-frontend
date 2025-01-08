import { createContext, FC, ReactNode, useEffect, useState } from "react";
import api from "../api/api";


interface AuthContextType {
    isAuth: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {

    const [isAuth, setIsAuth] = useState(false);
    // const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get('/auth/verify');
                setIsAuth(true);
            } catch (error) {
                console.error(error);
                setIsAuth(false);
            }
        }
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await api.post('/auth/login', { email, password});
            setIsAuth(true);
            // navigate('/');
        } catch (error) {
            console.error(error);
            setIsAuth(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setIsAuth(false);
            // navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};