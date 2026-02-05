// Types for Restaurant Page

export interface Restaurant {
  id: number;
  user_id: number;
  restaurant_name: string;
  description: string;
  location: string;
  delivery_fees: number;
  can_deliver: number;  // 0 or 1
  can_reserve: number;  // 0 or 1
  is_open?: number;     // 0 or 1
  phone?: string;
  open_time?: string;
  close_time?: string;
  logo?: string;
  cover_image?: string;
  rating?: number;
  review_count?: number;
  latitude?: number;
  longitude?: number;
}

export interface Dish {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  category: string;
  image: string; // comma-separated URLs
  is_available: number;
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
  calories?: number;
}

export interface CartItem {
  dish_id: number;
  quantity: number;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  restaurant_id: number;
}
