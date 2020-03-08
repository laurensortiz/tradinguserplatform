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

export function assetClassses(state = initialState, action) {
  switch (action.type) {
    // List All Users
    case types.ASSET_CLASSES_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
      };
    case types.ASSET_CLASSES_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        list: action.payload,
      };
    case types.ASSET_CLASSES_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Add Project
    case types.ASSET_CLASS_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.ASSET_CLASS_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Usuario Incluido con éxito',
      };
    case types.ASSET_CLASS_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Edit Project
    case types.ASSET_CLASS_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.ASSET_CLASS_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        jobTitle: action.payload,
        message: 'Commodity Incluido con éxito',
      };
    case types.ASSET_CLASS_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isFailure: true,
        isLoading: false,
        message: action.payload,
      };
    // Delete Project
    case types.ASSET_CLASS_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isLoading: true,
      };
    case types.ASSET_CLASS_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        item: action.payload,
        message: 'Clase de recurso Incluido con éxito',
      };
    case types.ASSET_CLASS_DELETE_ERROR:
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

export default assetClassses;
