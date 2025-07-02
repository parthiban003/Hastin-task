import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import * as types from './accessCodeTypes';

function* validateAccessCodeSaga(action) {
  try {
    const token = localStorage.getItem('authToken');
    const response = yield call(axios.post,
      'https://hastin-container.com/staging/app/auth/access-code/validate',
      action.payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `BslogiKey ${token}`,
          ApplicationLabel: 'demo',
        },
      }
    );

    localStorage.setItem('authToken', response.data.data.jwt);
    yield put({ type: types.ACCESS_CODE_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({
      type: types.ACCESS_CODE_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
}

function* resendOtpSaga() {
  try {
    const response = yield call(axios.post,
      'https://hastin-container.com/staging/app/auth/access-code/resend',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ApplicationLabel: 'demo',
        },
      }
    );

    const { accessCode, opaque, jwt } = response.data.data;
    localStorage.setItem('accessCode', accessCode);
    localStorage.setItem('opaque', opaque);
    localStorage.setItem('authToken', jwt);

    yield put({ type: types.RESEND_OTP_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({
      type: types.RESEND_OTP_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
}

export default function* accessCodeSaga() {
  yield takeLatest(types.ACCESS_CODE_REQUEST, validateAccessCodeSaga);
  yield takeLatest(types.RESEND_OTP_REQUEST, resendOtpSaga);
}
