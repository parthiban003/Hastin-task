// src/redux/vendor/vendorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    selectedVendor: null,
    countries: [],
    cities: [],
    currencies: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchVendors: (state) => {
      state.loading = true;
    },
    fetchVendorsSuccess: (state, action) => {
      state.vendors = action.payload;
      state.loading = false;
    },
    fetchVendorsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    selectVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
    fetchCountriesSuccess: (state, action) => {
      state.countries = action.payload;
    },
    fetchCitiesSuccess: (state, action) => {
      state.cities = action.payload;
    },
    fetchCurrenciesSuccess: (state, action) => {
      state.currencies = action.payload;
    },
    createVendorRequest: (state) => {
      state.loading = true;
    },
    createVendorSuccess: (state, action) => {
      state.vendors.push(action.payload);
      state.loading = false;
    },
    createVendorFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchVendors,
  fetchVendorsSuccess,
  fetchVendorsFailure,
  selectVendor,
  clearSelectedVendor,
  fetchCountriesSuccess,
  fetchCitiesSuccess,
  fetchCurrenciesSuccess,
  createVendorRequest,
  createVendorSuccess,
  createVendorFailure,
} = vendorSlice.actions;

export default vendorSlice.reducer;
