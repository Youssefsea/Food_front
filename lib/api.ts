import axios from 'axios';
import Cookies from 'js-cookie';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://food-back-nod.vercel.app';

// Create API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Store in-flight requests to prevent duplicates
const pendingRequests = new Map<string, AbortController>();

// Initialize interceptors strictly on the client side
if (typeof window !== 'undefined') {
  api.interceptors.request.use(config => {
    if (!navigator.onLine) {
      return Promise.reject(new Error('Offline'));
    }

    // [مهم] إضافة التوكن تلقائياً لأي طلب لتجنب تسجيل الخروج عند تحديث الصفحة
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const url = config.url || '';
    const method = config.method || 'get';
    const requestKey = `${method}-${url}`;

    // Cancel duplicated requests
    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey)?.abort();
      pendingRequests.delete(requestKey);
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestKey, controller);

    return config;
  });

api.interceptors.response.use(
    response => {
      const url = response.config.url || '';
      const method = response.config.method || 'get';
      const requestKey = `${method}-${url}`;
      pendingRequests.delete(requestKey);
      return response;
    },
    error => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      const url = error.config?.url || '';
      const method = error.config?.method || 'get';
      const requestKey = `${method}-${url}`;
      pendingRequests.delete(requestKey);

      const msg = error.response?.data?.message;
      if (
        error.response?.status === 401 ||
        msg === 'Invalid or expired token'
      ) {
        clearAllTokens();
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );
}

export function setCustomerToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('customerToken', token);
    Cookies.set('token', token, { expires: 7 });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export function setVendorToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vendorToken', token);
    Cookies.set('token', token, { expires: 7 });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export function setAdminToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
    Cookies.set('token', token, { expires: 7 });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export function clearAllTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    Cookies.remove('token');
    Cookies.remove('user');
    delete api.defaults.headers.common['Authorization'];
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return Cookies.get('token') || 
           localStorage.getItem('customerToken') || 
           localStorage.getItem('vendorToken') || 
           localStorage.getItem('adminToken') || 
           null;
  }
  return null;
}

export function getUserRole(): 'customer' | 'vendor' | 'restaurant' | 'admin' | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData') || Cookies.get('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const role = user.role as 'customer' | 'vendor' | 'restaurant' | 'admin';
        // Normalize 'restaurant' to 'vendor' for consistency
        return role === 'restaurant' ? 'vendor' : role;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const token = getToken();
    return !!token;
  }
  return false;
}

export default api;