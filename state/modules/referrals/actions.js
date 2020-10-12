import { getReferrals, getReferral, addReferral, editReferral, deleteReferral, getUserAccountReferrals } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List Referrals
export const fetchGetReferrals = (requestData) => async dispatch => {
  dispatch( requestReferrals() );
  try {
    const res = await getReferrals(requestData);
    dispatch( requestReferralsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestReferralsError( e.message ) )
  }

};

const requestReferrals = () => {
  return {
    type: types.REFERRALS_REQUEST
  }
};

const requestReferralsSuccess = (referral) => {
  return {
    type: types.REFERRALS_SUCCESS,
    payload: referral
  }
};

const requestReferralsError = (error) => {
  return {
    type: types.REFERRALS_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Referral
export const fetchGetReferral = (referralId) => async dispatch => {
  dispatch( requestReferral() );
  try {
    const res = await getReferral(referralId);
    dispatch( requestReferralSuccess( res.data ) )
  } catch (e) {
    dispatch( requestReferralError( e.message ) )
  }

};

const requestReferral = () => {
  return {
    type: types.REFERRAL_REQUEST
  }
};

const requestReferralSuccess = (referral) => {
  return {
    type: types.REFERRAL_SUCCESS,
    payload: referral
  }
};

const requestReferralError = (error) => {
  return {
    type: types.REFERRAL_ERROR,
    payload: formatAxiosError(error.response)
  }
};

export const fetchGetUserAccountReferrals = () => async dispatch => {
  dispatch( requestUserAccountReferrals() );
  try {
    const res = await getUserAccountReferrals();
    dispatch( requestUserAccountReferralsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestUserAccountReferralsError( e.message ) )
  }

};

const requestUserAccountReferrals = () => {
  return {
    type: types.REFERRALS_USER_ACCOUNT_REQUEST
  }
};

const requestUserAccountReferralsSuccess = (referral) => {
  return {
    type: types.REFERRALS_USER_ACCOUNT_SUCCESS,
    payload: referral
  }
};

const requestUserAccountReferralsError = (error) => {
  return {
    type: types.REFERRALS_USER_ACCOUNT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddReferral = (user) => async dispatch => {
  dispatch( requestAddReferral() );
  try {
    const res = await addReferral(user);
    dispatch( requestAddReferralSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddReferralError( e.message ) )
  }

};

const requestAddReferral = () => {
  return {
    type: types.REFERRAL_ADD_REQUEST
  }
};

const requestAddReferralSuccess = (assetClass) => {
  return {
    type: types.REFERRAL_ADD_SUCCESS,
    payload: assetClass
  }
};

const requestAddReferralError = (error) => {
  return {
    type: types.REFERRAL_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditReferral = (assetClass) => async dispatch => {
  dispatch( requestEditReferral() );
  try {
    const res = await editReferral(assetClass);
    dispatch( requestEditReferralSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditReferralError( e.message ) )
  }

};

const requestEditReferral = () => {
  return {
    type: types.REFERRAL_EDIT_REQUEST
  }
};

const requestEditReferralSuccess = (assetClass) => {
  return {
    type: types.REFERRAL_EDIT_SUCCESS,
    payload: assetClass
  }
};

const requestEditReferralError = (error) => {
  return {
    type: types.REFERRAL_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteReferral = (assetClassId) => async dispatch => {
  dispatch( requestDeleteReferral() );
  try {
    const res = await deleteReferral(assetClassId);
    dispatch( requestDeleteReferralSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteReferralError( e.message ) )
  }

};

const requestDeleteReferral = () => {
  return {
    type: types.REFERRAL_DELETE_REQUEST
  }
};

const requestDeleteReferralSuccess = (assetClass) => {
  return {
    type: types.REFERRAL_DELETE_SUCCESS,
    payload: assetClass
  }
};

const requestDeleteReferralError = (error) => {
  return {
    type: types.REFERRAL_DELETE_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Reset After any request
export const resetAfterRequest = () => {
  return {
    type: types.RESET_AFTER_REQUEST,
  }
};

export default {
  fetchGetReferrals,
  fetchGetReferral,
  fetchAddReferral,
  fetchEditReferral,
  fetchDeleteReferral,
  resetAfterRequest,
  fetchGetUserAccountReferrals,
};