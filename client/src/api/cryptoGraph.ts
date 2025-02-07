import axios from 'axios';

export const fetchCryptoHistory = async (exchangeId: number) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;
    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/exchanges?interval=1';
    const url = `http://${apiHost}${uri}`;

    const requestBody = [ {id: exchangeId} ];

    const response = await axios.post(url, requestBody);
    return response.data;

  } catch (error) {
    console.error('Error fetching graph data:', error);
    return null;
  }
};