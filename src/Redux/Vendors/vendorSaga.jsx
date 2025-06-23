// src/redux/Vendors/vendorSaga.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchVendorsByStatus,
  fetchVendorsSuccess,
  fetchVendorsFailure,
  fetchCountriesSuccess,
  fetchCitiesSuccess,
  fetchCurrenciesSuccess,
  createVendorSuccess,
  createVendorFailure,
  createVendorRequest,
  fetchCountries,
  fetchCities,
  fetchCurrencies
} from './vendorSlice';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
    
    
  };

}


function* fetchVendorsSaga(action) {
  try {
    const status = action.payload?.status || 'active';
    const res = yield call(
      axios.put,
      `https://hastin-container.com/staging/api/vendor/search/${status}`,
      {},
      getAuthHeaders()
    );
    yield put(fetchVendorsSuccess(res.data.data));
  } catch (error) {
    yield put(fetchVendorsFailure(error.message));
  }
}

function* fetchCountriesSaga() {
  try {
    const res = yield call(
      axios.get,
      'https://hastin-container.com/staging/api/meta/country',
      getAuthHeaders()
    );
    yield put(fetchCountriesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

function* fetchCitiesSaga(action) {
  try {
    const res = yield call(
      axios.post,
      'https://hastin-container.com/staging/api/countryCities/get',
      { country: action.payload },
      getAuthHeaders()
    );
    yield put(fetchCitiesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

function* fetchCurrenciesSaga() {
  try {
    const res = yield call(
      axios.get,
      'https://hastin-container.com/staging/api/meta/currencies',
      getAuthHeaders()
    );
    yield put(fetchCurrenciesSuccess(res.data.data));
  } catch (error) {
    console.error(error);
  }
}

function* createVendorSaga(action) {
  try {
    const res = yield call(
      axios.post,
      'https://hastin-container.com/staging/api/vendor/create',
      action.payload,
      getAuthHeaders()
    );
    yield put(createVendorSuccess(res.data.data));
  } catch (error) {
    yield put(createVendorFailure(error.message));
  }
}

export default function* vendorSaga() {
  yield all([
    takeLatest(fetchVendorsByStatus.type, fetchVendorsSaga),
    takeLatest(fetchCountries.type, fetchCountriesSaga),
    takeLatest(fetchCities.type, fetchCitiesSaga),
    takeLatest(fetchCurrencies.type, fetchCurrenciesSaga),
    takeLatest(createVendorRequest.type, createVendorSaga),
  ]);
}
