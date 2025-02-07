import axios from 'axios';

export const getSellOrders = async () => {
    try {
        const apiHost = import.meta.env.VITE_API_HOST;

        if (!apiHost) {
            throw new Error('VITE_API_HOST environment variable is not defined.');
        }

        const uri = '/sell-orders';
        const url = `http://${apiHost}${uri}`;

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching sell orders:', error);
        return null;
    }
};