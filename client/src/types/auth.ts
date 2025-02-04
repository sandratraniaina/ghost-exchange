import { SignupFormData } from "@/components/pages/auth/SignupPage";

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (user: SignupFormData) => Promise<void>;
    logout: () => void;
}

export interface LoginFormData {
    email: string;
    password: string;
}
