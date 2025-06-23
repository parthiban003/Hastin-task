// src/Redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import vendorReducer from './Vendors/vendorSlice';
import rootSaga from './rootSaga';
// import rootSaga from './Vendors/rootSaga'; 

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    vendor: vendorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
