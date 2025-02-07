const validatePIN = async (pin: string,  userId: string) => {
    try {
        const host = import.meta.env.VITE_ANONYMIZER;
        console.log("Lasa izy zay");
        const response = await fetch(`${host}/auth/signin/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pin}),
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
