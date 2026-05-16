import api from '@/lib/api';
import Cookies from 'js-cookie';
import { setCustomerToken, setVendorToken, setAdminToken, clearAllTokens } from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';

// ─── Types ───
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CustomerSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer';
}

export interface VendorSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  description: string;
  location: string;
  allowed_radius_km: number;
  open_time: string;
  close_time: string;
  area_name: string;
  can_deliver: boolean;
  can_reserve: boolean;
  delivery_area: number[][];
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  token: string;
}

// ─── Customer Auth ───
export async function customerLogin(credentials: LoginCredentials): Promise<UserData> {
  const res = await api.post(ENDPOINTS.CUSTOMER_LOGIN, credentials);
  const user = res.data.user;
  if (user?.token) {
    localStorage.clear();
    await setCustomerToken(user.token);
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
  }
  return user;
}

export async function customerSignup(data: CustomerSignupData): Promise<void> {
  await api.post(ENDPOINTS.CUSTOMER_SIGNUP, data);
}

// ─── Vendor Auth ───
export async function vendorLogin(credentials: LoginCredentials): Promise<UserData> {
  const res = await api.post(ENDPOINTS.RESTAURANT_LOGIN, {
    ...credentials,
    role: 'restaurant',
  });
  const restaurant = res.data.restaurant || res.data.user;
  if (restaurant?.token) {
    localStorage.clear();

    await setVendorToken(restaurant.token);
    Cookies.set('user', JSON.stringify(restaurant), { expires: 7 });
  }
  return restaurant;
}

export async function vendorSignup(data: VendorSignupData): Promise<void> {
  await api.post(ENDPOINTS.RESTAURANT_SIGNUP, data);
}

// ─── Admin Auth ───
export async function adminLogin(credentials: LoginCredentials): Promise<UserData> {
  const res = await api.post('/LogforAdmin', credentials);
  const user = res.data.user || res.data.admin;
  if (user?.token) {
    localStorage.clear();

    await setAdminToken(user.token);
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
  }
  return user;
}

// ─── Logout ───
export async function logout(): Promise<void> {
  try {
    await Promise.any([
      api.post('/customer/logout'),
      api.post('/restaurant/logout'),
      api.post('/admin/logout'),
    ]);
  } catch {
    // Backend logout endpoint is optional; local cleanup is always enforced below.
  } finally {
    await clearAllTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

// ─── Get Stored User ───
export function getStoredUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = Cookies.get('user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
