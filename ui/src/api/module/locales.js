import { request } from '@src/utils/request';

export function getLocales() {
  return request.get('/locales');
}
