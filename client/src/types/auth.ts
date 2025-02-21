import { SignupFormData } from "@/components/pages/auth/SignupPage";
import React from "react";

export type UserRole = "ADMIN" | "CLIENT";

export class User {
    id: string = "1";
    email: string = "johndoe@gmail.com";
    avatar: string = "https://randomuser.me/api/portraits";
    role: UserRole = "CLIENT"; // Updated to use UserRole type
    password: string = "";
    username: string = "";
    fiatBalance: number = 0;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User;
    setUser: (user: React.SetStateAction<User | null>) => void;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (user: SignupFormData) => Promise<boolean>;
    logout: () => void;
}

export interface LoginFormData {
    email: string;
    password: string;
}
