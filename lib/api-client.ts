import axios, { HttpStatusCode } from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      // Don't handle 401 errors for login attempts - let the login component handle them
      if (error.config?.url?.includes('/login')) {
        return Promise.reject(error);
      }

      // For other 401 errors (expired tokens, etc.), remove token and redirect
      Cookies.remove('auth-token');
      if (typeof window !== 'undefined') {
        window.location.href = '/platform/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
