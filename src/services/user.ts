import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function getInfo(): Promise<any> {
  return request('/api/user/getInfo');
}

export async function getAuthority(): Promise<any> {
  return request('/api/user/getAuthority');
}
