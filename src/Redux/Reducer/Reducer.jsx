import { FETCH_VENDOR_BY_STATUS_FAILURE, FETCH_VENDOR_BY_STATUS_REQUEST, FETCH_VENDOR_BY_STATUS_SUCCESS } from "../Type/Type"

const initailstate = {
  vendorStatus: [],
  loading:false,
  error:null
}

export const vendorReducer = (state = initailstate,action) => {
  switch (action.payload) {
    case FETCH_VENDOR_BY_STATUS_REQUEST:
     return{
      ...state,
      loading:true,
      error:null
     };
    case FETCH_VENDOR_BY_STATUS_SUCCESS :
      return{
        ...state,
        loading:false,
        vendorStatus:action.payload,
      };

      case FETCH_VENDOR_BY_STATUS_FAILURE:
        return{
          ...state,
          loading:false,
          error:error
        };
  
    default:
    return state
      
  }

}