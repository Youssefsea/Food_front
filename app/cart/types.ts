export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number;
}

export type PaymentMethod = 'vodafone_cash' | 'instapay' | 'cash' | 'bank_transfer' | null;

export interface CartDish {
  dishId: number;
  dishName: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  totalRestaurants: number;
  totalItems: number;
  subtotal: number;
  totalDeliveryFees: number;
  grandTotal: number;
}

export interface RestaurantCart {
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantLogo: string;
  restaurantLat: number | null;
  restaurantLng: number | null;
  is_open: number; // Assuming 1 for open, 0 for closed
  can_reserve: boolean;
  can_delivery: boolean;
  delivery_fees: number;
  calculatedDeliveryFee: number;
  distanceKm: number;
  dishes: {
    dishId: number;
    dishName: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  totalPrice: number;
  totalItems: number;
  orderType: 'instant' | 'reservation';
  reservationDate: string;
  reservationTime: string;
  isSelected: boolean;
}