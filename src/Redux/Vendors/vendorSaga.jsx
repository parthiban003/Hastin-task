import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as types from './vendorTypes';

import {
  fetchSuccess,
  fetchFailure,
  fetchInactiveSuccess,
  fetchInactiveFailure,
  vendorUpdateRequest,
  createVendorSuccess,
  createVendorFailure,
} from './vendorActions';

import {
  fetchVendorDetailsSuccess,
  fetchVendorDetailsFailure,
  fetchCitiesSuccess,
  fetchCitiesFailure,
  updateVendorStatusSuccess,
  updateVendorStatusFailure,
} from './vendorSlice';

import { toast } from 'react-toastify';
import API_BASE_URL from '../../Components/axiosInstance';

function* fetchActiveVendorsSaga() {
  try {
    const payload = {
      pagination: { index: 1, rowCount: -1, searchObj: null, sortingObj: null },
    };

    const response = yield call(
      API_BASE_URL.put,
      '/vendor/search/active',
      payload,
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

    const response = yield call(
      API_BASE_URL.put,
      '/vendor/search/inactive',
      payload,
    );

    yield put(fetchInactiveSuccess(response.data?.data?.tableData || []));
  } catch (error) {
    yield put(fetchInactiveFailure(error?.response?.data?.message || error.message));
  }
}

function* markInactiveSaga(action) {
  try {
    const vendorId = action.payload;
    yield call(API_BASE_URL.put, `/vendor/inactive/${vendorId}`);
    yield put(updateVendorStatusSuccess({ id: vendorId, status: 'INACTIVE' }));
    yield put({ type: types.FETCH_INACTIVE_REQUEST });
    yield put({ type: types.VENDOR_UPDATE_REQUEST });
  } catch (error) {
    yield put(updateVendorStatusFailure(error.message));
  }
}

function* markActiveSaga(action) {
  try {
    const vendorId = action.payload;
    yield call(API_BASE_URL.put, `/vendor/active/${vendorId}`);
    yield put(updateVendorStatusSuccess({ id: vendorId, status: 'ACTIVE' }));
    yield put({ type: types.FETCH_INACTIVE_REQUEST });
    yield put({ type: types.VENDOR_UPDATE_REQUEST });
  } catch (error) {
    yield put(updateVendorStatusFailure(error.message));
  }
}

function* fetchVendorDetailsSaga(action) {
  try {
    const response = yield call(API_BASE_URL.get, `/vendor/${action.payload}`);
    yield put(fetchVendorDetailsSuccess(response.data?.data || []));
  } catch (error) {
    yield put(fetchVendorDetailsFailure(error?.response?.data?.message || error.message));
  }
}

function* fetchCitiesSaga(action) {
  try {
    const response = yield call(
      API_BASE_URL.get,
      `/countryCities/get`,
      { country: action.payload },
    );
    yield put(fetchCitiesSuccess(response.data?.data || []));
  } catch (error) {
    yield put(fetchCitiesFailure(error?.response?.data?.message || error.message));
  }
}

function* createVendorSaga(action) {
  try {
    const { formData, contacts } = action.payload;

    const payload = {
      ...formData,
      contactList: contacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        phoneNo: contact.mobile,
        isDefault: contact.isDefault || false,
      })),
      documentList: [],
    };

    const response = yield call(API_BASE_URL.post, '/vendor/create', payload);

    yield put(createVendorSuccess());
    toast.success('Vendor created successfully!');
    yield put(vendorUpdateRequest());

  } catch (error) {
    yield put(createVendorFailure(error?.response?.data?.message || error.message));
    toast.error(error?.response?.data?.message || 'Error creating vendor');
  }
}


export default function* vendorSaga() {
  yield all([
    takeLatest(types.VENDOR_UPDATE_REQUEST, fetchActiveVendorsSaga),
    takeLatest(types.FETCH_INACTIVE_REQUEST, fetchInactiveVendorsSaga),
    takeLatest(types.MARK_INACTIVE_REQUEST, markInactiveSaga),
    takeLatest(types.MARK_ACTIVE_REQUEST, markActiveSaga),
    takeLatest(types.FETCH_VENDOR_DETAILS_REQUEST, fetchVendorDetailsSaga),
    takeLatest(types.FETCH_CITIES_REQUEST, fetchCitiesSaga),
    takeLatest(types.CREATE_VENDOR_REQUEST, createVendorSaga),
  ]);
}
