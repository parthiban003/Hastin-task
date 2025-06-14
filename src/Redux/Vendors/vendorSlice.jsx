// src/redux/vendor/vendorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendors: [],
  countries: [],
  currencies: [],
  cities: [],
  selectedVendor: null,
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    // Vendor list
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

    // Country list
    fetchCountries: (state) => {
      state.loading = true;
    },
    fetchCountriesSuccess: (state, action) => {
      state.countries = action.payload;
      state.loading = false;
    },

    // Currency list
    fetchCurrencies: (state) => {
      state.loading = true;
    },
    fetchCurrenciesSuccess: (state, action) => {
      state.currencies = action.payload;
      state.loading = false;
    },

    // City list
    fetchCities: (state) => {
      state.loading = true;
    },
    fetchCitiesSuccess: (state, action) => {
      state.cities = action.payload;
      state.loading = false;
    },

    // Select vendor for editing
    selectVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
    clearSelectedVendor: (state) => {
      state.selectedVendor = null;
    },

    // Create vendor
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

// Export actions
export const {
  fetchVendors,
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
  clearSelectedVendor
} = vendorSlice.actions;

export default vendorSlice.reducer;
