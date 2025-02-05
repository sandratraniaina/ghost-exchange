import { createContext, ReactNode } from 'react';
import { AuthContextType, User } from '../types/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SignupFormData } from '@/components/pages/auth/SignupPage';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null);

    const login = async (email: string, password: string) => {
        // Mock successful API login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new User instance with the provided email
        const mockUser = new User();
        mockUser.email = email;
        mockUser.name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '); // Convert email to name
        mockUser.id = Math.random().toString(36).substr(2, 9); // Random ID
        mockUser.avatar = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;
        mockUser.role = "User";
        
        setUser(mockUser);
    };

    const signup = async (formData: SignupFormData) => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new User instance with the signup form data
        const mockUser = new User();
        mockUser.email = formData.email;
        mockUser.name = `${formData.firstName} ${formData.lastName}`;
        mockUser.id = Math.random().toString(36).substr(2, 9); // Random ID
        mockUser.avatar = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;
        mockUser.role = "User";
        
        setUser(mockUser);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user: (user != null) ? user : new User(),
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};