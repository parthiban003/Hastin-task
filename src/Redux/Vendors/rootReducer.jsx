import { combineReducers } from 'redux';
import vendorReducer from './vendorReducer';

const rootReducer = combineReducers({
  vendor: vendorReducer,
});

export default rootReducer;

