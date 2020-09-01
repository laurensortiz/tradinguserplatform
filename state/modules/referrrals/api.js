import fetch from '../../../common/fetch';

export const getReferrals = async () => {
  return fetch( {
    method: 'get',
    url: 'referral',
  } );
};

export const addReferral = async (referral) => {
  return fetch( {
    method: 'post',
    url: 'referral',
    data: referral
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