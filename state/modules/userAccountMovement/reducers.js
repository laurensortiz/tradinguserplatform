import { combineReducers } from "redux";
import types from "./types";

// Get All Users
const initialStateUserAccountMovement = {
  list: [],
  item: {},
  isLoading: false,
  isSuccess: false,
  isCompleted: false,
  message: '',
};

export function userAccountMovement(state = initialStateUserAccountMovement, action) {
  switch (action.type) {
    // List All Users
    case types.USER_ACCOUNT_MOVEMENTS_REQUEST:
      return {
        ...state,
        isFailure: false,
        isLoading: true,
        isSuccess: false,
        isCompleted: false,
      };
    case types.USER_ACCOUNT_MOVEMENTS_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFailure: false,
        isLoading: false,
        isCompleted: true,
        list: action.payload,
      };
    case types.USER_ACCOUNT_MOVEMENTS_ERROR:
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
        isCompleted: true,
        message: action.payload,
      };
    // Add Project
    case types.USER_ACCOUNT_MOVEMENT_ADD_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      };
    case types.USER_ACCOUNT_MOVEMENT_ADD_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        item: action.payload,
        message: 'Operación de Usuario Incluido con éxito',
      };
    case types.USER_ACCOUNT_MOVEMENT_ADD_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };
    // Edit Project
    case types.USER_ACCOUNT_MOVEMENT_EDIT_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isFailure: false,
        isCompleted: false,
        isLoading: true,
      };
    case types.USER_ACCOUNT_MOVEMENT_EDIT_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        item: action.payload,
        message: 'Operación de Usuario Incluido con éxito',
      };
    case types.USER_ACCOUNT_MOVEMENT_EDIT_ERROR:
      return {
        ...state,
        isSuccess: false,
        isCompleted: true,
        isLoading: false,
        message: action.payload,
      };
    // Delete Project
    case types.USER_ACCOUNT_MOVEMENT_DELETE_REQUEST:
      return {
        ...state,
        isSuccess: false,
        isCompleted: false,
        isLoading: true,
      };
    case types.USER_ACCOUNT_MOVEMENT_DELETE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isCompleted: true,
        isLoading: false,
        project: action.payload,
        message: 'Operación de Usuario Incluido con éxito',
      };
    case types.USER_ACCOUNT_MOVEMENT_DELETE_ERROR:
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

export default userAccountMovement;
