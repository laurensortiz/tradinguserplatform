import { getMarketOperations, addMarketOperation, editMarketOperation, deleteMarketOperation } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List MarketOperations
export const fetchGetMarketOperations = () => async dispatch => {
  dispatch( requestMarketOperations() );
  try {
    const res = await getMarketOperations();
    dispatch( requestMarketOperationsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestMarketOperationsError( e.message ) )
  }

};

const requestMarketOperations = () => {
  return {
    type: types.MARKET_OPERATIONS_REQUEST
  }
};

const requestMarketOperationsSuccess = (markets) => {
  return {
    type: types.MARKET_OPERATIONS_SUCCESS,
    payload: markets
  }
};

const requestMarketOperationsError = (error) => {
  return {
    type: types.MARKET_OPERATIONS_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddMarketOperation = (user) => async dispatch => {
  dispatch( requestAddMarketOperation() );
  try {
    const res = await addMarketOperation(user);
    dispatch( requestAddMarketOperationSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddMarketOperationError( e.message ) )
  }

};

const requestAddMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_ADD_REQUEST
  }
};

const requestAddMarketOperationSuccess = (market) => {
  return {
    type: types.MARKET_OPERATION_ADD_SUCCESS,
    payload: market
  }
};

const requestAddMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditMarketOperation = (market) => async dispatch => {
  dispatch( requestEditMarketOperation() );
  try {
    const res = await editMarketOperation(market);
    dispatch( requestEditMarketOperationSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditMarketOperationError( e.message ) )
  }

};

const requestEditMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_EDIT_REQUEST
  }
};

const requestEditMarketOperationSuccess = (market) => {
  return {
    type: types.MARKET_OPERATION_EDIT_SUCCESS,
    payload: market
  }
};

const requestEditMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteMarketOperation = (marketId) => async dispatch => {
  dispatch( requestDeleteMarketOperation() );
  try {
    const res = await deleteMarketOperation(marketId);
    dispatch( requestDeleteMarketOperationSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteMarketOperationError( e.message ) )
  }

};

const requestDeleteMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_DELETE_REQUEST
  }
};

const requestDeleteMarketOperationSuccess = (market) => {
  return {
    type: types.MARKET_OPERATION_DELETE_SUCCESS,
    payload: market
  }
};

const requestDeleteMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_DELETE_ERROR,
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
  fetchGetMarketOperations,
  fetchAddMarketOperation,
  fetchEditMarketOperation,
  fetchDeleteMarketOperation,
  resetAfterRequest,
};