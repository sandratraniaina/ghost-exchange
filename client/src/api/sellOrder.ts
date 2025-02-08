import axios from 'axios';

export const buyCrypto = async (sellOrderId: number, buyerId: number) => {
    try {
        const apiHost = import.meta.env.VITE_API_HOST;

        if (!apiHost) {
            throw new Error('VITE_API_HOST environment variable is not defined.');
        }

        const uri = `/sell-orders/${sellOrderId}/buy`;
        const url = `http://${apiHost}${uri}`;

        const requestBody = {
            "id": buyerId
        };

        const response = await axios.post(url, requestBody);
        return response.data;
    } catch (error) {
        console.error('Error performing buy operation:', error);
        return null;
    }
}

export const fetchSellOrders = async () => {
    try {
        const apiHost = import.meta.env.VITE_API_HOST;

        if (!apiHost) {
            throw new Error('VITE_API_HOST environment variable is not defined.');
        }

        const uri = '/sell-orders?type=open';
        const url = `http://${apiHost}${uri}`;

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching sell orders:', error);
        return null;
    }
};