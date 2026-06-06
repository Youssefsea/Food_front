'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import api, { isTimeoutError } from '@/lib/api';
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
  RestaurantSelector,
} from './components';
import { RestaurantCart, LocationData, PaymentMethod as PaymentMethodType, CartSummary } from './types';
import { useCart } from '../context/CartContext';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui';
import { calculateDistance } from '@/lib/utils';

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
  deliveryFee: number;
  allowed_radius_km?: number;
  restaurantIsOpen?: number | boolean;
  is_open?: number | boolean;
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
  allowed_radius_km?: number;
  restaurantIsOpen?: number | boolean;
  is_open?: number | boolean;
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

const normalizeIsOpen = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return 1;
};

export default function CartPage() {
  const router = useRouter();
  const { incrementCount, decrementCount, setCount } = useCart();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [groupedCarts, setGroupedCarts] = useState<RestaurantCart[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<LocationData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(null);
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);

  const [orderSuccess, setOrderSuccess] = useState<{
    show: boolean;
    orderId: number | null;
    countdown: number;
    isReservation: boolean;
  }>({ show: false, orderId: null, countdown: 5, isReservation: false });

  const fetchCart = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const res = await api.get('/customer/view-cart', { signal });
      const data = res.data;

      const restaurants = data.groupedByRestaurant || [];

      if (restaurants.length === 0 && (!data.cartItems || data.cartItems.length === 0)) {
        setGroupedCarts([]);
        setIsLoading(false);
        return;
      }

      if (restaurants.length > 0) {
        const mapped: RestaurantCart[] = restaurants.map((r: GroupedRestaurantResponse) => ({
          restaurantId: r.restaurantId,
          restaurantName: r.restaurantName,
          restaurantLocation: r.restaurantLocation,
          restaurantLogo: '',
          restaurantLat: r.restaurantLat ?? null,
          restaurantLng: r.restaurantLng ?? null,
          is_open: normalizeIsOpen(r.is_open ?? r.restaurantIsOpen),
          can_reserve: r.restaurantCanReserve || false,
          can_delivery: r.restaurantCanDeliver || false,
          delivery_fees: r.deliveryFee || 0,
          allowed_radius_km: r.allowed_radius_km,
          calculatedDeliveryFee: 0,
          distanceKm: 0,
          dishes: r.dishes.map((d) => ({
            dishId: d.dishId,
            dishName: d.name,
            description: d.description || '',
            image: d.image || '',
            price: d.price,
            quantity: d.quantity,
            subtotal: d.subtotal || d.price * d.quantity,
          })),
          totalPrice: r.totalPrice,
          totalItems: r.totalItems,
          orderType: 'instant' as const,
          reservationDate: '',
          reservationTime: '',
          isSelected: false,
        }));

        setGroupedCarts(mapped);
        if (mapped.length === 1) setSelectedRestaurantId(mapped[0].restaurantId);
      } else {
        const cartItems: CartItemResponse[] = data.cartItems || [];

        const grouped = cartItems.reduce((acc, item) => {
          const { restaurantId } = item;

          if (!acc[restaurantId]) {
            acc[restaurantId] = {
              restaurantId,
              restaurantName: item.restaurantName,
              restaurantLocation: item.restaurantLocation,
              restaurantLogo: '',
              restaurantLat: null,
              restaurantLng: null,
              is_open: normalizeIsOpen(item.is_open ?? item.restaurantIsOpen),
              can_reserve: item.restaurantCanReserve || false,
              can_delivery: item.restaurantCanDeliver || false,
              delivery_fees: item.deliveryFee || 0,
              allowed_radius_km: item.allowed_radius_km,
              calculatedDeliveryFee: 0,
              distanceKm: 0,
              dishes: [],
              totalPrice: 0,
              totalItems: 0,
              orderType: 'instant' as const,
              reservationDate: '',
              reservationTime: '',
              isSelected: false,
            };
          }

          acc[restaurantId].dishes.push({
            dishId: item.dishId,
            dishName: item.name,
            description: item.description,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          });

          acc[restaurantId].totalPrice += item.price * item.quantity;
          acc[restaurantId].totalItems += item.quantity;

          return acc;
        }, {} as Record<number, RestaurantCart>);

        const cartsList = Object.values(grouped);
        setGroupedCarts(cartsList);
        if (cartsList.length === 1) setSelectedRestaurantId(cartsList[0].restaurantId);
      }
    } catch (err) {
      const message = isTimeoutError(err)
        ? 'انتهت المهلة أثناء تحميل السلة. حاول مرة أخرى.'
        : 'حدث خطأ في تحميل السلة';
      setLoadError(message);
      toast.error('حدث خطأ في تحميل السلة');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const controller = new AbortController();
    fetchCart(controller.signal);
    return () => controller.abort();
  }, [fetchCart, mounted]);

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

  useEffect(() => {
    if (!deliveryLocation) return;

    setGroupedCarts(prev => prev.map(restaurant => {
      let distanceKm = 0;
      let calculatedFee = 0;
      let isOutsideDeliveryRadius = false;

      if (restaurant.restaurantLat && restaurant.restaurantLng) {
        distanceKm = Math.round(
          calculateDistance(
            deliveryLocation.lat,
            deliveryLocation.lng,
            restaurant.restaurantLat,
            restaurant.restaurantLng
          ) * 100
        ) / 100;
        calculatedFee = Math.round(restaurant.delivery_fees * distanceKm);
        if (typeof restaurant.allowed_radius_km === 'number' && restaurant.allowed_radius_km > 0) {
          isOutsideDeliveryRadius = distanceKm > restaurant.allowed_radius_km;
        }
      } else {
        distanceKm = 5;
        calculatedFee = restaurant.delivery_fees * distanceKm;
      }

      return { ...restaurant, distanceKm, calculatedDeliveryFee: calculatedFee, isOutsideDeliveryRadius };
    }));
  }, [deliveryLocation]);

  const selectedRestaurant = useMemo(
    () => groupedCarts.find(r => r.restaurantId === selectedRestaurantId) ?? null,
    [groupedCarts, selectedRestaurantId]
  );

  const cartSummary = useMemo((): CartSummary => {
    if (selectedRestaurant) {
      return {
        totalRestaurants: 1,
        totalItems: selectedRestaurant.totalItems,
        subtotal: selectedRestaurant.totalPrice,
        totalDeliveryFees: selectedRestaurant.calculatedDeliveryFee || 0,
        grandTotal: selectedRestaurant.totalPrice + (selectedRestaurant.calculatedDeliveryFee || 0),
      };
    }

    const subtotal = groupedCarts.reduce((sum, r) => sum + r.totalPrice, 0);
    const totalDeliveryFees = groupedCarts.reduce((sum, r) => sum + (r.calculatedDeliveryFee || 0), 0);

    return {
      totalRestaurants: groupedCarts.length,
      totalItems: groupedCarts.reduce((sum, r) => sum + r.totalItems, 0),
      subtotal,
      totalDeliveryFees,
      grandTotal: subtotal + totalDeliveryFees,
    };
  }, [groupedCarts, selectedRestaurant]);

  const handleQuantityChange = useCallback(async (restaurantId: number, dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const currentDish = groupedCarts
      .find(r => r.restaurantId === restaurantId)
      ?.dishes.find(d => d.dishId === dishId);
    const quantityDiff = newQuantity - (currentDish?.quantity ?? 0);

    try {
      await api.put('/customer/update-dish-quantity-in-cart', { dishId, quantity: newQuantity });

      setGroupedCarts(prev => prev.map(r => {
        if (r.restaurantId !== restaurantId) return r;

        const updatedDishes = r.dishes.map(d =>
          d.dishId !== dishId ? d : { ...d, quantity: newQuantity, subtotal: d.price * newQuantity }
        );

        return {
          ...r,
          dishes: updatedDishes,
          totalPrice: updatedDishes.reduce((sum, d) => sum + d.subtotal, 0),
          totalItems: updatedDishes.reduce((sum, d) => sum + d.quantity, 0),
        };
      }));

      if (quantityDiff > 0) incrementCount(quantityDiff);
      else if (quantityDiff < 0) decrementCount(Math.abs(quantityDiff));

      toast.success('تم تحديث الكمية');
    } catch {
      toast.error('حدث خطأ في تحديث الكمية');
    }
  }, [decrementCount, groupedCarts, incrementCount]);

  const handleRemoveDish = useCallback(async (restaurantId: number, dishId: number) => {
    const removedQuantity = groupedCarts
      .find(r => r.restaurantId === restaurantId)
      ?.dishes.find(d => d.dishId === dishId)?.quantity ?? 0;

    try {
      await api.delete('/customer/remove-dish-from-cart', { data: { dishId } });

      setGroupedCarts(prev => {
        const updated = prev.map(r => {
          if (r.restaurantId !== restaurantId) return r;

          const updatedDishes = r.dishes.filter(d => d.dishId !== dishId);
          return {
            ...r,
            dishes: updatedDishes,
            totalPrice: updatedDishes.reduce((sum, d) => sum + d.subtotal, 0),
            totalItems: updatedDishes.reduce((sum, d) => sum + d.quantity, 0),
          };
        });

        const filtered = updated.filter(r => r.dishes.length > 0);

        if (selectedRestaurantId && !filtered.find(r => r.restaurantId === selectedRestaurantId)) {
          setSelectedRestaurantId(filtered.length === 1 ? filtered[0].restaurantId : null);
        }

        return filtered;
      });

      decrementCount(removedQuantity);
      toast.success('تم حذف الطبق من السلة');
    } catch {
      toast.error('حدث خطأ في حذف الطبق');
    }
  }, [decrementCount, groupedCarts, selectedRestaurantId]);

  const handleClearCart = useCallback(async () => {
    if (!confirm('هل أنت متأكد من إفراغ السلة بالكامل؟')) return;

    try {
      await Promise.all(
        groupedCarts.flatMap(r =>
          r.dishes.map(d =>
            api.delete('/customer/remove-dish-from-cart', { data: { dishId: d.dishId } })
          )
        )
      );

      setGroupedCarts([]);
      setSelectedRestaurantId(null);
      setCount(0);
      toast.success('تم إفراغ السلة');
    } catch {
      toast.error('حدث خطأ في إفراغ السلة');
    }
  }, [groupedCarts, setCount]);

  const handleSelectRestaurant = useCallback((restaurantId: number) => {
    setSelectedRestaurantId(restaurantId);
    setPaymentImage(null);
  }, []);

  const handleOrderTypeChange = useCallback((restaurantId: number, orderType: 'instant' | 'reservation') => {
    setGroupedCarts(prev => prev.map(r =>
      r.restaurantId === restaurantId ? { ...r, orderType } : r
    ));
  }, []);

  const handleReservationDateChange = useCallback((restaurantId: number, date: string) => {
    setGroupedCarts(prev => prev.map(r =>
      r.restaurantId === restaurantId ? { ...r, reservationDate: date } : r
    ));
  }, []);

  const handleReservationTimeChange = useCallback((restaurantId: number, time: string) => {
    setGroupedCarts(prev => prev.map(r =>
      r.restaurantId === restaurantId ? { ...r, reservationTime: time } : r
    ));
  }, []);

  const checkoutDisabledReason = useMemo((): string => {
    if (groupedCarts.length === 0) return 'السلة فارغة';
    if (!deliveryLocation) return 'حدد عنوان التوصيل';
    if (groupedCarts.length > 1 && !selectedRestaurantId) return 'اختر مطعم للطلب';

    const restaurant = selectedRestaurant ?? groupedCarts[0];
    if (!restaurant) return '';

    const isReservation = restaurant.orderType === 'reservation';

    if (restaurant.is_open === 0) return 'هذا المطعم مغلق حالياً ولا يمكن إتمام الطلب';

    if (!isReservation && restaurant.isOutsideDeliveryRadius) {
      const distance = restaurant.distanceKm > 0 ? restaurant.distanceKm.toFixed(1) : '';
      const radius = restaurant.allowed_radius_km ? restaurant.allowed_radius_km.toFixed(1) : '';
      return `المسافة خارج نطاق التوصيل${distance ? ` (${distance} كم${radius ? `، الحد ${radius} كم` : ''})` : ''}`;
    }

    if (isReservation) {
      if (!paymentMethod) return 'اختر طريقة الدفع';
      if (!paymentImage) return 'ارفع صورة إثبات الدفع';
      if (!restaurant.reservationDate || !restaurant.reservationTime) return 'حدد وقت الحجز';
    }

    return '';
  }, [groupedCarts, deliveryLocation, selectedRestaurantId, selectedRestaurant, paymentMethod, paymentImage]);

  const handleCheckout = async () => {
    if (checkoutDisabledReason) {
      toast.error(checkoutDisabledReason);
      return;
    }

    const restaurantToOrder = selectedRestaurant ?? groupedCarts[0];
    if (!restaurantToOrder) return;

    setIsSubmitting(true);

    try {
      const isReservationOrder = restaurantToOrder.orderType === 'reservation';
      const reservationDate = isReservationOrder
        ? `${restaurantToOrder.reservationDate} ${restaurantToOrder.reservationTime}`
        : null;

      const orderResponse = await api.post('/customer/place-order', {
        is_reservation: isReservationOrder,
        lat: deliveryLocation!.lat,
        lng: deliveryLocation!.lng,
        restaurantId: restaurantToOrder.restaurantId,
        ...(reservationDate ? { reservation_date: reservationDate } : {}),
      });

      const createdOrders: OrderResponse[] = orderResponse.data.createdOrders || [];
      const failedOrders = orderResponse.data.failedOrders || [];

      if (createdOrders.length === 0) {
        toast.error(failedOrders[0]?.reason || 'فشل في إنشاء الطلب');
        return;
      }

      const ourOrder = createdOrders.find(o =>
        o.restaurantId === restaurantToOrder.restaurantId ||
        o.restaurantId === String(restaurantToOrder.restaurantId)
      ) ?? createdOrders[0];

      if (isReservationOrder && paymentMethod && paymentImage) {
        const formData = new FormData();
        formData.append('orderId', ourOrder.orderId.toString());
        formData.append('payment_method', paymentMethod);
        formData.append('images', paymentImage);

        const paymentResponse = await api.post('/customer/upload-payment-proof', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (paymentResponse.data.success === false) {
          toast.error(paymentResponse.data.message || 'فشل في رفع إثبات الدفع');
          return;
        }
      }

      setGroupedCarts(prev => prev.filter(r => r.restaurantId !== restaurantToOrder.restaurantId));
      setSelectedRestaurantId(null);
      setPaymentImage(null);
      setPaymentMethod(null);

      setOrderSuccess({ show: true, orderId: ourOrder.orderId, countdown: 5, isReservation: isReservationOrder });
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
      toast.error(axiosError.response?.data?.error ?? axiosError.response?.data?.message ?? 'حدث خطأ في إنشاء الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = cartSummary;
  const displayRestaurants = selectedRestaurant ? [selectedRestaurant] : groupedCarts;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] p-4 space-y-3" dir="rtl">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4" dir="rtl">
        <EmptyState
          icon="⚠️"
          title="تعذر تحميل السلة"
          description={loadError}
          actionLabel="إعادة المحاولة"
          onAction={() => fetchCart()}
        />
      </div>
    );
  }

  if (groupedCarts.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32" dir="rtl">
      <Toaster position="top-center" richColors />
      <div className="h-4" />

      <CartHeader
        itemCount={summary.totalItems}
        onClearCart={handleClearCart}
        hasItems={groupedCarts.length > 0}
      />
      <div className="h-4" />

      {groupedCarts.length > 1 && <NoticeBanner />}

      <RestaurantSelector
        restaurants={groupedCarts}
        selectedRestaurantId={selectedRestaurantId}
        onSelectRestaurant={handleSelectRestaurant}
        hasLocation={!!deliveryLocation}
      />

      <div className="px-4 sm:px-5 pt-5">
        {displayRestaurants.map((restaurant) => (
          <RestaurantCartGroup
            key={restaurant.restaurantId}
            restaurant={restaurant}
            orderNumber={
              groupedCarts.length > 1
                ? groupedCarts.findIndex(r => r.restaurantId === restaurant.restaurantId) + 1
                : 1
            }
            onQuantityChange={handleQuantityChange}
            onRemoveDish={handleRemoveDish}
            onOrderTypeChange={handleOrderTypeChange}
            onReservationDateChange={handleReservationDateChange}
            onReservationTimeChange={handleReservationTimeChange}
          />
        ))}
      </div>

      <DeliveryLocation
        location={deliveryLocation}
        onOpenLocationPicker={() => setIsLocationModalOpen(true)}
      />

      {(selectedRestaurantId || groupedCarts.length === 1) && (
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          grandTotal={summary.grandTotal}
          paymentImage={paymentImage}
          onImageSelect={setPaymentImage}
          isDisabled={isSubmitting}
          orderType={selectedRestaurant?.orderType ?? 'instant'}
        />
      )}

      <OrderSummary
        summary={summary}
        restaurants={selectedRestaurant ? [selectedRestaurant] : groupedCarts}
      />

      <CheckoutButton
        totalItems={summary.totalItems}
        grandTotal={summary.grandTotal}
        isDisabled={!!checkoutDisabledReason}
        disabledReason={checkoutDisabledReason}
        isSubmitting={isSubmitting}
        onCheckout={handleCheckout}
      />

      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={setDeliveryLocation}
        initialLocation={deliveryLocation}
      />

      {orderSuccess.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] p-8 mx-5 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-2">
              تم الطلب بنجاح! 🎉
            </h2>

            <p className="text-[16px] text-[#6B7280] mb-4">
              رقم الطلب: <span className="font-bold text-[#E5A04D]">#{orderSuccess.orderId}</span>
            </p>

            <p className="text-[14px] text-[#9CA3AF] mb-6">
              {orderSuccess.isReservation
                ? 'تم استلام إثبات الدفع. الدفع قيد المراجعة وسنتواصل معك لتأكيد الحجز.'
                : 'شكراً لك! سيتم التواصل معك قريباً لتأكيد الطلب'}
            </p>

            <div className="flex items-center justify-center gap-2 text-[14px] text-[#6B7280]">
              <div className="w-8 h-8 rounded-full bg-[#E5A04D]/10 flex items-center justify-center">
                <span className="text-[#E5A04D] font-bold">{orderSuccess.countdown}</span>
              </div>
              <span>جاري التحويل إلى الصفحة الرئيسية...</span>
            </div>

            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E5A04D] to-[#F8B358] transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - orderSuccess.countdown) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}