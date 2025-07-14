import * as types from './vendorTypes';

const initialState = {
  vendors: [],
  inactiveVendors: [],
  loading: false,
  error: null,
  creationSuccess: false,
};

export default function vendorReducer(state = initialState, action) {
  switch (action.type) {
    case types.VENDOR_UPDATE_REQUEST:
    case types.FETCH_INACTIVE_REQUEST:
    case types.CREATE_VENDOR_REQUEST:
      return { ...state, loading: true, error: null, creationSuccess: false };

    case types.FETCH_SUCCESS:
      return { ...state, loading: false, vendors: action.payload };

    case types.FETCH_FAILURE:
    case types.FETCH_INACTIVE_FAILURE:
    case types.CREATE_VENDOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.FETCH_INACTIVE_SUCCESS:
      return { ...state, loading: false, inactiveVendors: action.payload };

    case types.CREATE_VENDOR_SUCCESS:
      return { ...state, loading: false, creationSuccess: true };

    default:
      return state;
  }
}
