import * as types from './accessCodeTypes';

const initialState = {
  loading: false,
  accessCodeStatus: null,
  error: null,
};

const accessCodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ACCESS_CODE_REQUEST:
    case types.RESEND_OTP_REQUEST:
      return { ...state, loading: true, error: null };

    case types.ACCESS_CODE_SUCCESS:
    case types.RESEND_OTP_SUCCESS:
      return { ...state, loading: false, accessCodeStatus: action.payload };

    case types.ACCESS_CODE_FAILURE:
    case types.RESEND_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.CLEAR_ACCESS_CODE_DATA:
      return { ...initialState };

    default:
      return state;
  }
};

export default accessCodeReducer;
