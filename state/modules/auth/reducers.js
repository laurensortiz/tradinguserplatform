import { combineReducers } from "redux";
import _ from 'lodash';
import types from "./types";

const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  isSuccess: false,
  isFailure: false,
  isLoading: false,
  currentUser: null,
  isSessionExpired: false,
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST: //successfull auth - either login or we have token already
      return {
        ...state,
        isAuthenticated: false,
        isFailure: false,
        isLoading: true,
      };
    case types.LOGIN_SUCCESS: //successfull auth - either login or we have token already
      return {
        ...state,
        isAuthenticated: true,
        isFailure: false,
        isLoading: false,
        isSuccess: true,
        currentUser: action.payload,
        isAdmin: _.chain(action.payload).get('roleId', 0).isEqual(1).value()
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        isSessionExpired: true,
        isFailure: true,
        isLoading: false,
        isSuccess: false,
        message: action.payload,
      };
    case types.LOGOUT_REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isSessionExpired: false,
        isLoading: true,
        isFailure: false,
        isSuccess: false,
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isSessionExpired: true,
        isFailure: false,
        isLoading: false,
        currentUser: null,
        isSuccess: true,
      };
    case types.LOGOUT_ERROR:
      return {
        ...state,
        isAuthenticated: true,
        isSessionExpired: false,
        isFailure: true,
        isLoading: false,
        isSuccess: false,
      };
    default:
      return state
  }
}

export default auth;
