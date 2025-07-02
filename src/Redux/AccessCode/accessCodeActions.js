import * as types from './accessCodeTypes';

export const accesscodeRequest = (payload) => ({
  type: types.ACCESS_CODE_REQUEST,
  payload,
});

export const resendOtpRequest = () => ({
  type: types.RESEND_OTP_REQUEST,
});

export const clearAccessCodeData = () => ({
  type: types.CLEAR_ACCESS_CODE_DATA,
});
