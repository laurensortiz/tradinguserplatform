import { getUsers, addUser, editUser, deleteUser } from './api'
import { formatAxiosError } from '../../../common/utils'

import types from './types'

// List Users
export const fetchGetUsers = (requestParams) => async (dispatch) => {
  dispatch(requestUsers())
  try {
    const res = await getUsers(requestParams)
    dispatch(requestUsersSuccess(res.data))
  } catch (e) {
    dispatch(requestUsersError(e))
  }
}

const requestUsers = () => {
  return {
    type: types.USERS_REQUEST,
  }
}

const requestUsersSuccess = (users) => {
  return {
    type: types.USERS_SUCCESS,
    payload: users,
  }
}

const requestUsersError = (error) => {
  return {
    type: types.USERS_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Add
export const fetchAddUser = (user) => async (dispatch) => {
  dispatch(requestAddUser())
  try {
    const res = await addUser(user)
    dispatch(requestAddUserSuccess(res.data))
  } catch (e) {
    dispatch(requestAddUserError(e))
  }
}

const requestAddUser = () => {
  return {
    type: types.USER_ADD_REQUEST,
  }
}

const requestAddUserSuccess = (user) => {
  return {
    type: types.USER_ADD_SUCCESS,
    payload: user,
  }
}

const requestAddUserError = (error) => {
  return {
    type: types.USER_ADD_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Edit
export const fetchEditUser = (user) => async (dispatch) => {
  dispatch(requestEditUser())
  try {
    const res = await editUser(user)
    dispatch(requestEditUserSuccess(res.data))
  } catch (e) {
    dispatch(requestEditUserError(e.message))
  }
}

const requestEditUser = () => {
  return {
    type: types.USER_EDIT_REQUEST,
  }
}

const requestEditUserSuccess = (user) => {
  return {
    type: types.USER_EDIT_SUCCESS,
    payload: user,
  }
}

const requestEditUserError = (error) => {
  return {
    type: types.USER_EDIT_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Delete
export const fetchDeleteUser = (userId) => async (dispatch) => {
  dispatch(requestDeleteUser())
  try {
    const res = await deleteUser(userId)
    dispatch(requestDeleteUserSuccess(res.data))
  } catch (e) {
    dispatch(requestDeleteUserError(e.message))
  }
}

const requestDeleteUser = () => {
  return {
    type: types.USER_DELETE_REQUEST,
  }
}

const requestDeleteUserSuccess = (user) => {
  return {
    type: types.USER_DELETE_SUCCESS,
    payload: user,
  }
}

const requestDeleteUserError = (error) => {
  return {
    type: types.USER_DELETE_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
}

export default {
  fetchGetUsers,
  fetchAddUser,
  fetchEditUser,
  fetchDeleteUser,
  resetAfterRequest,
}
