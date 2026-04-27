import axios from 'axios';
import { clearToken, getToken } from './lib/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://food-back-nod.vercel.app',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getActiveToken = () => {
  if (typeof window === 'undefined') return null;

  const pathname = window.location.pathname || '';

  if (pathname.startsWith('/vendor')) {
    return getToken('vendor') || getToken('customer');
  }

  if (pathname.startsWith('/admin')) {
    return getToken('admin');
  }

  return getToken('customer') || getToken('vendor') || getToken('admin') || getToken();
};

const isPublicPath = (pathname) => {
  const publicPrefixes = ['/', '/login', '/signup', '/explore', '/restaurant'];

  return publicPrefixes.some((prefix) => {
    if (prefix === '/') return pathname === '/';
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
};

api.interceptors.request.use(
  (config) => {
    const token = getActiveToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const currentPath = window.location.pathname || '/';

      if (!isPublicPath(currentPath)) {
        clearToken();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
