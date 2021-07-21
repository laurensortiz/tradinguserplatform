import {
  getMarketOperations,
  getMarketOperation,
  addMarketOperation,
  editMarketOperation,
  deleteMarketOperation,
  bulkUpdateMarketOperation,
} from './api'
import types from './types'
import { formatAxiosError } from '../../../common/utils'

// List MarketOperations
export const fetchGetMarketOperations = (pagination, userAccountId) => async (dispatch) => {
  dispatch(requestMarketOperations())
  try {
    const res = await getMarketOperations(pagination, userAccountId)
    dispatch(requestMarketOperationsSuccess(res.data))
  } catch (error) {
    dispatch(requestMarketOperationsError(error.response))
  }
}

const requestMarketOperations = () => {
  return {
    type: types.MARKET_OPERATIONS_REQUEST,
  }
}

const requestMarketOperationsSuccess = (markets) => {
  return {
    type: types.MARKET_OPERATIONS_SUCCESS,
    payload: markets,
  }
}

const requestMarketOperationsError = (error) => {
  return {
    type: types.MARKET_OPERATIONS_ERROR,
    payload: formatAxiosError(error),
  }
}

// MarketOperation
export const fetchGetMarketOperation = (marketOperationId) => async (dispatch) => {
  dispatch(requestMarketOperation())
  try {
    const res = await getMarketOperation(marketOperationId)
    dispatch(requestMarketOperationSuccess(res.data))
  } catch (error) {
    dispatch(requestMarketOperationError(error.response))
  }
}

const requestMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_REQUEST,
  }
}

const requestMarketOperationSuccess = (operation) => {
  return {
    type: types.MARKET_OPERATION_SUCCESS,
    payload: operation,
  }
}

const requestMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_ERROR,
    payload: formatAxiosError(error),
  }
}

// Add
export const fetchAddMarketOperation = (user) => async (dispatch) => {
  dispatch(requestAddMarketOperation())
  try {
    const res = await addMarketOperation(user)
    dispatch(requestAddMarketOperationSuccess(res.data))
  } catch (error) {
    dispatch(requestAddMarketOperationError(error.response))
  }
}

const requestAddMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_ADD_REQUEST,
  }
}

const requestAddMarketOperationSuccess = (market) => {
  return {
    type: types.MARKET_OPERATION_ADD_SUCCESS,
    payload: market,
  }
}

const requestAddMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_ADD_ERROR,
    payload: formatAxiosError(error),
  }
}

// Edit
export const fetchEditMarketOperation = (market) => async (dispatch) => {
  dispatch(requestEditMarketOperation())
  try {
    const res = await editMarketOperation(market)
    dispatch(requestEditMarketOperationSuccess(res.data))
  } catch (error) {
    dispatch(requestEditMarketOperationError(error.response))
  }
}

const requestEditMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_EDIT_REQUEST,
  }
}

const requestEditMarketOperationSuccess = (market) => {
  return {
    type: types.MARKET_OPERATION_EDIT_SUCCESS,
    payload: market,
  }
}

const requestEditMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_EDIT_ERROR,
    payload: formatAxiosError(error),
  }
}

// Delete
export const fetchDeleteMarketOperation = (marketId) => async (dispatch) => {
  dispatch(requestDeleteMarketOperation())
  try {
    const res = await deleteMarketOperation(marketId)
    dispatch(requestDeleteMarketOperationSuccess(res.data))
  } catch (error) {
    dispatch(requestDeleteMarketOperationError(error.response))
  }
}

const requestDeleteMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_DELETE_REQUEST,
  }
}

const requestDeleteMarketOperationSuccess = (market) => {
  return {
    type: types.MARKET_OPERATION_DELETE_SUCCESS,
    payload: market,
  }
}

const requestDeleteMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_DELETE_ERROR,
    payload: formatAxiosError(error),
  }
}

// Bulk Update
export const fetchBulkUpdateMarketOperation = (bulkUpdateBatch) => async (dispatch) => {
  dispatch(requestBulkUpdateMarketOperation())
  try {
    const res = await bulkUpdateMarketOperation(bulkUpdateBatch)
    dispatch(requestBulkUpdateMarketOperationSuccess(res.data))
  } catch (error) {
    dispatch(requestBulkUpdateMarketOperationError(error.response))
  }
}

const requestBulkUpdateMarketOperation = () => {
  return {
    type: types.MARKET_OPERATION_BULK_UPDATE_REQUEST,
  }
}

const requestBulkUpdateMarketOperationSuccess = (update) => {
  return {
    type: types.MARKET_OPERATION_BULK_UPDATE_SUCCESS,
    payload: update,
  }
}

const requestBulkUpdateMarketOperationError = (error) => {
  return {
    type: types.MARKET_OPERATION_BULK_UPDATE_ERROR,
    payload: formatAxiosError(error),
  }
}

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
}

export default {
  fetchGetMarketOperations,
  fetchGetMarketOperation,
  fetchAddMarketOperation,
  fetchEditMarketOperation,
  fetchDeleteMarketOperation,
  fetchBulkUpdateMarketOperation,
  resetAfterRequest,
}
