import { useRouter, useSegments } from "expo-router";
import { createContext, useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    username: string;
    avatar: string;
    balance: number;
} | null;

export const AuthContext = createContext<{
    user: User;
    login: (email: string, password: string) => void;
    logout: () => void;
}>({
    user: null,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const segments = useSegments();
    const router = useRouter();

    // Mock user data
    const mockUser = {
        id: '1',
        email: 'user@example.com',
        username: 'JohnDoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        balance: 1000.00
    };

    useEffect(() => {
        const isLoginPage = segments[0] === 'login';

        if (!user && !isLoginPage) {
            router.replace('/login');
        }
    }, [user, segments]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login: () => setUser(mockUser),
                logout: () => setUser(null),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}