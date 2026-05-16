'use client';

import React, { memo, useCallback, useState, useEffect, useRef, Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ShoppingCart,
  Trash2,
  MapPin,
  CreditCard,
  Banknote,
  Plus,
  Minus,
  Upload,
  X,
  AlertTriangle,
  Utensils,
  Smartphone,
} from 'lucide-react';
import { cn, formatCurrency, getFirstImage } from '@/lib/utils';
import { LocationData, PaymentMethod as PaymentMethodType, CartSummary, RestaurantCart } from './types';
import { Modal, Badge, Button,EmptyState } from '@/components/ui';
import BackButton from '../../components/layout/BackButton'


// Custom Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Re-center map component
const RecenterMapno = (({ lat, lng }: { lat: number; lng: number }):React.ReactElement | null=> {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
});
const RecenterMap = memo(RecenterMapno);

// Customer marker component
const CustomerMarkerm = (({ lat, lng, onChange }: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      draggable
      icon={customIcon}
      eventHandlers={{
        dragend: (e) => {
          const p = e.target.getLatLng();
          onChange(p.lat, p.lng);
        },
      }}
    />
  );
});
const CustomerMarker = memo(CustomerMarkerm);

const LocationPickerModalm = (({ isOpen, onClose, onSelectLocation, initialLocation }: {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationData) => void;
  initialLocation: LocationData | null;
}) => {
  const [currentLat, setCurrentLat] = useState(() => initialLocation?.lat || 30.0444);
  const [currentLng, setCurrentLng] = useState(() => initialLocation?.lng || 31.2357);
  const [address, setAddress] = useState<string>(initialLocation?.address || '');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const geocodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reverse geocode using OSM Nominatim — free, no API key needed
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
        { headers: { 'Accept-Language': 'ar' } }
      );
      const data = await res.json();

      if (data?.address) {
        const a = data.address;
        // Build a human-friendly address: road → neighbourhood → suburb → city
        const parts = [
          a.road || a.pedestrian || a.footway,
          a.neighbourhood || a.quarter,
          a.suburb || a.village || a.town,
          a.city || a.county,
        ].filter(Boolean);
        setAddress(parts.join('، ') || data.display_name || 'موقع محدد');
      } else {
        setAddress('موقع محدد');
      }
    } catch {
      setAddress('موقع محدد');
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  // Debounce geocoding so it fires 600ms after the marker stops moving
  const debouncedGeocode = useCallback((lat: number, lng: number) => {
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    geocodeTimeoutRef.current = setTimeout(() => reverseGeocode(lat, lng), 600);
  }, [reverseGeocode]);

  useEffect(() => {
    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, []);

  // Geocode on mount if no address yet
  useEffect(() => {
    if (!address) reverseGeocode(currentLat, currentLng);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkerChange = useCallback((lat: number, lng: number) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    debouncedGeocode(lat, lng);
  }, [debouncedGeocode]);

  const locateMe = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLat(latitude);
        setCurrentLng(longitude);
        reverseGeocode(latitude, longitude);
      },
      () => alert("تعذر الوصول لموقعك الحالي")
    );
  }, [reverseGeocode]);

  const handleConfirm = useCallback(() => {
    onSelectLocation({ lat: currentLat, lng: currentLng, address });
    onClose();
  }, [currentLat, currentLng, address, onSelectLocation, onClose]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="mobile-bottom-sheet">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#1A1A2E]">حدد عنوانك</h2>
        <div className="flex gap-2">
          <Button onClick={locateMe} variant="outline" className="h-10 px-4 text-sm">
            <MapPin className="w-5 h-5 ml-2" />
            موقعي الحالي
          </Button>
          <Button onClick={onClose} variant="ghost" className="w-10 h-10 p-0 flex items-center justify-center">
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={13}
          className="h-full w-full rounded-b-xl"
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap lat={currentLat} lng={currentLng} />
          {/* Pass handleMarkerChange instead of direct setters */}
          <CustomerMarker
            lat={currentLat}
            lng={currentLng}
            onChange={handleMarkerChange}
          />
        </MapContainer>
      </div>

      <div className="p-4 space-y-3">
        {/* Address display */}
        <div className="flex items-start gap-2 bg-[#FFF8F0] rounded-xl p-3 border border-[#E5A04D]/20 min-h-[48px]">
          <MapPin className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0" />
          {isLoadingAddress ? (
            <span className="text-sm text-gray-400 animate-pulse">جاري تحديد العنوان...</span>
          ) : (
            <span className="text-sm text-[#1A1A2E] font-medium leading-relaxed text-right">
              {address || 'حرك الخريطة لتحديد موقعك'}
            </span>
          )}
        </div>

        {/* Coords (subtle) */}
        <p className="text-xs text-gray-400 text-center">
          ({currentLat.toFixed(6)}، {currentLng.toFixed(6)})
        </p>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            إلغاء
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoadingAddress}
            className="flex-1 bg-[#FF6B35] text-white"
          >
            تأكيد العنوان
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export const LocationPickerModal = memo(LocationPickerModalm);


