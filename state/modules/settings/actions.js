import { getSettings, addSetting, editSetting, deleteSetting } from './api';
import types from './types';
import { formatAxiosError } from "../../../common/utils";

// List Settings
export const fetchGetSettings = () => async dispatch => {
  dispatch( requestSettings() );
  try {
    const res = await getSettings();
    dispatch( requestSettingsSuccess( res.data ) )
  } catch (e) {
    dispatch( requestSettingsError( e.message ) )
  }

};

const requestSettings = () => {
  return {
    type: types.SETTINGS_REQUEST
  }
};

const requestSettingsSuccess = (products) => {
  return {
    type: types.SETTINGS_SUCCESS,
    payload: products
  }
};

const requestSettingsError = (error) => {
  return {
    type: types.SETTINGS_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Add
export const fetchAddSetting = (user) => async dispatch => {
  dispatch( requestAddSetting() );
  try {
    const res = await addSetting(user);
    dispatch( requestAddSettingSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddSettingError( e.message ) )
  }

};

const requestAddSetting = () => {
  return {
    type: types.SETTING_ADD_REQUEST
  }
};

const requestAddSettingSuccess = (assetClass) => {
  return {
    type: types.SETTING_ADD_SUCCESS,
    payload: assetClass
  }
};

const requestAddSettingError = (error) => {
  return {
    type: types.SETTING_ADD_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Edit
export const fetchEditSetting = (assetClass) => async dispatch => {
  dispatch( requestEditSetting() );
  try {
    const res = await editSetting(assetClass);
    dispatch( requestEditSettingSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditSettingError( e.message ) )
  }

};

const requestEditSetting = () => {
  return {
    type: types.SETTING_EDIT_REQUEST
  }
};

const requestEditSettingSuccess = (assetClass) => {
  return {
    type: types.SETTING_EDIT_SUCCESS,
    payload: assetClass
  }
};

const requestEditSettingError = (error) => {
  return {
    type: types.SETTING_EDIT_ERROR,
    payload: formatAxiosError(error.response)
  }
};

// Delete
export const fetchDeleteSetting = (assetClassId) => async dispatch => {
  dispatch( requestDeleteSetting() );
  try {
    const res = await deleteSetting(assetClassId);
    dispatch( requestDeleteSettingSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteSettingError( e.message ) )
  }

};

const requestDeleteSetting = () => {
  return {
    type: types.SETTING_DELETE_REQUEST
  }
};

const requestDeleteSettingSuccess = (assetClass) => {
  return {
    type: types.SETTING_DELETE_SUCCESS,
    payload: assetClass
  }
};

const requestDeleteSettingError = (error) => {
  return {
    type: types.SETTING_DELETE_ERROR,
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
  fetchGetSettings,
  fetchAddSetting,
  fetchEditSetting,
  fetchDeleteSetting,
  resetAfterRequest,
};