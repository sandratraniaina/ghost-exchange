import { useRouter, useSegments } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

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

    // Function to register for push notifications
    async function registerForPushNotificationsAsync() {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return null;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        return token;
    }

    // Function to update FCM token in Firestore
    const updateFCMToken = async (email: string, token: string) => {
        try {
            const usersCollection = collection(db, "account");
            const q = query(usersCollection, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, "account", userDoc.id), {
                    fcmToken: token
                });
                console.log("FCM token updated successfully");
            }
        } catch (error) {
            console.error("Error updating FCM token:", error);
        }
    };

    const fetchUserData = async (email: string) => {
        try {
            const usersCollection = collection(db, "account");
            const q = query(usersCollection, where("email", "==", email));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.size > 0) {
                const userDoc = querySnapshot.docs[0];
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

    useEffect(() => {
        const isLoginPage = segments[0] === "login";
        if (!user && !isLoginPage) {
            router.replace("/login");
        }
    }, [user, segments]);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const userData = await fetchUserData(email);
            setUser(userData);

            // Generate and store FCM token after successful login
            const token = await registerForPushNotificationsAsync();
            if (token) {
                await updateFCMToken(email, token);
            }
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

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