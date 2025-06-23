// src/redux/Vendors/vendorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  inactiveVendors: [],
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    vendorUpdateRequest: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.vendors = action.payload;
      state.loading = false;
    },
    fetchFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchInactiveVendorsRequest: (state) => {
      state.loading = true;
    },
    fetchInactiveSuccess: (state, action) => {
      state.inactiveVendors = action.payload;
      state.loading = false;
    },
    fetchInactiveFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    markInactiveRequest: () => {},
    markActiveRequest: () => {},
  },
});

export const {
  vendorUpdateRequest,
  fetchSuccess,
  fetchFailure,
  fetchInactiveVendorsRequest,
  fetchInactiveSuccess,
  fetchInactiveFailure,
  markInactiveRequest,
  markActiveRequest,
} = vendorSlice.actions;

export default vendorSlice.reducer;
