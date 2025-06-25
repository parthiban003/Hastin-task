import * as types from './vendorTypes';

export const vendorUpdateRequest = () => ({ type: types.VENDOR_UPDATE_REQUEST });
export const fetchSuccess = (data) => ({ type: types.FETCH_SUCCESS, payload: data });
export const fetchFailure = (error) => ({ type: types.FETCH_FAILURE, payload: error });

export const fetchInactiveVendorsRequest = () => ({ type: types.FETCH_INACTIVE_REQUEST });
export const fetchInactiveSuccess = (data) => ({ type: types.FETCH_INACTIVE_SUCCESS, payload: data });
export const fetchInactiveFailure = (error) => ({ type: types.FETCH_INACTIVE_FAILURE, payload: error });

export const markInactiveRequest = (vendorId) => ({ type: types.MARK_INACTIVE_REQUEST, payload: vendorId });
export const markActiveRequest = (vendorId) => ({ type: types.MARK_ACTIVE_REQUEST, payload: vendorId });

