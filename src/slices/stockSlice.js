/** @format */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStockData } from '../service/operations/stockOperations';

// Async thunk to fetch stock data
export const getStock = createAsyncThunk('stock/getStock', async (_, thunkAPI) => {
  try {
    const loc = thunkAPI.getState().location.selected.code;
    const response = await fetchStockData({ loc });
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || error.message || 'Something went wrong'
    );
  }
});

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stockData: [],
    loading: false,
    error: null,

    // NEW STATES
    mpnFilter: '',
    rowsPerPage: 10,
    page: 1,
  },
  reducers: {
    clearStockError: (state) => {
      state.error = null;
    },
    resetStockData: (state) => {
      state.stockData = [];
    },

    // NEW REDUCERS
    setMpnFilter: (state, action) => {
      state.mpnFilter = action.payload;
      state.page = 1; // reset page on filter change
    },
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stock data';
      });
  },
});

export const {
  clearStockError,
  resetStockData,
  setMpnFilter,
  setRowsPerPage,
  setPage,
} = stockSlice.actions;

export default stockSlice.reducer;
