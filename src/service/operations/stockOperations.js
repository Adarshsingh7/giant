/** @format */
import { apiConnector } from '../apiConnector';
import { StockEndPoints } from '../api';

export const fetchStockData = async ({ loc } = {}) => {
  try {
    const response = await apiConnector('GET', StockEndPoints.GET_STOCK_API, null, {}, { loc });

    if (response?.status === 200 && Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Unexpected response format or empty stock data');
    }

  } catch (error) {
    console.error('Error fetching stock data:', error?.response?.data || error.message);
    throw error;
  }
};
