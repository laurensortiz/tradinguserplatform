import fetch from '../../../common/fetch';

export const getReferrals = async (requestData) => {
  return fetch( {
    method: 'post',
    url: 'referral',
    data: requestData,
  } );
};

export const addReferral = async (referral) => {
  return fetch( {
    method: 'post',
    url: 'referral/create',
    data: referral
  } );
};

export const getUserAccountReferrals = async (userAccount) => {
  return fetch( {
    method: 'get',
    url: `referral/user-account/${ userAccount.id }`,
  } );
};

export const editReferral = async (referral) => {
  return fetch( {
    method: 'put',
    url: `referral/${ referral.id }`,
    data: referral
  } );
};

export const deleteReferral = async (referralId) => {
  return fetch( {
    method: 'delete',
    url: `referral/${ referralId }`,
  } );
};