import { AnalysisType, CryptoOption, DateRange } from '@/components/pages/Analysis/Analysis';
import axios from 'axios';

export const fetchCommissionsAnalysis = async (analysisType: AnalysisType, selectedCrypto: CryptoOption, dateRange: DateRange) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const today = new Date();
    const midnightToday = new Date(today.setHours(0, 0, 0, 0)).toISOString().slice(0, 16);
    const endOfToday = new Date(today.setHours(23, 59, 0, 0)).toISOString().slice(0, 16);

    if (dateRange.min == "" && dateRange.max == "") {
      dateRange.min = midnightToday;
      dateRange.max = endOfToday;
    }

    const uri = `/commissions/search?type=${analysisType}&start=${dateRange.min}&end=${dateRange.max}`;
    const url = `${apiHost}${uri}`;

    const formData = new FormData();
    formData.append('cryptoId', `${selectedCrypto.id}`);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status !== 200) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching commissions analysis data:', error);
    return null;
  }
};

export const fetchCryptoAnalysis = async (analysisType: AnalysisType, selectedCrypto: CryptoOption[], dateRange: DateRange) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const today = new Date();
    const midnightToday = new Date(today.setHours(0, 0, 0, 0)).toISOString().slice(0, 16);
    const endOfToday = new Date(today.setHours(23, 59, 0, 0)).toISOString().slice(0, 16);

    if (dateRange.min == "" && dateRange.max == "") {
      dateRange.min = midnightToday;
      dateRange.max = endOfToday;
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
    console.error('Error fetching cryptocurrencies analysis data:', error);
    return null;
  }
}