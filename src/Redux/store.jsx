import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from './authSlice';
import vendorReducer from '../Vendors/vendorSlice'; // ✅ adjust the path if needed
import vendorSaga from '../Vendors/vendorSaga';     // ✅ adjust the path if needed

// 1. Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// 2. Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer, // ✅ added vendor reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 3. Run saga
sagaMiddleware.run(vendorSaga);
