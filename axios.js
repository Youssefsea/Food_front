import axios from 'axios';
import Cookies from 'js-cookie';

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
  const customerToken = localStorage.getItem('customerToken');
  const vendorToken = localStorage.getItem('vendorToken');
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  const cookieToken = Cookies.get('token');

  if (pathname.startsWith('/vendor')) {
    return vendorToken || token || cookieToken || customerToken;
  }

  if (pathname.startsWith('/admin')) {
    return adminToken || token || cookieToken;
  }

  return customerToken || token || cookieToken || vendorToken || adminToken;
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
        localStorage.removeItem('customerToken');
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        Cookies.remove('token');
        Cookies.remove('userRole');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
