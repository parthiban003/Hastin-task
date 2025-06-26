// src/Redux/Vendors/rootSaga.js
import { all } from 'redux-saga/effects';
import vendorSaga from './Vendors/vendorSaga';


export default function* rootSaga() {
  yield all([vendorSaga()]);
}
