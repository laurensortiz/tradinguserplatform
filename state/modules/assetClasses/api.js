import fetch from '../../../common/fetch';

export const getAssetClasses = async () => {
  return fetch( {
    method: 'get',
    url: 'asset-classes',
  } );
};

export const addAssetClass = async (assetClass) => {
  return fetch( {
    method: 'post',
    url: 'asset-classes',
    data: assetClass
  } );
};

export const editAssetClass = async (assetClass) => {
  return fetch( {
    method: 'put',
    url: `asset-classes/${ assetClass.id }`,
    data: assetClass
  } );
};

export const deleteAssetClass = async (assetClassId) => {
  return fetch( {
    method: 'delete',
    url: `asset-classes/${ assetClassId }`,
  } );
};