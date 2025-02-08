import { useRouter, useSegments } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase"; // Import Firebase auth & Firestore

class User {
    id: string = "";
    email: string = "";
    username: string = "";
    avatar: string = "";
    balance: number = 0;
} ;

export const AuthContext = createContext<{
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}>({
    user: null,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const segments = useSegments();
    const router = useRouter();

    // Mock user data
    const mockUser = {
        id: '1',
        email: 'user@example.com',
        username: 'JohnDoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=default',
        balance: 1000.00
    };

    useEffect(() => {
        const isLoginPage = segments[0] === 'login';

        if (!user && !isLoginPage) {
            router.replace('/login');
        }
    }, [user, segments]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}