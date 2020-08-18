import fetch from '../../../common/fetch';

export const getSettings = async () => {
  return fetch( {
    method: 'get',
    url: 'setting',
  } );
};

export const addSetting = async (setting) => {
  return fetch( {
    method: 'post',
    url: 'setting',
    data: setting
  } );
};

export const editSetting = async (setting) => {
  return fetch( {
    method: 'put',
    url: `setting/${ setting.id }`,
    data: setting
  } );
};

export const deleteSetting = async (settingId) => {
  return fetch( {
    method: 'delete',
    url: `setting/${ settingId }`,
  } );
};