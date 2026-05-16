// Order status types matching backend
export type OrderStatus = 'pending' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
export type OrderType = 'delivery' | 'reservation';

export interface OrderItem {

  dish_id: number;
  dish_name: string;
  quantity: number;
  dish_price: number;
  dish_image?: string;
}

export interface OrderRowFromAPI {
  id: number;
  restaurant_id: number;
  restaurant_name: string;
  created_at: string;
  total_amount: string;
  status: string;
  is_reservation: boolean;
  reservation_date?: string | null;
  payment_status: string;
  items: {
    dish_id: number;
    dish_name: string;
    dish_price: string;
    dish_image: string;
    quantity?: number;
  }[];
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
  status: string;
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
