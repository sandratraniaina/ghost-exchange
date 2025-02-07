import { SignupFormData } from "@/components/pages/auth/SignupPage";

export class User {
    id: string = "1";
    email: string = "johndoe@gmail.com";
    avatar: string = "https://randomuser.me/api/portraits";
    role: string = "User";
    password: string = "";
    username: string = "";
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User;
    setUser: (user: User) => void;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (user: SignupFormData) => Promise<boolean>;
    logout: () => void;
}

export interface LoginFormData {
    email: string;
    password: string;
}
