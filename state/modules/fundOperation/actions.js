import { getFundOperations, addFundOperation, editFundOperation, deleteFundOperation } from './api'
import types from './types'
import { formatAxiosError } from '../../../common/utils'
import { bulkUpdateFundOperation } from '../marketOperation/api'

// List FundOperations
export const fetchGetFundOperations = () => async (dispatch) => {
  dispatch(requestFundOperations())
  try {
    const res = await getFundOperations()
    dispatch(requestFundOperationsSuccess(res.data))
  } catch (e) {
    dispatch(requestFundOperationsError(e.message))
  }
}

const requestFundOperations = () => {
  return {
    type: types.FUND_OPERATIONS_REQUEST,
  }
}

const requestFundOperationsSuccess = (projects) => {
  return {
    type: types.FUND_OPERATIONS_SUCCESS,
    payload: projects,
  }
}

const requestFundOperationsError = (error) => {
  return {
    type: types.FUND_OPERATIONS_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Add
export const fetchAddFundOperation = (operation) => async (dispatch) => {
  dispatch(requestAddFundOperation())
  try {
    const res = await addFundOperation(operation)
    dispatch(requestAddFundOperationSuccess(res.data))
  } catch (e) {
    dispatch(requestAddFundOperationError(e.message))
  }
}

const requestAddFundOperation = () => {
  return {
    type: types.FUND_OPERATION_ADD_REQUEST,
  }
}

const requestAddFundOperationSuccess = (project) => {
  return {
    type: types.FUND_OPERATION_ADD_SUCCESS,
    payload: project,
  }
}

const requestAddFundOperationError = (error) => {
  return {
    type: types.FUND_OPERATION_ADD_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Edit
export const fetchEditFundOperation = (project) => async (dispatch) => {
  dispatch(requestEditFundOperation())
  try {
    const res = await editFundOperation(project)
    dispatch(requestEditFundOperationSuccess(res.data))
  } catch (e) {
    dispatch(requestEditFundOperationError(e.message))
  }
}

const requestEditFundOperation = () => {
  return {
    type: types.FUND_OPERATION_EDIT_REQUEST,
  }
}

const requestEditFundOperationSuccess = (project) => {
  return {
    type: types.FUND_OPERATION_EDIT_SUCCESS,
    payload: project,
  }
}

const requestEditFundOperationError = (error) => {
  return {
    type: types.FUND_OPERATION_EDIT_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Delete
export const fetchDeleteFundOperation = (projectId) => async (dispatch) => {
  dispatch(requestDeleteFundOperation())
  try {
    const res = await deleteFundOperation(projectId)
    dispatch(requestDeleteFundOperationSuccess(res.data))
  } catch (e) {
    dispatch(requestDeleteFundOperationError(e.message))
  }
}

const requestDeleteFundOperation = () => {
  return {
    type: types.FUND_OPERATION_DELETE_REQUEST,
  }
}

const requestDeleteFundOperationSuccess = (project) => {
  return {
    type: types.FUND_OPERATION_DELETE_SUCCESS,
    payload: project,
  }
}

const requestDeleteFundOperationError = (error) => {
  return {
    type: types.FUND_OPERATION_DELETE_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Bulk Update
export const fetchBulkUpdateFundOperation = (bulkUpdateBatch) => async (dispatch) => {
  dispatch(requestBulkUpdateFundOperation())
  try {
    const res = await bulkUpdateFundOperation(bulkUpdateBatch)
    dispatch(requestBulkUpdateFundOperationSuccess(res.data))
  } catch (error) {
    dispatch(requestBulkUpdateFundOperationError(error.response))
  }
}

const requestBulkUpdateFundOperation = () => {
  return {
    type: types.FUND_OPERATION_BULK_UPDATE_REQUEST,
  }
}

const requestBulkUpdateFundOperationSuccess = (update) => {
  return {
    type: types.FUND_OPERATION_BULK_UPDATE_SUCCESS,
    payload: update,
  }
}

const requestBulkUpdateFundOperationError = (error) => {
  return {
    type: types.FUND_OPERATION_BULK_UPDATE_ERROR,
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
  fetchGetFundOperations,
  fetchAddFundOperation,
  fetchEditFundOperation,
  fetchDeleteFundOperation,
  fetchBulkUpdateFundOperation,
  resetAfterRequest,
}
