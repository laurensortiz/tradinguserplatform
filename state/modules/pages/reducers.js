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

export function pages(state = initialState, action) {
  switch (action.type) {
    // List All Users
    case types.PAGES_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.PAGES_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        list: action.payload,
      };
    case types.PAGES_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Page
    case types.PAGE_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.PAGE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
      };
    case types.PAGE_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Add Project
    case types.PAGE_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.PAGE_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Usuario Incluido con éxito',
      };
    case types.PAGE_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Edit Project
    case types.PAGE_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.PAGE_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Página Incluido con éxito',
      };
    case types.PAGE_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Delete Project
    case types.PAGE_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.PAGE_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Página Incluido con éxito',
      };
    case types.PAGE_DELETE_ERROR:
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

export default pages;
