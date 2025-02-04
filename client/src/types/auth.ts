export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface LoginFormData {
    email: string;
    password: string;
}
