import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';

// ─── Types ───
export interface DashboardData {
  restaurant: {
    id: number;
    name: string;
    is_open: boolean;
  };
  stats: {
    dishes: { total: number; available: number };
    orders: { today: number; pending: number; total: number };
    revenue: { today: number; total: number };
  };
  recentOrders: Order[];
  topDishes: TopDish[];
}

export interface TopDish {
  id: number;
  name: string;
  price: number;
  image?: string;
  soldCount?: number;
  revenue?: number;
}

export interface Order {
  id: number;
  total_amount: number;
  delivery_fee: number;
  status: string;
  is_reservation: boolean | number;
  reservation_date?: string;
  location?: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  items: OrderItem[];
}

export interface OrderItem {
  dish_id: number;
  dish_name: string;
  quantity: number;
  price: number;
}

export interface RestaurantProfile {
  name: string;
  email: string;
  phone: string;
  description: string;
  location: string;
  allowed_radius_km: number;
  open_time: string;
  close_time: string;
  delivery_fees: number;
  is_open?: boolean;
}

export interface DishFormData {
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  category: string;
  images?: File[];
}

// ─── Profile ───
export async function getRestaurantProfile() {
  const res = await api.get(ENDPOINTS.RESTAURANT_PROFILE);
  return res.data;
}

export async function updateRestaurantInfo(data: Partial<RestaurantProfile>) {
  const res = await api.put(ENDPOINTS.RESTAURANT_UPDATE_INFO, data);
  return res.data;
}

export async function toggleOpenStatus() {
  const res = await api.get(ENDPOINTS.RESTAURANT_TOGGLE_OPEN);
  return res.data;
}

// ─── Dashboard ───
export async function getDashboard(): Promise<DashboardData> {
  const res = await api.get(ENDPOINTS.RESTAURANT_DASHBOARD);
  return res.data;
}

// ─── Dishes ───
export async function addDish(data: DishFormData) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('preparation_time', data.preparation_time.toString());
  formData.append('category', data.category);
  if (data.images) {
    data.images.forEach((img) => formData.append('images', img));
  }

  const res = await api.post(ENDPOINTS.ADD_DISH, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateDish(dishId: number, data: Partial<DishFormData>) {
  const res = await api.put(ENDPOINTS.UPDATE_DISH, { dishId, ...data });
  return res.data;
}

export async function toggleDishAvailability(dishId: number, isAvailable: boolean) {
  const res = await api.put(ENDPOINTS.TOGGLE_DISH_AVAILABILITY, {
    dishId,
    is_available: isAvailable,
  });
  return res.data;
}

export async function deleteDish(dishId: number) {
  const res = await api.delete(ENDPOINTS.DELETE_DISH, { data: { dishId } });
  return res.data;
}

// ─── Orders ───
export async function getOrders(params?: { status?: string; limit?: number; offset?: number }) {
  const res = await api.get(ENDPOINTS.RESTAURANT_ORDERS, { params });
  return res.data;
}

export async function updateOrderStatus(orderId: number, status: string) {
  const res = await api.post(ENDPOINTS.UPDATE_ORDER_STATUS, { orderId, status });
  return res.data;
}
