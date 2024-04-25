import * as StorageKey from '../constants/storage-key-const';

export const saveInfo = (user) => {
  localStorage.setItem(StorageKey.USER_ID, user.id);
  localStorage.setItem(StorageKey.EMAIL, user.email);
  localStorage.setItem(StorageKey.ACCESS_TOKEN_KEY, user.accessToken);
  localStorage.setItem(StorageKey.ACCESS_TOKEN_EXPIRATION_TIMESTAMP, user.tokenExpirationInTimeStamp.toString());
  localStorage.setItem(StorageKey.FIRST_NAME, user.firstName || '');
  localStorage.setItem(StorageKey.LAST_NAME, user.lastName || '');
  localStorage.setItem(StorageKey.REF_CODE, user.refCode || '');
  localStorage.setItem(StorageKey.AVATAR_URL, user.avatarUrl || '');
}

export const getUserInfo = () => {
  return {
    id: localStorage.getItem(StorageKey.USER_ID),
    email: localStorage.getItem(StorageKey.EMAIL),
    accessToken: localStorage.getItem(StorageKey.ACCESS_TOKEN_KEY),
    accessTokenExpiration: localStorage.getItem(StorageKey.ACCESS_TOKEN_EXPIRATION_TIMESTAMP),
    firstName: localStorage.getItem(StorageKey.FIRST_NAME),
    lastName: localStorage.getItem(StorageKey.LAST_NAME),
    refCode: localStorage.getItem(StorageKey.REF_CODE),
    avatarUrl: localStorage.getItem(StorageKey.AVATAR_URL),
  };
}

export const removeStoreLoggedUser = () => {
  localStorage.removeItem(StorageKey.ACCESS_TOKEN_KEY);
}

export const getUserRefCode = () => {
  return localStorage.getItem(StorageKey.REF_CODE);
}