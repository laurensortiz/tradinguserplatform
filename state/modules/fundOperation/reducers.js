import { combineReducers } from 'redux'
import types from './types'

// Get All Users
const initialStateInvestmentOperation = {
  list: [],
  item: {},
  isFailure: false,
  isLoading: false,
  isSuccess: false,
  message: '',
}

export function fundOperation(state = initialStateInvestmentOperation, action) {
  switch (action.type) {
    // List All Users
    case types.FUND_OPERATIONS_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      }
    case types.FUND_OPERATIONS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        list: action.payload,
      }
    case types.FUND_OPERATIONS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      }
    // Add Project
    case types.FUND_OPERATION_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      }
    case types.FUND_OPERATION_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Operación de Usuario Incluido con éxito',
      }
    case types.FUND_OPERATION_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      }
    // Edit Project
    case types.FUND_OPERATION_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      }
    case types.FUND_OPERATION_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Operación de Usuario Incluido con éxito',
      }
    case types.FUND_OPERATION_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      }
    // Delete Project
    case types.FUND_OPERATION_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      }
    case types.FUND_OPERATION_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        project: action.payload,
        message: 'Operación de Usuario Incluido con éxito',
      }
    case types.FUND_OPERATION_DELETE_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      }
    // Bulk Update
    case types.FUND_OPERATION_BULK_UPDATE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: false,
        message: '',
        isBulkSuccess: false,
        isBulkFailure: false,
        isBulkLoading: true,
        isBulkProcessCompleted: false,
      }
    case types.FUND_OPERATION_BULK_UPDATE_SUCCESS:
      return {
        ...state,
        isBulkSuccess: true,
        isBulkFailure: false,
        isBulkLoading: false,
        item: action.payload,
        isBulkProcessCompleted: true,
        message: 'Actualización masiva exitosa',
      }
    case types.FUND_OPERATION_BULK_UPDATE_ERROR:
      return {
        ...state,
        isBulkSuccess: false,
        isBulkFailure: true,
        isBulkLoading: false,
        isBulkProcessCompleted: true,
        message: action.payload,
      }

    case types.RESET_AFTER_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: false,
        message: '',
      }
    default:
      return state
  }
}

export default fundOperation
