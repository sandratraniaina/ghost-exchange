import axios from 'axios';

export const fetchCryptoOptions = async () => {
  try {
    const apiHost = process.env.REACT_APP_API_HOST;
    if (!apiHost) {
      throw new Error('REACT_APP_API_HOST environment variable is not defined.');
    }

    const uri = '/cryptocurrencies';
    const url = `http://${apiHost}${uri}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      return null;
    }

    return response.data.json();

  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    return null;
  }
};