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