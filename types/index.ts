/**
 * Shared TypeScript types for the Akly food delivery platform
 * These types align with the backend API responses
 */

// ─── User Types ───
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'restaurant' | 'admin';
  token?: string;
}

export interface Customer extends User {
  role: 'customer';
}

export interface RestaurantUser extends User {
  role: 'restaurant';
  description?: string;
  location?: string;
  is_open?: boolean;
  can_deliver?: boolean;
  can_reserve?: boolean;
  delivery_fees?: number;
}

// ─── Restaurant Types ───
export interface Restaurant {
  id: number;
  name: string;
  restaurant_name?: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  can_deliver: boolean;
  can_reserve: boolean;
  is_open: boolean;
  delivery_fees?: number;
  open_time?: string;
  close_time?: string;
  image?: string;
  phone?: string;
}

// ─── Dish Types ───
export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  is_available: boolean;
  preparation_time: number;
  restaurant_id?: number;
  isPopular?: boolean;
}

// ─── Cart Types ───
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

export interface CartRestaurantGroup {
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  dishes: CartDishItem[];
  totalPrice: number;
  totalItems: number;
  deliveryFee?: number;
}

export interface CartDishItem {
  dishId: number;
  dishName: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// ─── Order Types ───
export type OrderStatus = 'pending' | 'paid' | 'cooking' | 'delivering' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  total_amount: number;
  delivery_fee: number;
  status: OrderStatus;
  is_reservation: boolean;
  location: string;
  lat?: number;
  lng?: number;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  customer_id?: number;
  restaurant_id?: number;
  restaurant_name?: string;
  reservation_date?: string;
  payment_status?: 'pending' | 'approved' | 'rejected';
  items: OrderItem[];
}

export interface OrderItem {
  dish_id: number;
  dish_name: string;
  quantity: number;
  price: number;
  image?: string;
}

// ─── Chat Types ───
export interface ChatRoom {
  id: number;
  order_id: number;
  created_at: string;
  restaurant_name?: string;
  customer_name?: string;
  customer_id?: number;
  restaurant_id?: number;
  order_status?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: 'customer' | 'restaurant';
  message: string;
  created_at: string;
  is_read?: boolean;
}

// ─── Payment Types ───
export type PaymentMethod = 'vodafone_cash' | 'instapay' | 'cash';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: PaymentMethod;
  proof_image?: string;
  created_at: string;
}

// ─── Dashboard Types ───
export interface DashboardStats {
  dishes: {
    total: number;
    available: number;
  };
  orders: {
    today: number;
    pending: number;
    total: number;
  };
  revenue: {
    today: number;
    total: number;
  };
}

export interface TopDish {
  id: number;
  name: string;
  price: number;
  image?: string;
  soldCount?: number;
  revenue?: number;
}

// ─── API Response Types ───
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ─── Location Types ───
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// ─── Form Types ───
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'restaurant';
}

export interface RestaurantSignupData extends SignupData {
  role: 'restaurant';
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

// ─── Component Props Types ───
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  hasMore: boolean;
}
