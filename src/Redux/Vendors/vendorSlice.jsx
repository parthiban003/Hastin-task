// src/redux/Vendors/vendorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    status: 'idle',
    error: null,
    countries: [],
    currencies: [],
    cities: [],
    selectedVendor: null,
  },

  reducers: {
    fetchVendorsByStatus: (state, action) => {
      state.status = 'loading';
      
    },
    fetchVendorsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.vendors = action.payload;
    },
    fetchVendorsFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchCountries: () => {},
    fetchCountriesSuccess: (state, action) => {
      state.countries = action.payload;
    },
    fetchCurrencies: () => {},
    fetchCurrenciesSuccess: (state, action) => {
      state.currencies = action.payload;
    },
    fetchCities: () => {},
    fetchCitiesSuccess: (state, action) => {
      state.cities = action.payload;
    },
    createVendorRequest: () => {},
    createVendorSuccess: (state, action) => {
      state.vendors.push(action.payload);
    },
    createVendorFailure: (state, action) => {
      state.error = action.payload;
    },
    selectVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },
  },
});

export const {
  fetchVendorsByStatus,
  fetchVendorsSuccess,
  fetchVendorsFailure,
  fetchCountries,
  fetchCountriesSuccess,
  fetchCurrencies,
  fetchCurrenciesSuccess,
  fetchCities,
  fetchCitiesSuccess,
  createVendorRequest,
  createVendorSuccess,
  createVendorFailure,
  selectVendor,
  clearSelectedVendor,
} = vendorSlice.actions;

export default vendorSlice.reducer;
