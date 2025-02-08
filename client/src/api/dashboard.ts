export const getOpenTransaction = async () => {
    try {
        const host = import.meta.env.VITE_API_HOST;
        const response = await fetch(`${host}/transactions?type=open`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
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
