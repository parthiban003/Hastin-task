import { combineReducers } from "@reduxjs/toolkit";
import { vendorReducer } from "../Reducer/Reducer";

const rootReducer = combineReducers({
   vendorStatusReducer: vendorReducer
})
export default rootReducer;