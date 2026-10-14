/** @format */
import { combineReducers } from '@reduxjs/toolkit';
import salesReducer from '../slices/salesSlice';
import stockReducer from '../slices/stockSlice';
import locationReducer from '../slices/locationSlice';

const rootReducer = combineReducers({
  sales: salesReducer,
  stock: stockReducer,
  location: locationReducer,
});

export default rootReducer;
