import { combineReducers } from "redux";
import types from "./types";

// Get All Users
const initialStateUsers = {
  list: [],
  item: {},
  isFailure: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

export function users(state = initialStateUsers, action) {
  switch (action.type) {
    // List All Users
    case types.ALL_USER_ACCOUNTS_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.ALL_USER_ACCOUNTS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        list: action.payload,
      };
    case types.ALL_USER_ACCOUNTS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // User Accounts
    case types.USER_ACCOUNTS_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.USER_ACCOUNTS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        list: action.payload,
      };
    case types.USER_ACCOUNTS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Add Project
    case types.USER_ACCOUNT_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.USER_ACCOUNT_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Cuenta de Usuario Incluido con éxito',
      };
    case types.USER_ACCOUNT_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Edit Project
    case types.USER_ACCOUNT_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.USER_ACCOUNT_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Cuenta de Usuario Incluido con éxito',
      };
    case types.USER_ACCOUNT_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Delete Project
    case types.USER_ACCOUNT_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.USER_ACCOUNT_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        project: action.payload,
        message: 'Cuenta de Usuario Incluido con éxito',
      };
    case types.USER_ACCOUNT_DELETE_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };

    case types.RESET_AFTER_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: false,
        message: '',
      };
    default:
      return state
  }
}

export default users;
