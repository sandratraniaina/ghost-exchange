import axios from 'axios';

export const fetchCommissions = async () => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/commissions';
    const url = `http://${apiHost}${uri}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error performing transaction operation:', error);
    return null;
  }
};

export const updateCommissions = async (salesCommission: number, purchaseCommission: number) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/commissions/1';
    const url = `http://${apiHost}${uri}`;

    const requestBody = {
      salesCommission: salesCommission,
      purchasesCommission: purchaseCommission
    };

    const response = await axios.put(url, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error performing transaction operation:', error);
    return null;
  }
}