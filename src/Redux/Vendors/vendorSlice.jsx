import { createSlice } from '@reduxjs/toolkit';

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    inactiveVendors: [],
    loading: false,
    error: null,
    selectedVendor: null,
    cities: [],
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

    markInactiveRequest: () => {},
    markActiveRequest: () => {},

    
    fetchVendorDetailsSuccess: (state, action) => {
      state.selectedVendor = action.payload;
       state.loading = false;
    },
    fetchVendorDetailsFailure: (state, action) => {
      state.selectedVendor = null;
      state.loading = false;
      state.error = action.payload;
    },

    
    fetchCitiesSuccess: (state, action) => {
      state.cities = action.payload;
    },
    fetchCitiesFailure: (state, action) => {
      state.error = action.payload;
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

  fetchVendorDetailsSuccess,
  fetchVendorDetailsFailure,
  fetchCitiesSuccess,
  fetchCitiesFailure,
} = vendorSlice.actions;

export default vendorSlice.reducer;
