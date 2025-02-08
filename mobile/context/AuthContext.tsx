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
    login: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const segments = useSegments();
    const router = useRouter();

    // Fetch user details from Firestore
    const fetchUserData = async (email: string) => {
        try {
            const userDoc = await getDoc(doc(db, "account", email));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    id: userDoc.id,
                    email: userData.email,
                    username: userData.username,
                    avatar: userData.avatar,
                    balance: userData.balance
                });
            } else {
                console.log("No user found in Firestore.");
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Handle Firebase authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                fetchUserData(firebaseUser.email!);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Redirect to login if user is not authenticated
    useEffect(() => {
        const isLoginPage = segments[0] === "login";
        if (!user && !isLoginPage) {
            router.replace("/login");
        }
    }, [user, segments]);

    // Handle user login
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const newUser = new User();
            newUser
            console.log("I am logged in");
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

    // Handle user logout
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
