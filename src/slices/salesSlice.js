/** @format */
import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const defaultSalesFilters = {
  startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  mpn: '',
  rowsPerPage: 10,
  page: 1,
};

const defaultOverviewFilters = {
  startDate: dayjs().startOf('year').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
};

const savedSalesFilters =
  (typeof window !== 'undefined' && localStorage.getItem('salesFilters')) || null;

const savedOverviewFilters =
  (typeof window !== 'undefined' && localStorage.getItem('overviewFilters')) || null;

const initialState = {
  salesFilters: savedSalesFilters ? JSON.parse(savedSalesFilters) : defaultSalesFilters,
  overviewFilters: savedOverviewFilters ? JSON.parse(savedOverviewFilters) : defaultOverviewFilters,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSalesFilters: (state, action) => {
      state.salesFilters = {
        ...state.salesFilters,
        ...action.payload,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('salesFilters', JSON.stringify(state.salesFilters));
      }
    },
    resetSalesFilters: (state) => {
      state.salesFilters = defaultSalesFilters;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('salesFilters');
      }
    },
    setOverviewFilters: (state, action) => {
      state.overviewFilters = {
        ...state.overviewFilters,
        ...action.payload,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('overviewFilters', JSON.stringify(state.overviewFilters));
      }
    },
    resetOverviewFilters: (state) => {
      state.overviewFilters = defaultOverviewFilters;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('overviewFilters');
      }
    },
  },
});

export const {
  setSalesFilters,
  resetSalesFilters,
  setOverviewFilters,
  resetOverviewFilters,
} = salesSlice.actions;

export default salesSlice.reducer;
