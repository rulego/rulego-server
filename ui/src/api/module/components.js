import { request } from '@src/utils/request';

export function getComponents() {
  return request.get('/components');
}
