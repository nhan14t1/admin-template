import axios from 'axios';
import { BASE_API_URL } from '../constants/app-const';
import * as STORAGE_KEY from '../constants/storage-key-const';
import { errorAlert, warningAlert } from './alertUtils';
import { removeStoreLoggedUser } from './accountUtils';

const getOptions = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN_KEY),
    },
    // NODE_TLS_REJECT_UNAUTHORIZED:'0'
  };
}

const getFileOptions = () => {
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN_KEY),
    },
    // NODE_TLS_REJECT_UNAUTHORIZED:'0'
  };
}

export const appFetch = async (url) => {
  try {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const res = await fetch(BASE_API_URL + url,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      });

    return await res.json();
  } catch (err) {
    return await { error: err.message, isError: true };
  }
}

export const get = (url, isCatchError = true) => {
  return axios.get(BASE_API_URL + url, getOptions())
    .catch((res) => {
      handleError(res, isCatchError);
    });
}

export const post = (url, data, isCatchError = true) => {
  return axios.post(BASE_API_URL + url, data, getOptions())
    .catch((res) => {
      handleError(res, isCatchError);
    });;
}

export const postFile = (url, data, isCatchError = true) => {
  return axios.post(BASE_API_URL + url, data, getFileOptions())
    .catch((res) => {
      handleError(res, isCatchError);
    });;
}

export const put = (url, data, isCatchError = true, showErrorAlert = true) => {
  return axios.put(BASE_API_URL + url, data, getOptions())
    .catch((res) => {
      handleError(res, isCatchError, showErrorAlert);
    });
}

export const deleteAPI = (url, isCatchError = true) => {
  return axios.delete(BASE_API_URL + url, getOptions())
    .catch((res) => {
      handleError(res, isCatchError);
    });
}

const handleError = (error, isCatchError = true, showErrorAlert = true) => {
  if (!error || !error.response) {
    return;
  }
  const res = error.response;

  if (res.status === 401) {
    // Clear cache
    // Remove old access token if have
    removeStoreLoggedUser();

    showErrorAlert && warningAlert('Phiên đăng nhập hết hạn');
    setTimeout(() => {
      // Navigate to login page
      // window.location.href = window.location.origin + '/admin/login';
    }, 2000);
    return;
  }

  if (res.status === 403) {
    //
    // Navigate to forbidden page
    // window.location.href = window.location.origin + '/forbidden';
  }

  let messageError = res && res.data && res.data.message
    ? res.data.message : 'Sorry, an error has occurred';

  showErrorAlert && errorAlert(messageError);
  if (isCatchError) {
    throw error;
  }
}