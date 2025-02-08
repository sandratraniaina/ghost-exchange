import { useRouter, useSegments } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase"; // Import Firebase auth & Firestore

class User {
    id: string = "";
    email: string = "";
    username: string = "";
    avatar: string = "";
    balance: number = 0;
};

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

    const fetchUserData = async (email: string) => {
        try {
            const usersCollection = collection(db, "account");
            const q = query(usersCollection, where("email", "==", email)); // Query by email

            const querySnapshot = await getDocs(q);

            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0]; // Get the first document (assuming only one match)
                const userData = userDoc.data();
                const user: User = {
                    id: userDoc.id,
                    email: userData.email,
                    username: userData.username,
                    avatar: userData.avatar,
                    balance: userData.fiatBalance
                };
                return user;
            } else {
                console.log("No user found with that email.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    // Handle Firebase authentication state changes

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
            setUser(await fetchUserData(email));
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
