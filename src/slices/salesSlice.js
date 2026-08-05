/** @format */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchSalesData,
  fetchOverviewData,
} from '../service/operations/salesOperations';
import dayjs from 'dayjs';

/* ----------------------------- Async Thunks ----------------------------- */

export const getSales = createAsyncThunk(
  'sales/getSales',
  async ({ DtFrom, DtTo, mpn }, thunkAPI) => {
    try {
      const res = await fetchSalesData({ DtFrom, DtTo, mpn });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOverview = createAsyncThunk(
  'sales/getOverview',
  async ({ DtFrom, DtTo }, thunkAPI) => {
    try {
      const res = await fetchOverviewData({ DtFrom, DtTo });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ----------------------------- Initial State ----------------------------- */

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
  salesData: [],
  overviewData: null,

  salesFilters: savedSalesFilters ? JSON.parse(savedSalesFilters) : defaultSalesFilters,
  overviewFilters: savedOverviewFilters ? JSON.parse(savedOverviewFilters) : defaultOverviewFilters,

  loadingSales: false,
  loadingOverview: false,
  errorSales: null,
  errorOverview: null,
};

/* ----------------------------- Slice ----------------------------- */

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

  extraReducers: (builder) => {
    builder
      .addCase(getSales.pending, (state) => {
        state.loadingSales = true;
        state.errorSales = null;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.loadingSales = false;
        state.salesData = action.payload;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.loadingSales = false;
        state.errorSales = action.payload || action.error.message;
      })

      .addCase(getOverview.pending, (state) => {
        state.loadingOverview = true;
        state.errorOverview = null;
      })
      .addCase(getOverview.fulfilled, (state, action) => {
        state.loadingOverview = false;
        state.overviewData = action.payload;
      })
      .addCase(getOverview.rejected, (state, action) => {
        state.loadingOverview = false;
        state.errorOverview = action.payload || action.error.message;
      });
  },
});

export const {
  setSalesFilters,
  resetSalesFilters,
  setOverviewFilters,
  resetOverviewFilters,
} = salesSlice.actions;

export default salesSlice.reducer;
