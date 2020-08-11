import fetch from '../../../common/fetch';

export const getUsers = async (requestParams) => {
  return fetch({
    method: 'post',
    url: 'users',
    data: requestParams
  });
};

export const addUser = async (user) => {
  return fetch({
    method: 'post',
    url: 'users/new',
    data: user
  });
};

export const editUser = async (user) => {
  return fetch({
    method: 'put',
    url: `users/${user.id}`,
    data: user
  });
};

export const deleteUser = async (userId) => {
  return fetch({
    method: 'delete',
    url: `users/${userId}`,
  });
};