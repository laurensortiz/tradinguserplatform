import { getCommodities, addCommodity, editCommodity, deleteCommodity } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List Commodities
export const fetchGetCommodities = () => async dispatch => {
  dispatch( requestCommodities() );
  try {
    const res = await getCommodities();
    dispatch( requestCommoditiesSuccess( res.data ) )
  } catch (e) {
    dispatch( requestCommoditiesError( e.message ) )
  }

};

const requestCommodities = () => {
  return {
    type: types.COMMODITIES_REQUEST
  }
};

const requestCommoditiesSuccess = (products) => {
  return {
    type: types.COMMODITIES_SUCCESS,
    payload: products
  }
};

const requestCommoditiesError = (error) => {
  return {
    type: types.COMMODITIES_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddCommodity = (user) => async dispatch => {
  dispatch( requestAddCommodity() );
  try {
    const res = await addCommodity(user);
    dispatch( requestAddCommoditySuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddCommodityError( e.message ) )
  }

};

const requestAddCommodity = () => {
  return {
    type: types.COMMODITY_ADD_REQUEST
  }
};

const requestAddCommoditySuccess = (commodity) => {
  return {
    type: types.COMMODITY_ADD_SUCCESS,
    payload: commodity
  }
};

const requestAddCommodityError = (error) => {
  return {
    type: types.COMMODITY_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditCommodity = (commodity) => async dispatch => {
  dispatch( requestEditCommodity() );
  try {
    const res = await editCommodity(commodity);
    dispatch( requestEditCommoditySuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditCommodityError( e.message ) )
  }

};

const requestEditCommodity = () => {
  return {
    type: types.COMMODITY_EDIT_REQUEST
  }
};

const requestEditCommoditySuccess = (commodity) => {
  return {
    type: types.COMMODITY_EDIT_SUCCESS,
    payload: commodity
  }
};

const requestEditCommodityError = (error) => {
  return {
    type: types.COMMODITY_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteCommodity = (commodityId) => async dispatch => {
  dispatch( requestDeleteCommodity() );
  try {
    const res = await deleteCommodity(commodityId);
    dispatch( requestDeleteCommoditySuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteCommodityError( e.message ) )
  }

};

const requestDeleteCommodity = () => {
  return {
    type: types.COMMODITY_DELETE_REQUEST
  }
};

const requestDeleteCommoditySuccess = (commodity) => {
  return {
    type: types.COMMODITY_DELETE_SUCCESS,
    payload: commodity
  }
};

const requestDeleteCommodityError = (error) => {
  return {
    type: types.COMMODITY_DELETE_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
};

export default {
  fetchGetCommodities,
  fetchAddCommodity,
  fetchEditCommodity,
  fetchDeleteCommodity,
  resetAfterRequest,
};