export const APP_NAME = 'أكلي';

export const ENDPOINTS = {
  CUSTOMER_SIGNUP: '/customer/signup',
  CUSTOMER_LOGIN: '/customer/login',
  RESTAURANT_SIGNUP: '/restaurant/signup',
  RESTAURANT_LOGIN: '/restaurant/login',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_UPDATE_PROFILE: '/customer/change-info',
  NEAREST_RESTAURANTS: '/customer/nearest-restaurants',
  ALL_RESTAURANTS: '/restaurant/all',
  RESTAURANT_DISHES: '/restaurant/all-dishes-for-restaurantE',
  ADD_TO_CART: '/customer/add-dish-to-cart',
  VIEW_CART: '/customer/view-cart',
  REMOVE_FROM_CART: '/customer/remove-dish-from-cart',
  PLACE_ORDER: '/customer/place-order',
  UPLOAD_PAYMENT: '/customer/upload-payment-proof',
  PAYMENT_STATUS: '/customer/payment-status',
  RESTAURANT_PROFILE: '/restaurant/profile',
  RESTAURANT_UPDATE_INFO: '/restaurant/change-info',
  RESTAURANT_TOGGLE_OPEN: '/restaurant/is-open',
  ADD_DISH: '/restaurant/add-dish',
  UPDATE_DISH: '/restaurant/change-dish',
  TOGGLE_DISH_AVAILABILITY: '/restaurant/change-dish-availability',
  DELETE_DISH: '/restaurant/delete-dish',
  RESTAURANT_DASHBOARD: '/restaurant/dashboard',
  RESTAURANT_ORDERS: '/restaurant/orders',
  UPDATE_ORDER_STATUS: '/restaurant/order-status',
  CONFIRM_PAYMENT: '/admin/confirmPayment'
} as const;

export const CUSTOMER_NAV_ITEMS = [
  { href: '/customer/home', label: 'الرئيسية' },
  { href: '/explore', label: 'استكشف' },
  { href: '/customer/cart', label: 'السلة' },
  { href: '/customer/orders', label: 'طلباتي' },
  { href: '/profile', label: 'حسابي' }
] as const;

export const VENDOR_NAV_ITEMS = [
  { href: '/vendor/dashboard', label: 'لوحة التحكم' },
  { href: '/vendor/dishes', label: 'الأطباق' },
  { href: '/vendor/orders', label: 'الطلبات' },
  { href: '/vendor/profile', label: 'الإعدادات' }
] as const;
