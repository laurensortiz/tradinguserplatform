import { combineReducers } from "redux";
import types from "./types";

// Get All Users
const initialState = {
  list: [],
  item: {},
  isCompleted: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

export function settings(state = initialState, action) {
  switch (action.type) {
    // List All Users
    case types.REFERRALS_REQUEST:
      return {
        ...state,
        isCompleted: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.REFERRALS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        list: action.payload,
      };
    case types.REFERRALS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };
      // By User Account
    case types.REFERRALS_USER_ACCOUNT_REQUEST:
      return {
        ...state,
        isCompleted: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.REFERRALS_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        list: action.payload,
      };
    case types.REFERRALS_USER_ACCOUNT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };
    // Add Project
    case types.REFERRAL_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      };
    case types.REFERRAL_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Referral Incluido con éxito',
      };
    case types.REFERRAL_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };
    // Edit Project
    case types.REFERRAL_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      };
    case types.REFERRAL_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Referral Incluido con éxito',
      };
    case types.REFERRAL_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };
    // Delete Project
    case types.REFERRAL_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      };
    case types.REFERRAL_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        item: action.payload,
        message: 'Ajuste Incluido con éxito',
      };
    case types.REFERRAL_DELETE_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };

    case types.RESET_AFTER_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: false,
        message: '',
      };
    default:
      return state
  }
}

export default settings;
