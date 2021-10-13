import { getFundMovements, addFundMovement, editFundMovement, deleteFundMovement } from './api'
import types from './types'
import { formatAxiosError } from '../../../common/utils'

// List FundMovements
export const fetchGetFundMovements = (operationId) => async (dispatch) => {
  dispatch(requestFundMovements())
  try {
    const res = await getFundMovements(operationId)
    dispatch(requestFundMovementsSuccess(res.data))
  } catch (e) {
    dispatch(requestFundMovementsError(e.message))
  }
}

const requestFundMovements = () => {
  return {
    type: types.FUND_MOVEMENTS_REQUEST,
  }
}

const requestFundMovementsSuccess = (movements) => {
  return {
    type: types.FUND_MOVEMENTS_SUCCESS,
    payload: movements,
  }
}

const requestFundMovementsError = (error) => {
  return {
    type: types.FUND_MOVEMENTS_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Add
export const fetchAddFundMovement = (operation) => async (dispatch) => {
  dispatch(requestAddFundMovement())
  try {
    const res = await addFundMovement(operation)
    dispatch(requestAddFundMovementSuccess(res.data))
  } catch (e) {
    dispatch(requestAddFundMovementError(e.message))
  }
}

const requestAddFundMovement = () => {
  return {
    type: types.FUND_MOVEMENT_ADD_REQUEST,
  }
}

const requestAddFundMovementSuccess = (movement) => {
  return {
    type: types.FUND_MOVEMENT_ADD_SUCCESS,
    payload: movement,
  }
}

const requestAddFundMovementError = (error) => {
  return {
    type: types.FUND_MOVEMENT_ADD_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Edit
export const fetchEditFundMovement = (movement) => async (dispatch) => {
  dispatch(requestEditFundMovement())
  try {
    const res = await editFundMovement(movement)
    dispatch(requestEditFundMovementSuccess(res.data))
  } catch (e) {
    dispatch(requestEditFundMovementError(e.message))
  }
}

const requestEditFundMovement = () => {
  return {
    type: types.FUND_MOVEMENT_EDIT_REQUEST,
  }
}

const requestEditFundMovementSuccess = (movement) => {
  return {
    type: types.FUND_MOVEMENT_EDIT_SUCCESS,
    payload: movement,
  }
}

const requestEditFundMovementError = (error) => {
  return {
    type: types.FUND_MOVEMENT_EDIT_ERROR,
    payload: formatAxiosError(error.response),
  }
}

// Delete
export const fetchDeleteFundMovement = (movementId) => async (dispatch) => {
  dispatch(requestDeleteFundMovement())
  try {
    const res = await deleteFundMovement(movementId)
    dispatch(requestDeleteFundMovementSuccess(res.data))
  } catch (e) {
    dispatch(requestDeleteFundMovementError(e.message))
  }
}

const requestDeleteFundMovement = () => {
  return {
    type: types.FUND_MOVEMENT_DELETE_REQUEST,
  }
}

const requestDeleteFundMovementSuccess = (movement) => {
  return {
    type: types.FUND_MOVEMENT_DELETE_SUCCESS,
    payload: movement,
  }
}

const requestDeleteFundMovementError = (error) => {
  return {
    type: types.FUND_MOVEMENT_DELETE_ERROR,
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
  fetchGetFundMovements,
  fetchAddFundMovement,
  fetchEditFundMovement,
  fetchDeleteFundMovement,
  resetAfterRequest,
}
