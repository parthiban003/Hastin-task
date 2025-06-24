// src/redux/Vendors/vendorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    inactiveVendors: [],
    loading: false,
    error: null,
  },
  reducers: {
    vendorUpdateRequest: (state) => {
      state.loading = true;
      
    },
    fetchSuccess: (state, action) => {
      state.vendors = action.payload;
      state.loading = false;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchInactiveVendorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInactiveSuccess: (state, action) => {
      state.inactiveVendors = action.payload;
      state.loading = false;
    },
    fetchInactiveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    markInactiveRequest: (state, action) => {
      
    },
    markActiveRequest: (state, action) => {
      
    },
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
