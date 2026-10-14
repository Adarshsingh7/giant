/** @format */

// Get all base URLs from environment
const BASE_URLS = import.meta.env.VITE_BASE_URLS;


export const SalesEndPoints = {
  GET_SALES_API: `${BASE_URLS}/Sales/getSalesByLocation`,
  GET_OVERVIEW_API: `${BASE_URLS}/Sales/getOverviewByLocation`,
};

export const StockEndPoints = {
  GET_STOCK_API: `${BASE_URLS}/Stock/getStockByLocation`,
};
