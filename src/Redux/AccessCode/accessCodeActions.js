// src/Redux/AccessCode/accessCodeActions.js

import {
  ACCESS_CODE_REQUEST,
  ACCESS_CODE_SUCCESS,
  ACCESS_CODE_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
  CLEAR_ACCESS_CODE_DATA
} from './accessCodeTypes';

// Request OTP validation
export const accesscodeRequest = (payload) => ({
  type: ACCESS_CODE_REQUEST,
  payload,
});

export const accesscodeSuccess = (data) => ({
  type: ACCESS_CODE_SUCCESS,
  payload: data,
});

export const accesscodeFailure = (error) => ({
  type: ACCESS_CODE_FAILURE,
  payload: error,
});

// Resend OTP
export const resendOtpRequest = () => ({
  type: RESEND_OTP_REQUEST,
});

export const resendOtpSuccess = (data) => ({
  type: RESEND_OTP_SUCCESS,
  payload: data,
});

export const resendOtpFailure = (error) => ({
  type: RESEND_OTP_FAILURE,
  payload: error,
});

// Clear OTP state
export const clearAccessCodeData = () => ({
  type: CLEAR_ACCESS_CODE_DATA,
});
