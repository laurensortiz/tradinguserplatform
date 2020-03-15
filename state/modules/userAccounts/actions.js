import { getAllUserAccounts, getUserAccounts, addUserAccount, editUserAccount, deleteUserAccount } from './api';
import types from './types';

// All User Accounts
export const fetchGetAllUserAccounts = () => async dispatch => {
  dispatch( requestUserAccounts() );
  try {
    const res = await getAllUserAccounts();
    dispatch( requestUserAccountsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestUserAccountsError( e.message ) )
  }

};

const requestAllUserAccounts = () => {
  return {
    type: types.ALL_USER_ACCOUNTS_REQUEST
  }
};

const requestAllUserAccountsSuccess = (accounts) => {
  return {
    type: types.ALL_USER_ACCOUNTS_SUCCESS,
    payload: accounts
  }
};

const requestAllUserAccountsError = (error) => {
  return {
    type: types.ALL_USER_ACCOUNTS_ERROR,
    payload: error
  }
};

// List UserAccounts
export const fetchGetUserAccounts = (userId) => async dispatch => {
  dispatch( requestUserAccounts() );
  try {
    const res = await getUserAccounts(userId);
    dispatch( requestUserAccountsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestUserAccountsError( e.message ) )
  }

};

const requestUserAccounts = () => {
  return {
    type: types.USER_ACCOUNTS_REQUEST
  }
};

const requestUserAccountsSuccess = (projects) => {
  return {
    type: types.USER_ACCOUNTS_SUCCESS,
    payload: projects
  }
};

const requestUserAccountsError = (error) => {
  return {
    type: types.USER_ACCOUNTS_ERROR,
    payload: error
  }
};

// Add
export const fetchAddUserAccount = (user) => async dispatch => {
  dispatch( requestAddUserAccount() );
  try {
    const res = await addUserAccount(user);
    dispatch( requestAddUserAccountSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddUserAccountError( e.message ) )
  }

};

const requestAddUserAccount = () => {
  return {
    type: types.USER_ACCOUNT_ADD_REQUEST
  }
};

const requestAddUserAccountSuccess = (project) => {
  return {
    type: types.USER_ACCOUNT_ADD_SUCCESS,
    payload: project
  }
};

const requestAddUserAccountError = (error) => {
  return {
    type: types.USER_ACCOUNT_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditUserAccount = (project) => async dispatch => {
  dispatch( requestEditUserAccount() );
  try {
    const res = await editUserAccount(project);
    dispatch( requestEditUserAccountSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditUserAccountError( e.message ) )
  }

};

const requestEditUserAccount = () => {
  return {
    type: types.USER_ACCOUNT_EDIT_REQUEST
  }
};

const requestEditUserAccountSuccess = (project) => {
  return {
    type: types.USER_ACCOUNT_EDIT_SUCCESS,
    payload: project
  }
};

const requestEditUserAccountError = (error) => {
  return {
    type: types.USER_ACCOUNT_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeleteUserAccount = (projectId) => async dispatch => {
  dispatch( requestDeleteUserAccount() );
  try {
    const res = await deleteUserAccount(projectId);
    dispatch( requestDeleteUserAccountSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteUserAccountError( e.message ) )
  }

};

const requestDeleteUserAccount = () => {
  return {
    type: types.USER_ACCOUNT_DELETE_REQUEST
  }
};

const requestDeleteUserAccountSuccess = (project) => {
  return {
    type: types.USER_ACCOUNT_DELETE_SUCCESS,
    payload: project
  }
};

const requestDeleteUserAccountError = (error) => {
  return {
    type: types.USER_ACCOUNT_DELETE_ERROR,
    payload: error
  }
};

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
};

export default {
  fetchGetAllUserAccounts,
  fetchGetUserAccounts,
  fetchAddUserAccount,
  fetchEditUserAccount,
  fetchDeleteUserAccount,
  resetAfterRequest,
};