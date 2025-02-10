import axios from 'axios';

export const createTransaction = async (userId: number, amount: number, transactionType: "DEPOSIT" | "WITHDRAW") => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = '/transactions';
    const url = `${apiHost}${uri}`;

    const requestBody = {
      "user": {
        "id": userId
      },
      "amount": amount,
      "transactionType": transactionType
    };

    const response = await axios.post(url, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error performing transaction operation:', error);
    return null;
  }
};