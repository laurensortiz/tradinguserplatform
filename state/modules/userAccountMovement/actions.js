import {
  getUserAccountMovements,
  addUserAccountMovement,
  editUserAccountMovement,
  deleteUserAccountMovement,
} from './api'
import types from './types'
import { formatAxiosError } from '../../../common/utils'

// List UserAccountMovements
export const fetchGetUserAccountMovements = (userAccountId = -1) => async (dispatch) => {
  dispatch(requestUserAccountMovements())
  try {
    const res = await getUserAccountMovements(userAccountId)
    dispatch(requestUserAccountMovementsSuccess(res.data))
  } catch (e) {
    dispatch(requestUserAccountMovementsError(e.message))
  }
}

const requestUserAccountMovements = () => {
  return {
    type: types.USER_ACCOUNT_MOVEMENTS_REQUEST,
  }
}

const requestUserAccountMovementsSuccess = (movements) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENTS_SUCCESS,
    payload: movements,
  }
}

const requestUserAccountMovementsError = (error) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENTS_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Add
export const fetchAddUserAccountMovement = (movement) => async (dispatch) => {
  dispatch(requestAddUserAccountMovement())
  try {
    const res = await addUserAccountMovement(movement)
    dispatch(requestAddUserAccountMovementSuccess(res.data))
  } catch (e) {
    dispatch(requestAddUserAccountMovementError(e.message))
  }
}

const requestAddUserAccountMovement = () => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_ADD_REQUEST,
  }
}

const requestAddUserAccountMovementSuccess = (movement) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_ADD_SUCCESS,
    payload: movement,
  }
}

const requestAddUserAccountMovementError = (error) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_ADD_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Edit
export const fetchEditUserAccountMovement = (movement) => async (dispatch) => {
  dispatch(requestEditUserAccountMovement())
  try {
    const res = await editUserAccountMovement(movement)
    dispatch(requestEditUserAccountMovementSuccess(res.data))
  } catch (e) {
    dispatch(requestEditUserAccountMovementError(e.message))
  }
}

const requestEditUserAccountMovement = () => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_EDIT_REQUEST,
  }
}

const requestEditUserAccountMovementSuccess = (movement) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_EDIT_SUCCESS,
    payload: movement,
  }
}

const requestEditUserAccountMovementError = (error) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_EDIT_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Delete
export const fetchDeleteUserAccountMovement = (movementId) => async (dispatch) => {
  dispatch(requestDeleteUserAccountMovement())
  try {
    const res = await deleteUserAccountMovement(movementId)
    dispatch(requestDeleteUserAccountMovementSuccess(res.data))
  } catch (e) {
    dispatch(requestDeleteUserAccountMovementError(e.message))
  }
}

const requestDeleteUserAccountMovement = () => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_DELETE_REQUEST,
  }
}

const requestDeleteUserAccountMovementSuccess = (movement) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_DELETE_SUCCESS,
    payload: movement,
  }
}

const requestDeleteUserAccountMovementError = (error) => {
  return {
    type: types.USER_ACCOUNT_MOVEMENT_DELETE_ERROR,
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
  fetchGetUserAccountMovements,
  fetchAddUserAccountMovement,
  fetchEditUserAccountMovement,
  fetchDeleteUserAccountMovement,
  resetAfterRequest,
}
