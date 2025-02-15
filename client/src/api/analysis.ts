import { AnalysisType, CryptoOption, DateRange } from '@/components/pages/Analysis/Analysis';
import axios from 'axios';

export const fetchCommissionsAnalysis = async (analysisType: AnalysisType, selectedCrypto: CryptoOption | null, dateRange: DateRange) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const now = new Date();
    const offset = 3 * 60 * 60 * 1000;
    const adjustedTime = new Date(now.getTime() + offset);
    const startOf24HoursGMT3 = new Date(now.getTime() - 24 * 60 * 60 * 1000 + offset).toISOString().slice(0, 16);
    const endOfTodayGMT3 = new Date(adjustedTime.getTime()).toISOString().slice(0, 16);

    if (dateRange.min == "" && dateRange.max == "") {
      dateRange.min = startOf24HoursGMT3;
      dateRange.max = endOfTodayGMT3;
    }

    const uri = `/commissions/search?type=${analysisType}&start=${dateRange.min}&end=${dateRange.max}`;
    const url = `${apiHost}${uri}`;

    const formData = new FormData();

    if (selectedCrypto != null) {
      formData.append('cryptoId', `${selectedCrypto.id}`);
    }

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
    console.error('Error fetching cryptocurrencies:', error);
    return null;
  }
};

export const fetchCryptoAnalysis = async (analysisType: AnalysisType, selectedCrypto: CryptoOption[], dateRange: DateRange) => {
  try {
    const apiHost = import.meta.env.VITE_API_HOST;

    if (!apiHost) {
      throw new Error('VITE_API_HOST environment variable is not defined.');
    }

    const now = new Date();
    const offset = 3 * 60 * 60 * 1000;
    const adjustedTime = new Date(now.getTime() + offset);
    const startOf24HoursGMT3 = new Date(now.getTime() - 24 * 60 * 60 * 1000 + offset).toISOString().slice(0, 16);
    const endOfTodayGMT3 = new Date(adjustedTime.getTime()).toISOString().slice(0, 16);

    if (dateRange.min == "" && dateRange.max == "") {
      dateRange.min = startOf24HoursGMT3;
      dateRange.max = endOfTodayGMT3;
    }

    const uri = `/analysis?type=${analysisType}&start=${dateRange.min}&end=${dateRange.max}`;
    const url = `${apiHost}${uri}`;

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