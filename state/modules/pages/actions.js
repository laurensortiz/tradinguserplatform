import { getPages, getPage, addPage, editPage, deletePage } from './api';
import types from './types';

// List Pages
export const fetchGetPages = () => async dispatch => {
  dispatch( requestPages() );
  try {
    const res = await getPages();
    dispatch( requestPagesSuccess( res.data ) )
  } catch (e) {
    dispatch( requestPagesError( e.message ) )
  }

};

const requestPages = () => {
  return {
    type: types.PAGES_REQUEST
  }
};

const requestPagesSuccess = (projects) => {
  return {
    type: types.PAGES_SUCCESS,
    payload: projects
  }
};

const requestPagesError = (error) => {
  return {
    type: types.PAGES_ERROR,
    payload: error
  }
};

//  Page
export const fetchGetPage = (pageId) => async dispatch => {
  dispatch( requestPage() );
  try {
    const res = await getPage(pageId);
    dispatch( requestPageSuccess( res.data ) )
  } catch (e) {
    dispatch( requestPageError( e.message ) )
  }

};

const requestPage = () => {
  return {
    type: types.PAGE_REQUEST
  }
};

const requestPageSuccess = (projects) => {
  return {
    type: types.PAGE_SUCCESS,
    payload: projects
  }
};

const requestPageError = (error) => {
  return {
    type: types.PAGE_ERROR,
    payload: error
  }
};

// Add
export const fetchAddPage = (user) => async dispatch => {
  dispatch( requestAddPage() );
  try {
    const res = await addPage(user);
    dispatch( requestAddPageSuccess( res.data ) )
  } catch (e) {
    dispatch( requestAddPageError( e.message ) )
  }

};

const requestAddPage = () => {
  return {
    type: types.PAGE_ADD_REQUEST
  }
};

const requestAddPageSuccess = (project) => {
  return {
    type: types.PAGE_ADD_SUCCESS,
    payload: project
  }
};

const requestAddPageError = (error) => {
  return {
    type: types.PAGE_ADD_ERROR,
    payload: error
  }
};

// Edit
export const fetchEditPage = (project) => async dispatch => {
  dispatch( requestEditPage() );
  try {
    const res = await editPage(project);
    dispatch( requestEditPageSuccess( res.data ) )
  } catch (e) {
    dispatch( requestEditPageError( e.message ) )
  }

};

const requestEditPage = () => {
  return {
    type: types.PAGE_EDIT_REQUEST
  }
};

const requestEditPageSuccess = (project) => {
  return {
    type: types.PAGE_EDIT_SUCCESS,
    payload: project
  }
};

const requestEditPageError = (error) => {
  return {
    type: types.PAGE_EDIT_ERROR,
    payload: error
  }
};

// Delete
export const fetchDeletePage = (projectId) => async dispatch => {
  dispatch( requestDeletePage() );
  try {
    const res = await deletePage(projectId);
    dispatch( requestDeletePageSuccess(res.data) )
  } catch (e) {
    dispatch( requestDeletePageError( e.message ) )
  }

};

const requestDeletePage = () => {
  return {
    type: types.PAGE_DELETE_REQUEST
  }
};

const requestDeletePageSuccess = (project) => {
  return {
    type: types.PAGE_DELETE_SUCCESS,
    payload: project
  }
};

const requestDeletePageError = (error) => {
  return {
    type: types.PAGE_DELETE_ERROR,
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
  fetchGetPages,
  fetchGetPage,
  fetchAddPage,
  fetchEditPage,
  fetchDeletePage,
  resetAfterRequest,
};