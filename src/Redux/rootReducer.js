import { combineReducers } from 'redux';
import vendorReducer from './Vendors/vendorReducer';
import accessCodeReducer from '../Redux/AccessCode/accessCodeReducer';

const rootReducer = combineReducers({
  vendor: vendorReducer,
  accessCode: accessCodeReducer,
});

export default rootReducer;

