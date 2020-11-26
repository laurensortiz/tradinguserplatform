import { combineReducers } from "redux";
import types from "./types";

// Get All Users
const initialStateUsers = {
  list: [],
  item: {},
  isFailure: false,
  isLoading: false,
  isSuccess: false,
  isHistoryReportLoading: false,
  isHistoryReportSuccess: false,
  isHistoryReportComplete: false,
  historyReportData: [],
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
    // User Account
    case types.USER_ACCOUNT_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
      };
    case types.USER_ACCOUNT_ERROR:
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
    // User Account History Report
    case types.USER_ACCOUNT_HISTORY_REPORT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: false,
        isHistoryReportLoading: true,
        isHistoryReportSuccess: false,
        isHistoryReportComplete: false,
        historyReportData: []
      };
    case types.USER_ACCOUNT_HISTORY_REPORT_SUCCESS:
      return {
        ...state,
        isHistoryReportLoading: false,
        isHistoryReportSuccess: true,
        isHistoryReportComplete: true,
        historyReportData: action.payload,
        message: 'Historial de la Cuenta de Usuario Generado con éxito',
      };
    case types.USER_ACCOUNT_HISTORY_REPORT_ERROR:
      return {
        ...state,
        isHistoryReportLoading: false,
        isHistoryReportSuccess: false,
        isHistoryReportComplete: true,
        historyReportData: [],
        message: action.payload,
      };

    case types.RESET_AFTER_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: false,
        message: '',
        item: {},
        isHistoryReportLoading: false,
        isHistoryReportSuccess: false,
        isHistoryReportComplete: false,
        historyReportData: [],
      };
    default:
      return state
  }
}

export default users;
