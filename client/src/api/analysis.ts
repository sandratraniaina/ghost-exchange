import { AnalysisType, CryptoOption, DateRange } from '@/components/pages/Analysis/Analysis';
import axios from 'axios';

export const fetchCryptoAnalysis = async (analysisType: AnalysisType, selectedCrypto: CryptoOption[], dateRange: DateRange) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const uri = `/analysis?type=${analysisType}&start=${dateRange.min}&end=${dateRange.max}`;
    const url = `http://${apiHost}${uri}`;

    const requestBody = selectedCrypto;
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