import { createContext, ReactNode} from 'react';
import { AuthContextType, User } from '../types/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null);

    const login = async (email: string, password: string) => {
        // Replace with actual API call
        const mockUser: User = { id: '1', name: 'John Doe', email};
        setUser(mockUser);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};