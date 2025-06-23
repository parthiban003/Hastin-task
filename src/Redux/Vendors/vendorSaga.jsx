// src/redux/Vendors/vendorSaga.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
  vendorUpdateRequest,
  fetchSuccess,
  fetchFailure,
  fetchInactiveVendorsRequest,
  fetchInactiveSuccess,
  fetchInactiveFailure,
  markInactiveRequest,
  markActiveRequest,
} from './vendorSlice';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

function* fetchActiveVendorsSaga() {
  try {
    const response = yield call(
      axios.post,
      'https://hastin-container.com/staging/api/vendor/search/active',
      {},
      getAuthHeaders()
    );
    yield put(fetchSuccess(response.data.data));
  } catch (error) {
    yield put(fetchFailure(error.message));
  }
}

function* fetchInactiveVendorsSaga() {
  try {
    const response = yield call(
      axios.post,
      'https://hastin-container.com/staging/api/vendor/search/inactive',
      {},
      getAuthHeaders()
    );
    yield put(fetchInactiveSuccess(response.data.data));
  } catch (error) {
    yield put(fetchInactiveFailure(error.message));
  }
}

function* markInactiveSaga(action) {
  try {
    yield call(
      axios.put,
      'https://hastin-container.com/staging/api/vendor/status/update',
      { vendorId: action.payload, status: 'INACTIVE' },
      getAuthHeaders()
    );
    yield put(vendorUpdateRequest()); // refresh active list
  } catch (error) {
    console.error('Error marking inactive:', error.message);
  }
}

function* markActiveSaga(action) {
  try {
    yield call(
      axios.put,
      'https://hastin-container.com/staging/api/vendor/status/update',
      { vendorId: action.payload, status: 'ACTIVE' },
      getAuthHeaders()
    );
    yield put(fetchInactiveVendorsRequest()); // refresh inactive list
  } catch (error) {
    console.error('Error marking active:', error.message);
  }
}

export default function* vendorSaga() {
  yield all([
    takeLatest(vendorUpdateRequest.type, fetchActiveVendorsSaga),
    takeLatest(fetchInactiveVendorsRequest.type, fetchInactiveVendorsSaga),
    takeLatest(markInactiveRequest.type, markInactiveSaga),
    takeLatest(markActiveRequest.type, markActiveSaga),
  ]);
}
