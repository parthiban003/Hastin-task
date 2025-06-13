// src/redux/vendor/vendorSaga.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchVendors,
  fetchVendorsSuccess,
  fetchVendorsFailure,
  fetchCountries,
  fetchCountriesSuccess,
  fetchCities,
  fetchCitiesSuccess,
  fetchCurrencies,
  fetchCurrenciesSuccess,
  createVendorRequest,
  createVendorSuccess,
  createVendorFailure
} from '../vendorSlice';

function* fetchVendorsSaga() {
  try {
    const res = yield call(axios.post, 'https://hastin-container.com/staging/api/vendor/search/active');
    yield put(fetchVendorsSuccess(res.data.data));
  } catch (error) {
    yield put(fetchVendorsFailure(error.message));
  }
}

function* fetchCountriesSaga() {
  try {
    const res = yield call(axios.post, 'https://hastin-container.com/staging/api/meta/country');
    yield put(fetchCountriesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

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

function* fetchCurrenciesSaga() {
  try {
    const res = yield call(axios.post, 'https://hastin-container.com/staging/api/meta/currencies');
    yield put(fetchCurrenciesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

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
    takeLatest(fetchCountries.type, fetchCountriesSaga),
    takeLatest(fetchCities.type, fetchCitiesSaga),
    takeLatest(fetchCurrencies.type, fetchCurrenciesSaga),
    takeLatest(createVendorRequest.type, createVendorSaga),
  ]);
}