// Cart Header
 const CartHeaderm = (({ itemCount, onClearCart, hasItems }: { itemCount: number; onClearCart: () => void; hasItems: boolean }) => (
  <div className="flex items-center justify-between px-5">
    <BackButton />
    <h1 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
      <ShoppingCart className="w-5 h-5" />
      سلة المشتريات ({itemCount})
    </h1>
    {hasItems && (
      <Button variant="ghost" size="sm" onClick={onClearCart} className="text-red-500 hover:bg-red-50">
        <Trash2 className="w-4 h-4 ml-1" />
        إفراغ السلة
      </Button>
    )}
  </div>
));
export const CartHeader = memo(CartHeaderm);

// Notice Banner
 const NoticeBannerm = (() => (
  <div className="bg-blue-50 border-blue-200 text-blue-700 px-4 py-3 rounded-xl mx-5 flex items-center gap-3 text-sm">
    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
    <span>
      لديك عناصر من عدة مطاعم. يرجى اختيار مطعم واحد لإتمام الطلب.
    </span>
  </div>
));

export const NoticeBanner = memo(NoticeBannerm);
// Restaurant Selector
 const RestaurantSelectorm = (({ restaurants, selectedRestaurantId, onSelectRestaurant, hasLocation }: {
  restaurants: RestaurantCart[];
  selectedRestaurantId: number | null;
  onSelectRestaurant: (id: number) => void;
  hasLocation: boolean;
}) => {
  if (restaurants.length <= 1) return null;

  return (
    <div className="px-5 py-3 space-y-3">
      <h2 className="text-lg font-bold text-[#1A1A2E]">اختر مطعم للطلب</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {restaurants.map(r => (
          <button
            key={r.restaurantId}
            onClick={() => onSelectRestaurant(r.restaurantId)}
            disabled={!hasLocation}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-all",
              selectedRestaurantId === r.restaurantId
                ? "border-[#FF6B35] bg-[#FFF8F0] shadow-sm"
                : "border-gray-200 bg-white hover:border-gray-300",
              !hasLocation && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                {r.restaurantLogo ? (
                  <Image src={r.restaurantLogo} alt={r.restaurantName} width={40} height={40} className="rounded-lg" />
                ) : (
                  '🍽️'
                )}
              </div>
              <span className="font-semibold text-sm text-[#1A1A2E]">{r.restaurantName}</span>
            </div>
            {selectedRestaurantId === r.restaurantId && (
              <span className="w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs">✓</span>
            )}
          </button>
        ))}
      </div>
      {!hasLocation && (
        <p className="text-sm text-red-500 mt-2">يرجى تحديد موقع التوصيل أولاً لاختيار المطعم.</p>
      )}
    </div>
  );
});
export const RestaurantSelector = memo(RestaurantSelectorm);

