import { request } from '@src/utils/request';

export function login(data) {
  return request.post('/login', data);
}
