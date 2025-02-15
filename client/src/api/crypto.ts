import axios from 'axios';

export const sellCrypto = async (sellerId: number, cryptoId: number, fiatPrice: number, volume: number) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/sell-orders';
    const url = `${apiHost}${uri}`;

    const requestBody = {
      "seller": {
        "id": sellerId
      },
      "cryptocurrency": {
        "id": cryptoId
      },
      "fiatPrice": fiatPrice,
      "amount": volume,
      "isOpen": true
    };

    const response = await axios.post(url, requestBody);

    if (response.status !== 200) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    return null;
  }
}

export const fetchCryptoOptions = async () => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/cryptocurrencies';
    const url = `${apiHost}${uri}`;

    const response = await axios.get(url);

    if (response.status !== 200) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    return null;
  }
};

export const fetchCryptoHistory = async (exchangeId: number) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;
    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/exchanges?interval=1';
    const url = `${apiHost}${uri}`;

    const requestBody = [{ id: exchangeId }];

    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return null;
  }
};