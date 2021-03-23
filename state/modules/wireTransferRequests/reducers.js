import types from './types'

// Get All Users
const initialState = {
  list: [],
  userList: [],
  item: {},
  isCompleted: false,
  isLoading: false,
  isSuccess: false,
  isAddCompleted: false,
  message: '',
}

export function settings(state = initialState, action) {
  switch (action.type) {
    // List All Referrals
    case types.WIRE_TRANSFER_REQUESTS_REQUEST:
      return {
        ...state,
        isCompleted: false,
        isLoading: true,
        isSuccess: false,
      }
    case types.WIRE_TRANSFER_REQUESTS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        list: action.payload,
      }
    case types.WIRE_TRANSFER_REQUESTS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      }

    // Referral
    case types.WIRE_TRANSFER_REQUEST_REQUEST:
      return {
        ...state,
        isCompleted: false,
        isLoading: true,
        isSuccess: false,
        item: {},
      }
    case types.WIRE_TRANSFER_REQUEST_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        item: action.payload,
      }
    case types.WIRE_TRANSFER_REQUEST_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      }
    // By User Account
    case types.WIRE_TRANSFER_REQUESTS_USER_ACCOUNT_REQUEST:
      return {
        ...state,
        userList: [],
        isCompleted: false,
        isLoading: true,
        isSuccess: false,
      }
    case types.WIRE_TRANSFER_REQUESTS_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        userList: action.payload,
      }
    case types.WIRE_TRANSFER_REQUESTS_USER_ACCOUNT_ERROR:
      return {
        ...state,
        userList: [],
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      }
    // Add Project
    case types.WIRE_TRANSFER_REQUEST_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isAddCompleted: false,
        isCompleted: false,
        isLoading: true,
      }
    case types.WIRE_TRANSFER_REQUEST_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isAddCompleted: true,
        isLoading: false,
        message: 'Referral Incluido con éxito',
      }
    case types.WIRE_TRANSFER_REQUEST_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isAddCompleted: true,
        isLoading: false,
        message: action.payload,
      }
    // Edit Project
    case types.WIRE_TRANSFER_REQUEST_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      }
    case types.WIRE_TRANSFER_REQUEST_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        item: action.payload,
        message: 'Solicitud Incluido con éxito',
      }
    case types.WIRE_TRANSFER_REQUEST_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      }
    // Delete Project
    case types.WIRE_TRANSFER_REQUEST_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      }
    case types.WIRE_TRANSFER_REQUEST_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        item: action.payload,
        message: 'Ajuste Incluido con éxito',
      }
    case types.WIRE_TRANSFER_REQUEST_DELETE_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      }

    case types.RESET_AFTER_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: false,
        message: '',
        item: {},
      }
    default:
      return state
  }
}

export default settings
