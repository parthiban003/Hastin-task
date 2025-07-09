// src/redux/AccessCode/accessCodeSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
// import axiosInstance from '../../utils/axiosInstance';
import {
  ACCESS_CODE_REQUEST,
  RESEND_OTP_REQUEST,
} from './accessCodeTypes';
import {
  accesscodeSuccess,
  accesscodeFailure,
  resendOtpSuccess,
  resendOtpFailure,
} from './accessCodeActions';
import API_BASE_URL from '../../Components/axiosInstance';

function* accesscodeRequestSaga(action) {
  try {
    const response = yield call(() =>
      API_BASE_URL.post('https://hastin-container.com/staging/app/auth/access-code/validate', action.payload)
    );
    yield put(accesscodeSuccess(response.data));
  } catch (error) {
    yield put(
      accesscodeFailure(error?.response?.data?.message || 'OTP validation failed')
    );
  }
}

function* resendOtpSaga() {
  try {
    const response = yield call(() =>
      API_BASE_URL.post(
        'https://hastin-container.com/staging/app/auth/access-code/resend',
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );

    const { accessCode, opaque, jwt } = response.data.data;

    if (jwt) {
      localStorage.setItem('authToken', jwt);
    }
    localStorage.setItem('accessCode', accessCode);
    localStorage.setItem('opaque', opaque);

    yield put(resendOtpSuccess(response.data));
  } catch (error) {
    yield put(
      resendOtpFailure(error?.response?.data?.message || 'OTP resend failed')
    );
  }
}


export default function* accessCodeSaga() {
  yield takeLatest(ACCESS_CODE_REQUEST, accesscodeRequestSaga);
  yield takeLatest(RESEND_OTP_REQUEST, resendOtpSaga);
}
