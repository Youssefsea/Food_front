// Order status types matching backend
export type OrderStatus = 'pending' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
export type OrderType = 'delivery' | 'reservation';

export interface OrderItem {
  id: number;
  dish_id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

// Raw order row from backend API (each dish is a separate row)
export interface OrderRowFromAPI {
  id: number;
  restaurant_id: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  is_reservation: boolean;
  reservation_date: string | null;
  dish_id: number;
  dish_name: string;
  dish_image: string;
  dish_price: number;
  restaurant_name: string;
  payment_status?: 'pending' | 'confirmed' | 'rejected';
}

export interface Order {
  id: number;
  order_number?: string;
  restaurant_id: number;
  restaurant_name?: string;
  order_date: string;
  items?: OrderItem[];
  total_amount: number;
  delivery_fee?: number;
  status: OrderStatus;
  is_reservation?: boolean;
  reservation_date?: string;
  reservation_time?: string;
  location?: string;
  lat?: number;
  lng?: number;
  payment_status?: 'pending' | 'confirmed' | 'rejected';
  has_unread_messages?: boolean;
  chat_room_id?: number;
 
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface WalletBalance {
  balance: number;
}

export interface ChatRoom {
  id: number;
  order_id: number;
  restaurant_name: string;
  order_status: OrderStatus;
  last_message?: string;
  last_message_time?: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: 'customer' | 'restaurant';
  message: string;
  created_at: string;
}
