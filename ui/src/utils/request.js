import axios from 'axios';
import { SESSIONSTORAGE_KEYS, getSession } from '@src/utils/sessionstorage';

export const baseURL = window.config.baseURL + '/api/v1';

export const request = axios.create({
  baseURL,
  timeout: 1000 * 5,
});

export const rawRequest = axios.create({
  baseURL,
  timeout: 1000 * 5,
});

request.interceptors.request.use(
  (config) => {
    const token = getSession(SESSIONSTORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);
