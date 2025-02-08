export const getOpenTransaction = async () => {
    try {
        const host = import.meta.env.VITE_API_HOST;
        const response = await fetch(`http://${host}/transactions?type=open`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(response);

        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        // Type the error as any or Error
        console.error("Error while fetching transaction data", error);

        throw error;
    }
};

export const acceptTransaction = async (transactionId: number) => {
    try {
        const host = import.meta.env.VITE_API_HOST;
        const response = await fetch(`http://${host}/transactions/${transactionId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
        console.error("Error while declining a transaction", error);

        throw error;
    }
};


export const declineTransaction = async (transactionId: number) => {
    try {
        const host = import.meta.env.VITE_API_HOST;
        const response = await fetch(`http://${host}/transactions/${transactionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
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
        console.error("Error while declining a transaction", error);

        throw error;
    }
};
