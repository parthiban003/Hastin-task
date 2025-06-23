// src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import vendorReducer from './Vendors/vendorSlice';
import vendorSaga from './Vendors/vendorSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    vendor: vendorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // disabling redux-thunk since we're using redux-saga
      serializableCheck: false, // optional: avoid warnings from non-serializable values in actions
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(vendorSaga);

export default store;
