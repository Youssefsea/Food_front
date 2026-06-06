export type OrderStatus = 'pending' | 'cooking' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number;
  dish_id: number;
  dish_name: string;
  dish_image: string;
  quantity: number;
  price: number;
}

export interface Order {
  payment_status?: 'pending' | 'confirmed' | 'rejected';
  id: number;
  total_amount: number;
  delivery_fee: number;
  status: OrderStatus;
  is_reservation: boolean;
  reservation_date: string | null;
  location: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  chat_room_id:number;
  items: OrderItem[];
}

export interface OrdersStats {
  all: number;
  pending: number;
  cooking: number;
  delivering: number;
  completed: number;
  cancelled: number;
}

export const statusConfig: Record<OrderStatus, { label: string; icon: string; bg: string; color: string }> = {
  pending: { label: 'قيد الانتظار', icon: '⏳', bg: '#FEF3C7', color: '#F59E0B' },
  cooking: { label: 'جاري التحضير', icon: '🍳', bg: '#EDE9FE', color: '#8B5CF6' },
  delivering: { label: 'جاري التوصيل', icon: '🚗', bg: '#CFFAFE', color: '#06B6D4' },
  completed: { label: 'مكتمل', icon: '✅', bg: '#D1FAE5', color: '#10B981' },
  cancelled: { label: 'ملغي', icon: '❌', bg: '#FEE2E2', color: '#EF4444' },
};
