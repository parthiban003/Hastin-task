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
  if (!token){
    console.warn("No authToken found")
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlYnJhaW4iLCJzY29wZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlzcyI6Imh0dHA6Ly9lYnJhaW50ZWNobm9sb2dpZXMuY29tIiwiaWF0IjoxNzUwNzY2MzcyLCJleHAiOjE3NTA3ODQzNzJ9.HWls-MBuCzXVD0T2Etj4muO-qiTRgf6WYBZtVYH5CAs`
    },
  };
}

function* fetchActiveVendorsSaga(action) {
  try {
    const response = yield call(
      axios.put,
      'https://hastin-container.com/staging/api/vendor/search/active',
      {}, 
      getAuthHeaders() 
    );
    console.log("Fetched vendors:", response.data);
    yield put(fetchSuccess(response.data.data)); // 
  } catch (error) {
    console.error("Fetch vendors error:", error);
    yield put(fetchFailure(error.message));
  }
}

function* fetchInactiveVendorsSaga() {
  try {
    const response = yield call(
      axios.put,
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
    yield put(vendorUpdateRequest()); 
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
    yield put(fetchInactiveVendorsRequest()); 
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
