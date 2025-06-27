import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import * as types from './vendorTypes';

import {
  fetchSuccess,
  fetchFailure,
  fetchInactiveSuccess,
  fetchInactiveFailure,
  vendorUpdateRequest,
  fetchInactiveVendorsRequest
} from './vendorActions';
// import { config } from '@fortawesome/fontawesome-svg-core';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error("Auth token not found in localStorage");
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `BslogiKey ${token}`,
    },
  };
}

function* fetchActiveVendorsSaga() {
  try {
    const payload = {
      pagination: { index: 1, rowCount: -1, searchObj: null, sortingObj: null },
    };

    const config = yield call(getAuthHeaders);
    const response = yield call(
      axios.put,
      'https://hastin-container.com/staging/api/vendor/search/active',
      payload,
      config
    );
    yield put(fetchSuccess(response.data?.data?.tableData || []));
  } catch (error) {
    yield put(fetchFailure(error?.response?.data?.message || error.message));
  }
}
function* fetchInactiveVendorsSaga() {
  try {
    const payload = {
      pagination: { index: 1, rowCount: -1, searchObj: null, sortingObj: null }
    };

    const config = yield call(getAuthHeaders);
    const response = yield call(
      axios.put,
      'https://hastin-container.com/staging/api/vendor/search/inactive',
      payload,
      config
    );

    console.log("Inactive vendors response:", response.data?.data);

    yield put(fetchInactiveSuccess(response.data?.data?.tableData || []));
  } catch (error) {
    yield put(fetchInactiveFailure(error?.response?.data?.message || error.message));
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
    takeLatest(types.VENDOR_UPDATE_REQUEST, fetchActiveVendorsSaga),
    takeLatest(types.FETCH_INACTIVE_REQUEST, fetchInactiveVendorsSaga),
    takeLatest(types.MARK_INACTIVE_REQUEST, markInactiveSaga),
    takeLatest(types.MARK_ACTIVE_REQUEST, markActiveSaga),
  ]);
}