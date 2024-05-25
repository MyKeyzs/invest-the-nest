// services/stockService.ts
import axios from 'axios';

const API_URL = 'https://api.polygon.io/v2/aggs/ticker/';

interface StockData {
  ticker: string;
  results: { c: number }[]; // Adjust this type based on actual API response
}

export const fetchStockData = async (ticker: string): Promise<StockData> => {
  try {
    const response = await axios.get(`${API_URL}${ticker}/prev`, {
      params: {
        apiKey: 'YOUR_API_KEY'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data', error);
    throw error;
  }
};