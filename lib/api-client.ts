import axios, { HttpStatusCode } from 'axios';

import { getApiBaseUrl } from './api-config';
import { SESSION_EVENT, clearAuthToken, getAuthToken } from './session';

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      if (error.config?.url?.includes('/login')) {
        return Promise.reject(error);
      }

      clearAuthToken(SESSION_EVENT.expired);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
