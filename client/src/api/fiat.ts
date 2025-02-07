import axios from 'axios';

export const createTransaction = async (userId: number, amount: number, transactionType: string) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    if (!["WITHDRAW", "DEPOSIT"].includes(transactionType)) {
      throw new Error('Invalid transaction type.');
    }

    const uri = '/transactions';
    const url = `http://${apiHost}${uri}`;

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