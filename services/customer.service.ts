import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/constants';

// ─── Types ───
export interface Restaurant {
  id: number;
  restaurant_name?: string;
  name?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  can_deliver?: boolean;
  can_reserve?: boolean;
  delivery_fees?: number;
  is_open?: boolean | number;
  open_time?: string;
  close_time?: string;
}

export interface Dish {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  is_available?: boolean;
  preparation_time?: number;
  restaurant_id?: number;
}

export interface CartItem {
  dishId: number;
  quantity: number;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  restaurantId?: number;
  restaurantName?: string;
}

export interface OrderData {
  location: string;
  lat: number;
  lng: number;
  is_reservation: boolean;
  reservation_date?: string | null;
}

// ─── Profile ───
export async function getProfile() {
  const res = await api.get(ENDPOINTS.CUSTOMER_PROFILE);
  return res.data.user;
}

export async function updateProfile(data: { name?: string; phone?: string }) {
  const res = await api.put(ENDPOINTS.CUSTOMER_UPDATE_PROFILE, data);
  return res.data;
}

// ─── Restaurants ───
export async function getAllRestaurants(): Promise<Restaurant[]> {
  const res = await api.get(ENDPOINTS.ALL_RESTAURANTS);
  return res.data.restaurants || [];
}

export async function getNearbyRestaurants(lat: number, lng: number) {
  const res = await api.post(ENDPOINTS.NEAREST_RESTAURANTS, { lat, lng });
  return res.data;
}

export async function getRestaurantDishes(restaurantId: number): Promise<Dish[]> {
  const res = await api.post(ENDPOINTS.RESTAURANT_DISHES, { restaurantId });
  return res.data.dishes || [];
}

// ─── Cart ───
export async function addToCart(dishId: number, quantity: number) {
  const res = await api.post(ENDPOINTS.ADD_TO_CART, { dishId, quantity });
  return res.data;
}

export async function viewCart() {
  const res = await api.get(ENDPOINTS.VIEW_CART);
  return res.data;
}

export async function removeFromCart(dishId: number) {
  const res = await api.delete(ENDPOINTS.REMOVE_FROM_CART, { data: { dishId } });
  return res.data;
}

export async function updateCartQuantity(dishId: number, quantity: number) {
  const res = await api.put('/customer/update-dish-quantity-in-cart', { dishId, quantity });
  return res.data;
}

// ─── Orders ───
export async function placeOrder(data: OrderData) {
  const res = await api.post(ENDPOINTS.PLACE_ORDER, data);
  return res.data;
}

export async function uploadPaymentProof(orderId: number, paymentMethod: string, imageFile: File) {
  const formData = new FormData();
  formData.append('orderId', orderId.toString());
  formData.append('payment_method', paymentMethod);
  formData.append('images', imageFile);
  
  const res = await api.post(ENDPOINTS.UPLOAD_PAYMENT, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getPaymentStatus(orderId: number) {
  const res = await api.post(ENDPOINTS.PAYMENT_STATUS, { orderId });
  return res.data;
}
