import axios from 'axios';

export const fetchUserBalance = async (userId: number) => {
    try {
        const apiHost = import.meta.env.VITE_API_HOST;

        if (!apiHost) {
            throw new Error('VITE_API_HOST environment variable is not defined.');
        }

        const uri = `/users/balances`;
        const url = `http://${apiHost}${uri}`;

        const formData = new FormData();
        formData.append('userId', `${userId}`);

        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user wallet:', error);
        return null;
    }
}

export const getUserWallet = async (userId: number) => {
    try {
        const apiHost = import.meta.env.VITE_API_HOST;

        if (!apiHost) {
            throw new Error('VITE_API_HOST environment variable is not defined.');
        }

        const uri = `/users/${userId}/wallets`;
        const url = `http://${apiHost}${uri}`;

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching user wallet:', error);
        return null;
    }
};