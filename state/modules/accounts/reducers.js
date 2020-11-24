import { combineReducers } from "redux";
import types from "./types";

// Get All Users
const initialState = {
  list: [],
  item: {},
  isFailure: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

export function accounts(state = initialState, action) {
  switch (action.type) {
    // List All Users
    case types.ACCOUNTS_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.ACCOUNTS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        list: action.payload,
      };
    case types.ACCOUNTS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // List One UserAccount
    case types.ACCOUNT_REQUEST:
      return {
        ...state,
        item: {},
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.ACCOUNT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
      };
    case types.ACCOUNT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Add Project
    case types.ACCOUNT_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.ACCOUNT_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Usuario Incluido con éxito',
      };
    case types.ACCOUNT_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Edit Project
    case types.ACCOUNT_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.ACCOUNT_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Cuenta Incluido con éxito',
      };
    case types.ACCOUNT_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Delete Project
    case types.ACCOUNT_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.ACCOUNT_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Cuenta Incluido con éxito',
      };
    case types.ACCOUNT_DELETE_ERROR:
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

export default accounts;
