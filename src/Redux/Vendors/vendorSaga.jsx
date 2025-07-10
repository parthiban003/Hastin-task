import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as types from './vendorTypes';

import {
  fetchSuccess,
  fetchFailure,
  fetchInactiveSuccess,
  fetchInactiveFailure,
  vendorUpdateRequest,
} from './vendorActions';
import {
  fetchVendorDetailsSuccess,
  fetchVendorDetailsFailure,
  fetchCitiesSuccess,
  fetchCitiesFailure,
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

    console.log("Inactive vendors response:", response.data?.data);

    yield put(fetchInactiveSuccess(response.data?.data?.tableData || []));
  } catch (error) {
    yield put(fetchInactiveFailure(error?.response?.data?.message || error.message));
  }
}


function* markInactiveSaga(action) {
  try {
    
    const res = yield call(
      API_BASE_URL.put,
      '/vendor/status/update',
      { vendorId: action.payload, status: 'INACTIVE' },
      
    );
    console.log(res.data?.data);
    
    yield put(vendorUpdateRequest(res.data?.data?.tableData));
    toast.success('Successfully mark as Inactive')
  } catch (error) {
    toast.error('Failed to mark Inactive')
    console.error('Error marking inactive:', error.message);
  }
}

function* markActiveSaga(action) {
  try {
     const val = yield call(
      API_BASE_URL.put,
      '/vendor/status/update',
      { vendorId: action.payload, status: 'ACTIVE' },
      
    );
    console.log(val.data?.data)

    yield put (vendorUpdateRequest(val.data?.data.tableData))
    yield put({ type: types.VENDOR_UPDATE_REQUEST });
    yield put({ type: types.FETCH_INACTIVE_REQUEST });
    toast.success('Successfully mark as Active')

  } catch (error) {
    toast.error('Failed to mark active')
    console.error('Error marking active:', error.message);
  }
}

function* fetchVendorDetailsSaga(action) {
  try {
    
    const response = yield call(
      API_BASE_URL.get,
      `/vendor/${action.payload}`,
      {},
     
    );
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


export default function* vendorSaga() {
  yield all([
    takeLatest(types.VENDOR_UPDATE_REQUEST, fetchActiveVendorsSaga),
    takeLatest(types.FETCH_INACTIVE_REQUEST, fetchInactiveVendorsSaga),
    takeLatest(types.MARK_INACTIVE_REQUEST, markInactiveSaga),
    takeLatest(types.MARK_ACTIVE_REQUEST, markActiveSaga),
     takeLatest(types.FETCH_VENDOR_DETAILS_REQUEST, fetchVendorDetailsSaga),  
    takeLatest(types.FETCH_CITIES_REQUEST, fetchCitiesSaga), 
  ]);
}