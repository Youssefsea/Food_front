// ─── App Branding ───
export const APP_NAME = 'أكلي';
export const APP_NAME_EN = 'Akly';
export const APP_TAGLINE = 'اطلب أكلك المفضل';
export const APP_DESCRIPTION = 'منصة توصيل طعام — اطلب من أفضل المطاعم حواليك';

// ─── Order Status ───
export const ORDER_STATUS = {
  pending: { label: 'في الانتظار', color: 'amber', icon: '⏳' },
  paid: { label: 'تم الدفع', color: 'blue', icon: '💳' },
  cooking: { label: 'جاري التحضير', color: 'orange', icon: '👨‍🍳' },
  delivering: { label: 'جاري التوصيل', color: 'indigo', icon: '🚗' },
  completed: { label: 'مكتمل', color: 'green', icon: '✅' },
  cancelled: { label: 'ملغي', color: 'red', icon: '❌' },
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;

// ─── Payment Status ───
export const PAYMENT_STATUS = {
  pending: { label: 'في الانتظار', color: 'amber' },
  approved: { label: 'مقبول', color: 'green' },
  rejected: { label: 'مرفوض', color: 'red' },
} as const;

// ─── Payment Methods ───
export const PAYMENT_METHODS = {
  vodafone_cash: { label: 'فودافون كاش', icon: '📱' },
  instapay: { label: 'إنستاباي', icon: '🏦' },
} as const;

// ─── User Roles ───
export const USER_ROLES = {
  customer: { label: 'زبون', icon: '👤' },
  vendor: { label: 'مطعم', icon: '🏪' },
  restaurant: { label: 'مطعم', icon: '🏪' }, // Alias for vendor
  admin: { label: 'مدير', icon: '🛡️' },
} as const;

// ─── Breakpoints ───
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ─── Navigation ───
export const CUSTOMER_NAV_ITEMS = [
  { href: '/customer/home', label: 'الرئيسية', icon: 'home' },
  { href: '/customer/home', label: 'استكشف', icon: 'search' },
  { href: '/customer/cart', label: 'السلة', icon: 'cart' },
  { href: '/customer/orders', label: 'طلباتي', icon: 'orders' },
  { href: '/profile', label: 'حسابي', icon: 'profile' },
] as const;

export const VENDOR_NAV_ITEMS = [
  { href: '/restaurant/dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
  { href: '/restaurant/menu', label: 'الأطباق', icon: 'dishes' },
  { href: '/restaurant/orders', label: 'الطلبات', icon: 'orders' },
  { href: '/vendor/EditAtVendorInfo', label: 'الإعدادات', icon: 'settings' },
] as const;

// ─── API Endpoints ───
export const ENDPOINTS = {
  // Auth
  CUSTOMER_SIGNUP: '/customer/signup',
  CUSTOMER_LOGIN: '/customer/login',
  RESTAURANT_SIGNUP: '/restaurant/signup',
  RESTAURANT_LOGIN: '/restaurant/login',
  
  // Customer
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
  
  // Restaurant
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
  
  // Admin
  CONFIRM_PAYMENT: '/admin/confirmPayment',
} as const;
