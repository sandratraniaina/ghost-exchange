export const getUserActivity = async (startDate, endDate) => {
    try {
        const host = import.meta.env.VITE_API_HOST;
        const response = await fetch(`${host}/users/transactions/summary?min=${startDate}&max=${endDate}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

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