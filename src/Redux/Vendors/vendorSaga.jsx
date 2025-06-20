import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchVendors,
  fetchVendorsSuccess,
  fetchVendorsFailure,
  fetchCountriesSuccess,
  fetchCitiesSuccess,
  fetchCurrenciesSuccess,
  createVendorSuccess,
  createVendorFailure
} from './vendorSlice';

import {
  fetchVendorsByStatus,
  fetchCountries,
  fetchCities,
  fetchCurrencies,
  createVendor
} from './vendorActions';

// Default vendor fetch
function* fetchVendorsSaga() {
  try {
    const res = yield call(axios.post, 'https://hastin-container.com/staging/api/vendor/search/active');
    yield put(fetchVendorsSuccess(res.data.data));
  } catch (error) {
    yield put(fetchVendorsFailure(error.message));
  }
}

// Fetch vendors based on status
function* fetchVendorsByStatusSaga(action) {
  try {
    const res = yield call(axios.put, `https://hastin-container.com/staging/api/vendor/${action.payload.status}`);
    yield put(fetchVendorsSuccess(res.data.data));
  } catch (error) {
    yield put(fetchVendorsFailure(error.message));
  }
}

// Fetch country list
function* fetchCountriesSaga() {
  try {
    const res = yield call(axios.get, 'https://hastin-container.com/staging/api/meta/country');
    yield put(fetchCountriesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

// Fetch city list by country
function* fetchCitiesSaga(action) {
  try {
    const res = yield call(axios.post, 'https://hastin-container.com/staging/api/countryCities/get', {
      country: action.payload
    });
    yield put(fetchCitiesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

// Fetch currencies
function* fetchCurrenciesSaga() {
  try {
    const res = yield call(axios.get, 'https://hastin-container.com/staging/api/meta/currencies');
    yield put(fetchCurrenciesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

// Create new vendor
function* createVendorSaga(action) {
  try {
    const res = yield call(axios.post, 'https://hastin-container.com/staging/api/vendor/create', action.payload);
    yield put(createVendorSuccess(res.data.data));
  } catch (error) {
    yield put(createVendorFailure(error.message));
  }
}

export default function* vendorSaga() {
  yield all([
    takeLatest(fetchVendors.type, fetchVendorsSaga),
    takeLatest(fetchVendorsByStatus.type, fetchVendorsByStatusSaga),
    takeLatest(fetchCountries.type, fetchCountriesSaga),
    takeLatest(fetchCities.type, fetchCitiesSaga),
    takeLatest(fetchCurrencies.type, fetchCurrenciesSaga),
    takeLatest(createVendor.type, createVendorSaga),
  ]);
}
