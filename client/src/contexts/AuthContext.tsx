import { createContext, ReactNode } from 'react';
import { AuthContextType, User } from '../types/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SignupFormData } from '@/components/pages/auth/SignupPage';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null);
    
    const login = async (email: string, password: string) => {
        try {
            const host = import.meta.env.VITE_ANONYMIZER;
            console.log("Lasa izy zay");
            const response = await fetch(`${host}/auth/signin`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password})
            });

            console.log(response);
            
            const data = await response.json();
            
            if (data.success) {
                const newUser = new User();
                newUser.id = data.data;
                setUser(newUser);
                return true;
            } else {
                throw new Error(data.message);
            }

        } catch (error) { // Type the error as any or Error
            console.error("Signup error:", error);

            throw error;
        }
    };

    const signup = async (formData: SignupFormData) => {
        try {
            const host = import.meta.env.VITE_ANONYMIZER;
            console.log("Lasa izy zay");
            const response = await fetch(`${host}/auth/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log(response);

            const data = await response.json();

            if (data.success) {
                return true;
            } else {
                throw new Error(data.message);
            }

        } catch (error) { // Type the error as any or Error
            console.error("Signup error:", error);

            throw error;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user: (user != null) ? user : new User(),
                setUser,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};