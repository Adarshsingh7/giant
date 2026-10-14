/** @format */
import { createSlice } from '@reduxjs/toolkit';

export const LOCATIONS = [
  { code: '06', label: 'Bristol', display: 'Bristol' },
  { code: '08', label: 'Southampton', display: 'Southampton' },
];

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    selected: LOCATIONS[0], // default: Bristol
  },
  reducers: {
    setLocation: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
