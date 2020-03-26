import { getUsers, addUser, editUser, deleteUser } from './api';
import { formatAxiosError } from '../../../common/utils';

import types from './types';

// List Users
export const fetchGetUsers = () => async dispatch => {
  dispatch( requestUsers() );
  try {
    const res = await getUsers();
    dispatch( requestUsersSuccess( res.data ) )
  } catch (e) {
    dispatch( requestUsersError( e.message ) )
  }

};

const requestUsers = () => {
  return {
    type: types.USERS_REQUEST
  }
};

const requestUsersSuccess = (projects) => {
  return {
    type: types.USERS_SUCCESS,
    payload: projects
  }
};

const requestUsersError = (error) => {
  return {
    type: types.USERS_ERROR,
    payload:  formatAxiosError(error.response)
  }
};

// Add
export const fetchAddUser = (user) => async dispatch => {
  dispatch( requestAddUser() );
  try {
    const res = await addUser( user );
    dispatch( requestAddUserSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddUserError( e ) )
  }

};

const requestAddUser = () => {
  return {
    type: types.USER_ADD_REQUEST
  }
};

const requestAddUserSuccess = (project) => {
  return {
    type: types.USER_ADD_SUCCESS,
    payload: project
  }
};

const requestAddUserError = (error) => {
  return {
    type: types.USER_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditUser = (project) => async dispatch => {
  dispatch( requestEditUser() );
  try {
    const res = await editUser( project );
    dispatch( requestEditUserSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditUserError( e.message ) )
  }

};

const requestEditUser = () => {
  return {
    type: types.USER_EDIT_REQUEST
  }
};

const requestEditUserSuccess = (project) => {
  return {
    type: types.USER_EDIT_SUCCESS,
    payload: project
  }
};

const requestEditUserError = (error) => {
  return {
    type: types.USER_EDIT_ERROR,
    payload:  formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteUser = (projectId) => async dispatch => {
  dispatch( requestDeleteUser() );
  try {
    const res = await deleteUser( projectId );
    dispatch( requestDeleteUserSuccess( res.data ) )
  } catch (e) {
    dispatch( requestDeleteUserError( e.message ) )
  }

};

const requestDeleteUser = () => {
  return {
    type: types.USER_DELETE_REQUEST
  }
};

const requestDeleteUserSuccess = (project) => {
  return {
    type: types.USER_DELETE_SUCCESS,
    payload: project
  }
};

const requestDeleteUserError = (error) => {
  return {
    type: types.USER_DELETE_ERROR,
    payload:  formatAxiosError(error.response)
  }
};

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
};

export default {
  fetchGetUsers,
  fetchAddUser,
  fetchEditUser,
  fetchDeleteUser,
  resetAfterRequest,
};