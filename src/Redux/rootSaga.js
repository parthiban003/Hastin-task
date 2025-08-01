// src/Redux/Vendors/rootSaga.js
import { all } from 'redux-saga/effects';
import accessCodeSaga from '../Redux/AccessCode/accessCodeSaga';
import vendorSaga from './Vendors/vendorSaga';


export default function* rootSaga() {
  yield all([vendorSaga(),
     accessCodeSaga(),
  ]);
}
