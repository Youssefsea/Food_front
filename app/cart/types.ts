export interface CartDish {
  dishId: number;
  dishName: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface RestaurantCart {
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantLogo: string;
  restaurantLat: number | null;
  restaurantLng: number | null;
  is_open: number;
  can_reserve: boolean;
  can_delivery: boolean;
  delivery_fees: number;
  calculatedDeliveryFee: number;
  distanceKm: number;
  dishes: CartDish[];
  totalPrice: number;
  totalItems: number;
  orderType: 'instant' | 'reservation';
  reservationDate: string;
  reservationTime: string;
  isSelected: boolean;
}

export interface CartSummary {
  totalRestaurants: number;
  totalItems: number;
  subtotal: number;
  totalDeliveryFees: number;
  grandTotal: number;
}

export interface SelectedRestaurantSummary {
  restaurantId: number;
  restaurantName: string;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  totalItems: number;
}

export interface CartData {
  groupedByRestaurant: RestaurantCart[];
  summary: CartSummary;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  accuracy?: number; // GPS accuracy in meters
}

export type PaymentMethod = 'vodafone_cash' | 'instapay' | null;

export interface CreatedOrder {
  orderId: number;
  restaurantId: number;
  restaurantName: string;
  status: string;
  totalAmount: number;
  deliveryFee: number;
}

export interface PaymentProofData {
  orderId: number;
  paymentMethod: PaymentMethod;
  imageFile: File | null;
}
