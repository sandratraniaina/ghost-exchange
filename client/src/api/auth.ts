import { User } from "@/types/auth";

export const validatePIN = async (pin: string, userId: string) => {
    try {
        const host = import.meta.env.VITE_ANONYMIZER;
        const response = await fetch(`http://localhost:5000/api/auth/signin/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ PIN: pin }),
        });

        const data = await response.json();

        if (data.success) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        // Type the error as any or Error
        console.error("PIN Validation error:", error);

        throw error;
    }
};

export const sendUserData = async (user: User) => {
    try {
        const host = import.meta.env.VITE_API_HOST;
        const response = await fetch(`${host}/users/sign-in`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": user.email,
                "username": user.username,
                "pwd": user.password,
            }),
        });

        console.log(response);

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        // Type the error as any or Error
        console.error("PIN Validation error:", error);

        throw error;
    }
};
