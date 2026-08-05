/** @format */
import { apiConnector } from '../apiConnector';
import { SalesEndPoints } from '../api';

export const fetchSalesData = async ({ DtFrom, DtTo }) => {
  try {
    const response = await apiConnector(
      'GET',
      SalesEndPoints.GET_SALES_API,
      null,
      {},
      { DtFrom, DtTo }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

export const fetchOverviewData = async ({ DtFrom, DtTo }) => {
  try {
    const response = await apiConnector(
      'GET',
      SalesEndPoints.GET_OVERVIEW_API,
      null,
      {}, // no headers
      { DtFrom, DtTo } // query parameters
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching overview data:', error);
    throw error;
  }
};
