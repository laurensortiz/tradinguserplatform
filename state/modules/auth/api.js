import fetch from '../../../common/fetch';

export const fetchLogin = async ({ username, password }) => {
  return fetch({
    method: 'post',
    url: 'login',
    data: JSON.stringify({ username: username.toLowerCase(), password })
  });
};

export const fetchLogout = async () => {
  return  fetch({
    method: 'post',
    url: 'logout',
    data: JSON.stringify({ })
  });
};

