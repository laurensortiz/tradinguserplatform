import fetch from '../../../common/fetch';

export const getPages = async () => {
  return fetch({
    method: 'get',
    url: 'pages',
  });
};

export const getPage = async (pageId) => {
  return fetch({
    method: 'get',
    url: `pages/${pageId}`,
  });
};

export const addPage = async (page) => {
  return fetch({
    method: 'post',
    url: 'pages',
    data: page
  });
};

export const editPage = async (page) => {
  console.log('[=====  PAGES  =====>');
  console.log(page);
  console.log('<=====  /PAGES  =====]');
  return fetch({
    method: 'put',
    url: `pages/${page.id}`,
    data: page
  });
};

export const deletePage = async (pageId) => {
  return fetch({
    method: 'delete',
    url: `pages/${pageId}`,
  });
};