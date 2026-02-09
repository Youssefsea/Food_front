export interface Restaurant {
  id: number;
  user_id: number;
  restaurant_name: string;
  description: string;
  location: string;
  delivery_fees: number;
  can_deliver: number;
  can_reserve: number;
  is_open?: number;
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
  image: string;
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