// Cart Item Row
const CartItemRowm = (({ item, onQuantityChange, onRemoveDish }: {
  item: RestaurantCart['dishes'][0];
  onQuantityChange: (dishId: number, quantity: number) => void;
  onRemoveDish: (dishId: number) => void;
}) => {
  const image = getFirstImage(item.image);

  const handleIncrement = useCallback(() => onQuantityChange(item.dishId, item.quantity + 1), [item, onQuantityChange]);
  const handleDecrement = useCallback(() => onQuantityChange(item.dishId, item.quantity - 1), [item, onQuantityChange]);
  const handleRemove = useCallback(() => onRemoveDish(item.dishId), [item, onRemoveDish]);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {image ? (
          <Image src={image} alt={item.dishName} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🍽️</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-[#1A1A2E] line-clamp-1">{item.dishName}</h3>
        <p className="text-xs text-[#9CA3AF] line-clamp-1">{item.description}</p>
        <span className="text-sm font-bold text-[#FF6B35]">{formatCurrency(item.price)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={handleDecrement} disabled={item.quantity <= 1}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-sm font-bold text-[#1A1A2E]">{item.quantity}</span>
        <Button variant="outline" size="sm" onClick={handleIncrement}>
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-500 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});
export const CartItemRow = memo(CartItemRowm);

// Restaurant Cart Group
 const RestaurantCartGroupm = (({ restaurant, orderNumber, onQuantityChange, onRemoveDish,onOrderTypeChange,onReservationDateChange,onReservationTimeChange }: {
  restaurant: RestaurantCart;
  orderNumber: number;
  onQuantityChange: (restaurantId: number, dishId: number, quantity: number) => void;
  onRemoveDish: (restaurantId: number, dishId: number) => void;
  onOrderTypeChange: (restaurantId: number, orderType: 'instant' | 'reservation') => void;
  onReservationDateChange: (restaurantId: number, date: string) => void;
  onReservationTimeChange: (restaurantId: number, time: string) => void;
}) => {
  const handleDishQuantityChange = useCallback((dishId: number, quantity: number) => {
    onQuantityChange(restaurant.restaurantId, dishId, quantity);
  }, [restaurant.restaurantId, onQuantityChange]);

  const handleDishRemove = useCallback((dishId: number) => {
    onRemoveDish(restaurant.restaurantId, dishId);
  }, [restaurant.restaurantId, onRemoveDish]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <h2 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2">
          <Utensils className="w-4 h-4" />
          {restaurant.restaurantName}
        </h2>
        <Badge variant="neutral" size="sm">طلب رقم {orderNumber}</Badge>
      </div>
      <div className="space-y-2">
        {restaurant.dishes.map(dish => (
          <CartItemRow
            key={dish.dishId}
            item={dish}
            onQuantityChange={handleDishQuantityChange}
            onRemoveDish={handleDishRemove}
          />
        ))}
      </div>
      {restaurant.can_reserve && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-2">نوع الطلب</h3>
          <div className="flex gap-2">
            <Button
              variant={restaurant.orderType === 'instant' ? 'primary' : 'outline'}
              onClick={() => onOrderTypeChange(restaurant.restaurantId, 'instant')}
              size="sm"
            >
              فوري
            </Button>
            <Button
              variant={restaurant.orderType === 'reservation' ? 'primary' : 'outline'}
              onClick={() => onOrderTypeChange(restaurant.restaurantId, 'reservation')}
              size="sm"
            >
              حجز
            </Button>
          </div>
          {restaurant.orderType === 'reservation' && (
            <div className="flex gap-2 mt-3">
              <input type="date" className="p-2 border rounded-md" onChange={(e) => onReservationDateChange(restaurant.restaurantId, e.target.value)} />
              <input type="time" className="p-2 border rounded-md" onChange={(e) => onReservationTimeChange(restaurant.restaurantId, e.target.value)} />
            </div>
          )}
          {restaurant.orderType === 'reservation' && (!restaurant.reservationDate || !restaurant.reservationTime) && (
            <p className="text-sm text-red-500 mt-2">يرجى تحديد تاريخ ووقت الحجز.</p>
          )}
          {restaurant.orderType === 'reservation' && restaurant.reservationDate && restaurant.reservationTime && (
            <p className="text-sm text-green-500 mt-2">تم تحديد الحجز ليوم {restaurant.reservationDate} في تمام {restaurant.reservationTime}.</p>
          )
          }
          
        </div>
      )}
    </div>
  );
});
export const RestaurantCartGroup = memo(RestaurantCartGroupm);

// Delivery Location
 const DeliveryLocationm = (({ location, onOpenLocationPicker }: {
  location: LocationData | null;
  onOpenLocationPicker: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mx-5 mb-4">
    <div className="flex items-center justify-between">
      <h2 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2">
        <MapPin className="w-5 h-5 text-[#FF6B35]" />
        عنوان التوصيل
      </h2>
      <Button variant="ghost" size="sm" onClick={onOpenLocationPicker} className="text-[#FF6B35] hover:bg-[#FFF8F0]">
        {location ? 'تغيير' : 'تحديد'}
      </Button>
    </div>
    <p className="text-sm text-[#6B7280] mt-2">
      {location ? location.address : 'لم يتم تحديد عنوان التوصيل'}
    </p>
  </div>
));
export const DeliveryLocation = memo(DeliveryLocationm);

const PaymentMethodm = (({ paymentMethod, setPaymentMethod, grandTotal, paymentImage, onImageSelect, isDisabled, orderType = 'instant' }: {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
  grandTotal: number;
  paymentImage: File | null;
  onImageSelect: (file: File | null) => void;
  isDisabled: boolean;
  orderType?: 'instant' | 'reservation';
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isReservation = orderType === 'reservation';

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  }, [onImageSelect]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeImage = useCallback(() => {
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onImageSelect]);

  const needsProof = isReservation && (paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mx-5 mb-4">
      <h2 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-[#FF6B35]" />
        طريقة الدفع
      </h2>

      {isReservation ? (
        <>
          {/* Payment Method Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              variant={paymentMethod === 'vodafone_cash' ? 'primary' : 'outline'}
              onClick={() => setPaymentMethod('vodafone_cash')}
              disabled={isDisabled}
              className="flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              فودافون كاش
            </Button>
            <Button
              variant={paymentMethod === 'instapay' ? 'primary' : 'outline'}
              onClick={() => setPaymentMethod('instapay')}
              disabled={isDisabled}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              إنستاباي
            </Button>
          </div>

          {/* Payment Proof Upload — shown when a method is selected */}
          {needsProof && (
            <div className="mt-2">
              <p className="text-sm font-medium text-[#1A1A2E] mb-2">
                صورة تأكيد الدفع <span className="text-red-500">*</span>
              </p>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isDisabled}
              />

              {paymentImage ? (
                /* Preview selected image */
                <div className="relative h-40 rounded-xl overflow-hidden border border-[#E5A04D]/40 bg-[#FFF8F0]">
                  <Image
                    src={URL.createObjectURL(paymentImage)}
                    alt="تأكيد الدفع"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/40 to-transparent">
                    <span className="text-white text-xs truncate max-w-[70%]">
                      {paymentImage.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={triggerFileInput}
                        disabled={isDisabled}
                        className="bg-white/90 rounded-lg px-2 py-1 text-xs text-[#1A1A2E] font-medium"
                      >
                        تغيير
                      </button>
                      <button
                        onClick={removeImage}
                        disabled={isDisabled}
                        className="bg-red-500/90 rounded-lg px-2 py-1 text-xs text-white font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload button */
                <button
                  onClick={triggerFileInput}
                  disabled={isDisabled}
                  className="w-full border-2 border-dashed border-[#E5A04D]/50 rounded-xl p-5 flex flex-col items-center gap-2 bg-[#FFF8F0] active:bg-[#FFF0DC] transition-colors disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E5A04D]/15 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#E5A04D]" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">اضغط لرفع صورة الإيصال</span>
                  <span className="text-xs text-[#6B7280]">PNG, JPG, JPEG</span>
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        /* Delivery: Cash on delivery only */
        <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E5A04D]/20">
          <div className="flex items-center gap-2 text-[#1A1A2E]">
            <Banknote className="w-5 h-5 text-[#E5A04D]" />
            <span className="font-medium">الدفع عند الاستلام (كاش)</span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            سيتم الدفع نقداً عند استلام الطلب
          </p>
        </div>
      )}
    </div>
  );
});
export const PaymentMethod = memo(PaymentMethodm);

// Order Summary
 const OrderSummarym = (({ summary, restaurants }: {
  summary: CartSummary;
  restaurants: RestaurantCart[];
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mx-5 mb-4">
    <h2 className="text-base font-bold text-[#1A1A2E] flex items-center gap-2 mb-3">
      <CreditCard className="w-5 h-5 text-[#FF6B35]" />
      ملخص الطلب
    </h2>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-[#6B7280]">
        <span>المجموع الفرعي ({summary.totalItems} صنف)</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>
      {restaurants.map(r => r.calculatedDeliveryFee > 0 && (
        <div key={r.restaurantId} className="flex justify-between text-[#6B7280]">
          <span>رسوم توصيل {r.restaurantName} ({r.distanceKm} كم)</span>
          <span>{formatCurrency(r.calculatedDeliveryFee)}</span>
        </div>
      ))}
      <div className="flex justify-between font-bold text-lg text-[#1A1A2E] pt-2 border-t border-gray-100">
        <span>الإجمالي</span>
        <span>{formatCurrency(summary.grandTotal)}</span>
      </div>
    </div>
  </div>
));
export const OrderSummary = memo(OrderSummarym);


// Checkout Button
const CheckoutButtonm = (({ totalItems, grandTotal, isDisabled, disabledReason, _totalRestaurants ,isSubmitting, onCheckout }: {
  totalItems: number;
  _totalRestaurants: number;
  grandTotal: number;
  isDisabled: boolean;
  disabledReason: string;
  isSubmitting: boolean;
  onCheckout: () => void;
}) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg md:relative md:mx-5 md:rounded-2xl md:mb-4">
    <Button
      onClick={onCheckout}
      disabled={isDisabled || isSubmitting}
      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E63946] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
    >
      {isSubmitting ? (
        'جاري إتمام الطلب...'
      ) : (
        <Fragment>
          <ShoppingCart className="w-4 h-4" />
          <span>
            إتمام الطلب ({totalItems} صنف) — {formatCurrency(grandTotal)}
          </span>
        </Fragment>
      )}
    </Button>
    {isDisabled && !isSubmitting && (
      <p className="text-red-500 text-xs text-center mt-2">{disabledReason}</p>
    )}
  </div>
));
export const CheckoutButton = memo(CheckoutButtonm);

// Empty Cart State
 const EmptyCartm = (() => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]" dir="rtl">
      <EmptyState
        icon="🛒"
        title="سلة المشتريات فارغة"
        description="ابدأ بتصفح المطاعم وإضافة أطباقك المفضلة."
        actionLabel="تصفح المطاعم"
        onAction={() => router.push('/explore')}
      />
    </div>
  );
});
export const EmptyCart = memo(EmptyCartm);
