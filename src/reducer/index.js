/** @format */
import { combineReducers } from '@reduxjs/toolkit';
import salesReducer from '../slices/salesSlice';
import stockReducer from '../slices/stockSlice';

const rootReducer = combineReducers({
  sales: salesReducer,
  stock: stockReducer,
});

export default rootReducer;
