import { IResponse, request } from '@utils/request';

export const TOKEN_KEY = '__token__';

export interface User {
  token?: string;
  username: string;
  password: string;
  avatar?: string;
}

export const handleUserResponser = (data: any) => {
  // window.localStorage.setItem(TOKEN_KEY, data?.token || '');
  window.electron.store.set(TOKEN_KEY, data?.token || '');

  return data?.token;
};

export const login = (data: { username: string; password: string }) => {
  return request<IResponse>('/login', {
    data,
    method: 'POST',
  }).then((res) => {
    if (res.success) {
      return handleUserResponser(res.data);
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  return request<IResponse>('/register', {
    method: 'POST',
    data,
  }).then((res) => {
    if (res.success) {
      return handleUserResponser(res.data);
    }
  });
};

export const logout = async () => {
  // window.localStorage.removeItem(TOKEN_KEY);
  // window.location.reload();
  window.electron.store.delete(TOKEN_KEY);
};
