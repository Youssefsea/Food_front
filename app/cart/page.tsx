'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import api from '../../axios';
import {
  CartHeader,
  NoticeBanner,
  RestaurantCartGroup,
  DeliveryLocation,
  PaymentMethod,
  OrderSummary,
  CheckoutButton,
  EmptyCart,
  LocationPickerModal,
  RestaurantSelector
} from './components';
import { RestaurantCart, LocationData, PaymentMethod as PaymentMethodType, CartSummary } from './types';

// API Response Types
interface CartItemResponse {
  dishId: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantCanDeliver: boolean;
  restaurantCanReserve: boolean;
  deliveryFee: number; // This is delivery_fees per KM from backend
}

interface OrderResponse {
  orderId: number;
  restaurantId: number | string;
  totalAmount: number;
  deliveryFee: number;
}

interface GroupedRestaurantResponse {
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantLat: number | null;
  restaurantLng: number | null;
  restaurantCanReserve: boolean;
  restaurantCanDeliver: boolean;
  deliveryFee: number;
  dishes: {
    dishId: number;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  totalPrice: number;
  totalItems: number;
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export default function CartPage() {
  const router = useRouter();

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [groupedCarts, setGroupedCarts] = useState<RestaurantCart[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<LocationData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(null);
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  
  // Order success state
  const [orderSuccess, setOrderSuccess] = useState<{
    show: boolean;
    orderId: number | null;
    countdown: number;
  }>({ show: false, orderId: null, countdown: 5 });

  // Fetch cart data from API
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/customer/view-cart');
      const data = res.data;
      
      // Check if using groupedByRestaurant from backend
      const restaurants = data.groupedByRestaurant || [];
      
      if (restaurants.length === 0 && (!data.cartItems || data.cartItems.length === 0)) {
        setGroupedCarts([]);
        setIsLoading(false);
        return;
      }

      // If backend returns groupedByRestaurant, use it directly
      if (restaurants.length > 0) {
        const mapped: RestaurantCart[] = restaurants.map((r: GroupedRestaurantResponse) => ({
          restaurantId: r.restaurantId,
          restaurantName: r.restaurantName,
          restaurantLocation: r.restaurantLocation,
          restaurantLogo: '',
          restaurantLat: r.restaurantLat || null,
          restaurantLng: r.restaurantLng || null,
          is_open: 1, // Assume open by default
          can_reserve: r.restaurantCanReserve || false,
          can_delivery: r.restaurantCanDeliver || false,
          delivery_fees: r.deliveryFee || 0, // Per KM rate
          calculatedDeliveryFee: 0,
          distanceKm: 0,
          dishes: r.dishes.map((d) => ({
            dishId: d.dishId,
            dishName: d.name,
            description: d.description || '',
            image: d.image || '',
            price: d.price,
            quantity: d.quantity,
            subtotal: d.subtotal || d.price * d.quantity
          })),
          totalPrice: r.totalPrice,
          totalItems: r.totalItems,
          orderType: 'instant' as const,
          reservationDate: '',
          reservationTime: '',
          isSelected: false
        }));
        
        setGroupedCarts(mapped);
        
        // Auto-select if only one restaurant
        if (mapped.length === 1) {
          setSelectedRestaurantId(mapped[0].restaurantId);
        }
      } else {
        // Fallback: group cartItems manually
        const cartItems: CartItemResponse[] = data.cartItems || [];
        
        const grouped = cartItems.reduce((acc, item) => {
          const restaurantId = item.restaurantId;
          
          if (!acc[restaurantId]) {
            acc[restaurantId] = {
              restaurantId,
              restaurantName: item.restaurantName,
              restaurantLocation: item.restaurantLocation,
              restaurantLogo: '',
              restaurantLat: null,
              restaurantLng: null,
              is_open: 1,
              can_reserve: item.restaurantCanReserve || false,
              can_delivery: item.restaurantCanDeliver || false,
              delivery_fees: item.deliveryFee || 0,
              calculatedDeliveryFee: 0,
              distanceKm: 0,
              dishes: [],
              totalPrice: 0,
              totalItems: 0,
              orderType: 'instant' as const,
              reservationDate: '',
              reservationTime: '',
              isSelected: false
            };
          }

          acc[restaurantId].dishes.push({
            dishId: item.dishId,
            dishName: item.name,
            description: item.description,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          });

          acc[restaurantId].totalPrice += item.price * item.quantity;
          acc[restaurantId].totalItems += item.quantity;

          return acc;
        }, {} as Record<number, RestaurantCart>);

        const cartsList = Object.values(grouped);
        setGroupedCarts(cartsList);
        
        // Auto-select if only one restaurant
        if (cartsList.length === 1) {
          setSelectedRestaurantId(cartsList[0].restaurantId);
        }
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      toast.error('حدث خطأ في تحميل السلة');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Countdown effect for order success
  useEffect(() => {
    if (!orderSuccess.show) return;
    
    if (orderSuccess.countdown <= 0) {
      router.push('/explore');
      return;
    }

    const timer = setTimeout(() => {
      setOrderSuccess(prev => ({ ...prev, countdown: prev.countdown - 1 }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderSuccess.show, orderSuccess.countdown, router]);

  // Recalculate delivery fees when location changes
  useEffect(() => {
    if (!deliveryLocation) return;

    setGroupedCarts(prev => prev.map(restaurant => {
      let distanceKm = 0;
      let calculatedFee = 0;
      
      // Calculate actual distance if restaurant coordinates are available
      if (restaurant.restaurantLat && restaurant.restaurantLng) {
        distanceKm = calculateDistance(
          deliveryLocation.lat,
          deliveryLocation.lng,
          restaurant.restaurantLat,
          restaurant.restaurantLng
        );
        // Round to 2 decimal places
        distanceKm = Math.round(distanceKm * 100) / 100;
        // Calculate fee based on distance and per-km rate
        calculatedFee = Math.round(restaurant.delivery_fees * distanceKm);
      } else {
        // If no coordinates, use a default estimate (5km)
        distanceKm = 5;
        calculatedFee = restaurant.delivery_fees * distanceKm;
      }
      
      return {
        ...restaurant,
        distanceKm,
        calculatedDeliveryFee: calculatedFee
      };
    }));
  }, [deliveryLocation]);

  // Get selected restaurant
  const selectedRestaurant = useMemo(() => {
    return groupedCarts.find(r => r.restaurantId === selectedRestaurantId) || null;
  }, [groupedCarts, selectedRestaurantId]);

  // Calculate summary for selected restaurant only
  const summary: CartSummary = useMemo(() => {
    if (selectedRestaurant) {
      return {
        totalRestaurants: 1,
        totalItems: selectedRestaurant.totalItems,
        subtotal: selectedRestaurant.totalPrice,
        totalDeliveryFees: selectedRestaurant.calculatedDeliveryFee || 0,
        grandTotal: selectedRestaurant.totalPrice + (selectedRestaurant.calculatedDeliveryFee || 0)
      };
    }

    // If no selection, show total for all
    const totalRestaurants = groupedCarts.length;
    const totalItems = groupedCarts.reduce((sum, r) => sum + r.totalItems, 0);
    const subtotal = groupedCarts.reduce((sum, r) => sum + r.totalPrice, 0);
    const totalDeliveryFees = groupedCarts.reduce((sum, r) => sum + (r.calculatedDeliveryFee || 0), 0);
    const grandTotal = subtotal + totalDeliveryFees;

    return { totalRestaurants, totalItems, subtotal, totalDeliveryFees, grandTotal };
  }, [groupedCarts, selectedRestaurant]);

  // Handle quantity change
  const handleQuantityChange = async (restaurantId: number, dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await api.put('/customer/update-dish-quantity-in-cart', {
        dishId,
        quantity: newQuantity
      });

      // Update local state
      setGroupedCarts(prev => prev.map(restaurant => {
        if (restaurant.restaurantId !== restaurantId) return restaurant;

        const updatedDishes = restaurant.dishes.map(dish => {
          if (dish.dishId !== dishId) return dish;
          return {
            ...dish,
            quantity: newQuantity,
            subtotal: dish.price * newQuantity
          };
        });

        const totalPrice = updatedDishes.reduce((sum, d) => sum + d.subtotal, 0);
        const totalItems = updatedDishes.reduce((sum, d) => sum + d.quantity, 0);

        return { ...restaurant, dishes: updatedDishes, totalPrice, totalItems };
      }));

      toast.success('تم تحديث الكمية');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('حدث خطأ في تحديث الكمية');
    }
  };

  // Handle remove dish
  const handleRemoveDish = async (restaurantId: number, dishId: number) => {
    try {
      await api.delete('/customer/remove-dish-from-cart', {
        data: { dishId }
      });

      // Update local state
      setGroupedCarts(prev => {
        const updated = prev.map(restaurant => {
          if (restaurant.restaurantId !== restaurantId) return restaurant;

          const updatedDishes = restaurant.dishes.filter(d => d.dishId !== dishId);
          const totalPrice = updatedDishes.reduce((sum, d) => sum + d.subtotal, 0);
          const totalItems = updatedDishes.reduce((sum, d) => sum + d.quantity, 0);

          return { ...restaurant, dishes: updatedDishes, totalPrice, totalItems };
        });

        // Remove restaurants with no dishes
        const filtered = updated.filter(r => r.dishes.length > 0);
        
        // Reset selection if selected restaurant was removed
        if (selectedRestaurantId && !filtered.find(r => r.restaurantId === selectedRestaurantId)) {
          setSelectedRestaurantId(filtered.length === 1 ? filtered[0].restaurantId : null);
        }
        
        return filtered;
      });

      toast.success('تم حذف الطبق من السلة');
    } catch (err) {
      console.error('Error removing dish:', err);
      toast.error('حدث خطأ في حذف الطبق');
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (!confirm('هل أنت متأكد من إفراغ السلة بالكامل؟')) return;

    try {
      // Remove all dishes one by one (or use bulk API if available)
      for (const restaurant of groupedCarts) {
        for (const dish of restaurant.dishes) {
          await api.delete('/customer/remove-dish-from-cart', {
            data: { dishId: dish.dishId }
          });
        }
      }

      setGroupedCarts([]);
      setSelectedRestaurantId(null);
      toast.success('تم إفراغ السلة');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('حدث خطأ في إفراغ السلة');
    }
  };

  // Handle order type change per restaurant
  const handleOrderTypeChange = (restaurantId: number, orderType: 'instant' | 'reservation') => {
    setGroupedCarts(prev => prev.map(r => 
      r.restaurantId === restaurantId 
        ? { ...r, orderType, reservationDate: '', reservationTime: '' }
        : r
    ));
  };

  const handleReservationDateChange = (restaurantId: number, date: string) => {
    setGroupedCarts(prev => prev.map(r => 
      r.restaurantId === restaurantId ? { ...r, reservationDate: date } : r
    ));
  };

  const handleReservationTimeChange = (restaurantId: number, time: string) => {
    setGroupedCarts(prev => prev.map(r => 
      r.restaurantId === restaurantId ? { ...r, reservationTime: time } : r
    ));
  };

  // Handle restaurant selection
  const handleSelectRestaurant = (restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    // Reset payment when changing restaurant
    setPaymentImage(null);
  };

  // Validation
  const getCheckoutDisabledReason = (): string => {
    if (groupedCarts.length === 0) return 'السلة فارغة';
    if (!deliveryLocation) return 'حدد عنوان التوصيل';
    
    // Must select a restaurant when multiple exist
    if (groupedCarts.length > 1 && !selectedRestaurantId) {
      return 'اختر مطعم للطلب';
    }
    
    if (!paymentMethod) return 'اختر طريقة الدفع';
    if (!paymentImage) return 'ارفع صورة إثبات الدفع';
    
    // Check reservation requirements for selected restaurant
    const restaurant = selectedRestaurant || groupedCarts[0];
    if (restaurant) {
      if (restaurant.orderType === 'reservation') {
        if (!restaurant.reservationDate || !restaurant.reservationTime) {
          return `حدد موعد الحجز لـ ${restaurant.restaurantName}`;
        }
      }
      
      if (restaurant.is_open === 0) {
        return 'المطعم المختار مغلق';
      }
    }

    return '';
  };

  const isCheckoutDisabled = getCheckoutDisabledReason() !== '';

  // Handle checkout
  const handleCheckout = async () => {
    const disabledReason = getCheckoutDisabledReason();
    if (disabledReason) {
      toast.error(disabledReason);
      return;
    }

    if (!selectedRestaurant && groupedCarts.length > 1) {
      toast.error('يرجى اختيار مطعم واحد للطلب');
      return;
    }

    const restaurantToOrder = selectedRestaurant || groupedCarts[0];
    setIsSubmitting(true);

    try {
      // Step 1: Create the order
      const orderData = {
        is_reservation: restaurantToOrder.orderType === 'reservation',
        reservation_date: restaurantToOrder.orderType === 'reservation' 
          ? `${restaurantToOrder.reservationDate} ${restaurantToOrder.reservationTime}`
          : null,
        lat: deliveryLocation!.lat,
        lng: deliveryLocation!.lng,
        // إرسال ID المطعم المختار للباك اند
        restaurantId: restaurantToOrder.restaurantId
      };

      const orderResponse = await api.post('/customer/place-order', orderData);
      
      // Check for created orders
      const createdOrders = orderResponse.data.createdOrders || [];
      const failedOrders = orderResponse.data.failedOrders || [];
      
      if (createdOrders.length === 0) {
        const failureReason = failedOrders[0]?.reason || 'فشل في إنشاء الطلب';
        toast.error(failureReason);
        setIsSubmitting(false);
        return;
      }

      // Find the order for our selected restaurant
      const ourOrder = createdOrders.find((o: OrderResponse) => 
        o.restaurantId === restaurantToOrder.restaurantId || 
        o.restaurantId === String(restaurantToOrder.restaurantId)
      ) || createdOrders[0];

      // Step 2: Upload payment proof
      const formData = new FormData();
      formData.append('orderId', ourOrder.orderId.toString());
      formData.append('payment_method', paymentMethod!);
      formData.append('images', paymentImage!);

      const paymentResponse = await api.post('/customer/upload-payment-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (paymentResponse.data.success) {
        // Remove ordered items from local cart
        setGroupedCarts(prev => prev.filter(r => r.restaurantId !== restaurantToOrder.restaurantId));
        setSelectedRestaurantId(null);
        setPaymentImage(null);
        setPaymentMethod(null);
        
        // Show success modal with countdown
        setOrderSuccess({
          show: true,
          orderId: ourOrder.orderId,
          countdown: 5
        });
      } else {
        toast.error(paymentResponse.data.message || 'فشل في رفع إثبات الدفع');
      }

    } catch (err) {
      console.error('Error creating order:', err);
      const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
      const errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || 'حدث خطأ في إنشاء الطلب';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E5A04D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">جاري تحميل السلة...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (groupedCarts.length === 0) {
    return <EmptyCart />;
  }

  // Get display restaurants (only selected or all if single)
  const displayRestaurants = selectedRestaurant ? [selectedRestaurant] : groupedCarts;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-32" dir="rtl">
      <Toaster position="top-center" richColors />
      <div className="h-4"/>
      
      {/* Header */}
      <CartHeader 
        itemCount={summary.totalItems}
        onClearCart={handleClearCart}
        hasItems={groupedCarts.length > 0}
      />
      <div className="h-4"/>

      {/* Notice Banner - Multiple Restaurants */}
      {groupedCarts.length > 1 && <NoticeBanner />}

      {/* Restaurant Selector - Only show when multiple restaurants */}
      <RestaurantSelector
        restaurants={groupedCarts}
        selectedRestaurantId={selectedRestaurantId}
        onSelectRestaurant={handleSelectRestaurant}
        hasLocation={!!deliveryLocation}
      />

      {/* Restaurant Cart Groups - Show only selected or all if single */}
      <div className="px-5 pt-5">
        {displayRestaurants.map((restaurant) => (
          <RestaurantCartGroup
            key={restaurant.restaurantId}
            restaurant={restaurant}
            orderNumber={groupedCarts.length > 1 ? groupedCarts.findIndex(r => r.restaurantId === restaurant.restaurantId) + 1 : 1}
            onQuantityChange={handleQuantityChange}
            onRemoveDish={handleRemoveDish}
            onOrderTypeChange={handleOrderTypeChange}
            onReservationDateChange={handleReservationDateChange}
            onReservationTimeChange={handleReservationTimeChange}
          />
        ))}
      </div>

      {/* Delivery Location */}
      <DeliveryLocation
        location={deliveryLocation}
        onOpenLocationPicker={() => setIsLocationModalOpen(true)}
      />

      {/* Payment Method - Only show when restaurant is selected (or single restaurant) */}
      {(selectedRestaurantId || groupedCarts.length === 1) && (
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          grandTotal={summary.grandTotal}
          paymentImage={paymentImage}
          onImageSelect={setPaymentImage}
          isDisabled={isSubmitting}
        />
      )}

      {/* Order Summary */}
      <OrderSummary
        summary={summary}
        restaurants={selectedRestaurant ? [selectedRestaurant] : groupedCarts}
      />

      {/* Checkout Button */}
      <CheckoutButton
        totalItems={summary.totalItems}
        totalRestaurants={groupedCarts.length > 1 && selectedRestaurantId ? 1 : summary.totalRestaurants}
        grandTotal={summary.grandTotal}
        isDisabled={isCheckoutDisabled}
        disabledReason={getCheckoutDisabledReason()}
        isSubmitting={isSubmitting}
        onCheckout={handleCheckout}
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={setDeliveryLocation}
        initialLocation={deliveryLocation}
      />

      {/* Order Success Modal */}
      {orderSuccess.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] p-8 mx-5 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Title */}
            <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-2">
              تم الطلب بنجاح! 🎉
            </h2>
            
            {/* Order ID */}
            <p className="text-[16px] text-[#6B7280] mb-4">
              رقم الطلب: <span className="font-bold text-[#E5A04D]">#{orderSuccess.orderId}</span>
            </p>
            
            {/* Message */}
            <p className="text-[14px] text-[#9CA3AF] mb-6">
              شكراً لك! سيتم التواصل معك قريباً لتأكيد الطلب
            </p>
            
            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 text-[14px] text-[#6B7280]">
              <div className="w-8 h-8 rounded-full bg-[#E5A04D]/10 flex items-center justify-center">
                <span className="text-[#E5A04D] font-bold">{orderSuccess.countdown}</span>
              </div>
              <span>جاري التحويل إلى الصفحة الرئيسية...</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#E5A04D] to-[#F8B358] transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - orderSuccess.countdown) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          font-family: 'Cairo', sans-serif;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
