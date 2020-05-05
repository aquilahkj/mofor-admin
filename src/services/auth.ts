import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export interface RefreshTokenParamsType {
  token: string;
}

export async function login(params: LoginParamsType) {
  return request('/api/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function refreshToken(params: RefreshTokenParamsType) {
  return request('/api/auth/refreshToken', {
    method: 'POST',
    data: params,
  });
}
