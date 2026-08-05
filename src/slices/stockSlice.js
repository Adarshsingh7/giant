/** @format */
import { createSlice } from '@reduxjs/toolkit';

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    mpnFilter: '',
    rowsPerPage: 10,
    page: 1,
  },
  reducers: {
    setMpnFilter: (state, action) => {
      state.mpnFilter = action.payload;
      state.page = 1;
    },
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setMpnFilter, setRowsPerPage, setPage } = stockSlice.actions;

export default stockSlice.reducer;
