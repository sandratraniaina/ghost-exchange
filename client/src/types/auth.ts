import { SignupFormData } from "@/components/pages/auth/SignupPage";

export class User {
    id: string = "1";
    name: string = "John Doe";
    email: string = "johndoe@gmail.com";
    avatar: string = "https://randomuser.me/api/portraits";
    role: string = "User";
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User;
    login: (email: string, password: string) => Promise<void>;
    signup: (user: SignupFormData) => Promise<void>;
    logout: () => void;
}

export interface LoginFormData {
    email: string;
    password: string;
}
