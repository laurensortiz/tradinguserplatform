import { getAssetClasses, addAssetClass, editAssetClass, deleteAssetClass } from './api';
import types from './types';

// List AssetClasses
export const fetchGetAssetClasses = () => async dispatch => {
  dispatch( requestAssetClasses() );
  try {
    const res = await getAssetClasses();
    dispatch( requestAssetClassesSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAssetClassesError( e.message ) )
  }

};

const requestAssetClasses = () => {
  return {
    type: types.ASSET_CLASSES_REQUEST
  }
};

const requestAssetClassesSuccess = (products) => {
  return {
    type: types.ASSET_CLASSES_SUCCESS,
    payload: products
  }
};

const requestAssetClassesError = (error) => {
  return {
    type: types.ASSET_CLASSES_ERROR,
    payload: error
  }
};

// Add
export const fetchAddAssetClass = (user) => async dispatch => {
  dispatch( requestAddAssetClass() );
  try {
    const res = await addAssetClass(user);
    dispatch( requestAddAssetClassSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddAssetClassError( e.message ) )
  }

};

const requestAddAssetClass = () => {
  return {
    type: types.ASSET_CLASS_ADD_REQUEST
  }
};

const requestAddAssetClassSuccess = (assetClass) => {
  return {
    type: types.ASSET_CLASS_ADD_SUCCESS,
    payload: assetClass
  }
};

const requestAddAssetClassError = (error) => {
  return {
    type: types.ASSET_CLASS_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditAssetClass = (assetClass) => async dispatch => {
  dispatch( requestEditAssetClass() );
  try {
    const res = await editAssetClass(assetClass);
    dispatch( requestEditAssetClassSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditAssetClassError( e.message ) )
  }

};

const requestEditAssetClass = () => {
  return {
    type: types.ASSET_CLASS_EDIT_REQUEST
  }
};

const requestEditAssetClassSuccess = (assetClass) => {
  return {
    type: types.ASSET_CLASS_EDIT_SUCCESS,
    payload: assetClass
  }
};

const requestEditAssetClassError = (error) => {
  return {
    type: types.ASSET_CLASS_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeleteAssetClass = (assetClassId) => async dispatch => {
  dispatch( requestDeleteAssetClass() );
  try {
    const res = await deleteAssetClass(assetClassId);
    dispatch( requestDeleteAssetClassSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeleteAssetClassError( e.message ) )
  }

};

const requestDeleteAssetClass = () => {
  return {
    type: types.ASSET_CLASS_DELETE_REQUEST
  }
};

const requestDeleteAssetClassSuccess = (assetClass) => {
  return {
    type: types.ASSET_CLASS_DELETE_SUCCESS,
    payload: assetClass
  }
};

const requestDeleteAssetClassError = (error) => {
  return {
    type: types.ASSET_CLASS_DELETE_ERROR,
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
  fetchGetAssetClasses,
  fetchAddAssetClass,
  fetchEditAssetClass,
  fetchDeleteAssetClass,
  resetAfterRequest,
};