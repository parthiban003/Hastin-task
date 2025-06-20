import { createAction } from '@reduxjs/toolkit';

// Action to fetch vendors based on status (active/inactive)
export const fetchVendorsByStatus = createAction('FETCH_VENDORS_BY_STATUS');

// Existing utility actions
export const fetchCountries = createAction('FETCH_COUNTRIES_REQUEST');
export const fetchCurrencies = createAction('FETCH_CURRENCIES_REQUEST');
export const fetchCities = createAction('FETCH_CITIES_REQUEST'); // payload: country name
export const createVendor = createAction('CREATE_VENDOR_REQUEST'); // payload: vendor data
