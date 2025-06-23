import { FETCH_VENDOR_BY_STATUS_FAILURE, FETCH_VENDOR_BY_STATUS_REQUEST, FETCH_VENDOR_BY_STATUS_SUCCESS } from "../Type/Type";

export const fetchVendorByStatusRequest = () =>{
  return {
    type: FETCH_VENDOR_BY_STATUS_REQUEST,
    
  };
}
export const fetchVendorByStatusSuccess = (data) =>{
  return {
    type: FETCH_VENDOR_BY_STATUS_SUCCESS,
    payload : data
  };
}
export const fetchVendorByStatusFailure = (error) =>{
  return {
    type: FETCH_VENDOR_BY_STATUS_FAILURE,
    payload : error
  };
}