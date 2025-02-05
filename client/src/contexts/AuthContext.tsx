import { createContext, ReactNode} from 'react';
import { AuthContextType, User } from '../types/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SignupFormData } from '@/components/pages/auth/SignupPage';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null);

    const login = async (email: string, password: string) => {
        // TODO: Replace with an API call
        setUser(new User());
    };

    const signup = async (user: SignupFormData) => {
        console.log("User signed up");
        console.log(user);
    }

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};