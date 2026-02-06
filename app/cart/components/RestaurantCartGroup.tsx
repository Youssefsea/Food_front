'use client';

import { DishItem } from "./DishItem";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { AlertTriangle } from "lucide-react";
import { RestaurantCart } from "../types";


interface RestaurantCartGroupProps {
  restaurant: RestaurantCart;
  orderNumber: number;
  onQuantityChange: (restaurantId: number, dishId: number, quantity: number) => void;
  onRemoveDish: (restaurantId: number, dishId: number) => void;
  onOrderTypeChange: (restaurantId: number, orderType: 'instant' | 'reservation') => void;
  onReservationDateChange: (restaurantId: number, date: string) => void;
  onReservationTimeChange: (restaurantId: number, time: string) => void;
}

export function RestaurantCartGroup({
  restaurant,
  orderNumber,
  onQuantityChange,
  onRemoveDish,
  onOrderTypeChange,
  onReservationDateChange,
  onReservationTimeChange
}: RestaurantCartGroupProps) {
  const firstLetter = restaurant.restaurantName?.charAt(0) || '🍕';
  console.log('Rendering RestaurantCartGroup for:', restaurant);

  return (
    <div className="bg-white rounded-2xl mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Restaurant Header */}
      <div className="p-4 border-b border-[#F3F4F6] bg-[#FAFAFA] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Restaurant Logo */}
          <div className="w-12 h-12 rounded-xl border-2 border-[#E5E7EB] overflow-hidden bg-[#E5A04D] flex items-center justify-center">
            
              <span className="text-white text-[20px] font-bold">{firstLetter}</span>
        
          </div>

          {/* Restaurant Details */}
          <div>
            <div className="text-[16px] font-semibold text-[#1A1A1A]">
              {restaurant.restaurantName}
            </div>
<div className="h-2"/>

            <div className="text-[12px] text-[#9CA3AF] flex items-center gap-1">
              <span>📍</span>
              <span>{restaurant.restaurantLocation || 'غير محدد'}</span>
            </div>
          </div>
        </div>


        {/* Order Number Badge */}
        <div className="bg-[#FEF3E2] text-[#E5A04D] px-3 py-1.5 rounded-2xl text-[12px] font-semibold">
          طلب {orderNumber}
        </div>
      </div>
<div className="h-2"/>


      {/* Closed Warning */}
      {restaurant.is_open === 0 && (
        <div className="bg-[#FEE2E2] border-b border-[#FECACA] p-3 flex gap-2.5">
          <AlertTriangle className="w-[18px] h-[18px] text-[#EF4444] flex-shrink-0 mt-0.5" />
          <span className="text-[13px] text-[#991B1B]">
            هذا المطعم مغلق حالياً. سيتم تجاهل هذا الطلب عند ارسال طلب توصيل فوري.
          </span>
        </div>
      )}

      {/* Dishes List */}
      <div>
        {restaurant.dishes.map((dish, index) => (
          <DishItem
            key={dish.dishId}
            dish={dish}
            isLast={index === restaurant.dishes.length - 1}
            onQuantityChange={(newQuantity) => 
              onQuantityChange(restaurant.restaurantId, dish.dishId, newQuantity)
            }
            onRemove={() => onRemoveDish(restaurant.restaurantId, dish.dishId)}
          />
        ))}
      </div>

      {/* Order Type Selector - Per Restaurant */}
      <div className="px-4 pb-4">
        <OrderTypeSelector
          orderType={restaurant.orderType}
          setOrderType={(type) => onOrderTypeChange(restaurant.restaurantId, type)}
          canReserve={!!restaurant.can_reserve}
          reservationDate={restaurant.reservationDate}
          setReservationDate={(date) => onReservationDateChange(restaurant.restaurantId, date)}
          reservationTime={restaurant.reservationTime}
          setReservationTime={(time) => onReservationTimeChange(restaurant.restaurantId, time)}
        />
      </div>

      {/* Restaurant Order Summary */}
      <div className="bg-[#FAFAFA] p-4 border-t border-[#F3F4F6]">
        <div className="space-y-2.5">
          <div className="flex justify-between text-[14px]">
            <span className="text-[#6B7280]">المجموع الفرعي</span>
            <span className="text-[#1A1A1A]">{restaurant.totalPrice} ج.م</span>
          </div>
          
          {/* Distance */}
          {restaurant.distanceKm > 0 && (
            <div className="flex justify-between text-[14px]">
              <span className="text-[#6B7280]">المسافة من موقعك</span>
              <span className="text-[#E5A04D] font-medium">{restaurant.distanceKm.toFixed(1)} كم</span>
            </div>
          )}
          
          {/* Delivery Fee */}
          <div className="flex justify-between text-[14px]">
            <span className="text-[#6B7280]">رسوم التوصيل</span>
            <span className="text-[#1A1A1A]">
              {restaurant.calculatedDeliveryFee > 0
                ? `${restaurant.calculatedDeliveryFee.toFixed(2)} ج.م`
                : restaurant.distanceKm > 0 
                  ? '- ج.م' 
                  : `${restaurant.delivery_fees} ج.م/كم (حدد موقعك)`
              }
            </span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#6B7280]">عدد الأصناف</span>
            <span className="text-[#1A1A1A]">{restaurant.totalItems} أصناف</span>
          </div>
          
          {/* Total */}
          <div className="bg-[#FEF3E2] rounded-[10px] p-3 mt-1.5 flex justify-between items-center">
            <span className="text-[15px] font-semibold text-[#1A1A1A]">إجمالي هذا الطلب</span>
            <span className="text-[18px] font-bold text-[#E5A04D]">
              {(restaurant.totalPrice + (restaurant.calculatedDeliveryFee || 0)).toFixed(2)} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
