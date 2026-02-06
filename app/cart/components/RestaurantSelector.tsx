'use client';

import { motion } from "framer-motion";
import { Check, Store, MapPin, AlertCircle } from "lucide-react";
import { RestaurantCart } from "../types";

interface RestaurantSelectorProps {
  restaurants: RestaurantCart[];
  selectedRestaurantId: number | null;
  onSelectRestaurant: (restaurantId: number) => void;
  hasLocation: boolean;
}

export function RestaurantSelector({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  hasLocation
}: RestaurantSelectorProps) {
  if (restaurants.length <= 1) return null;

  return (
    <div className="bg-white rounded-2xl mx-5 mb-5 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-[#1A1A1A]">🏪 اختر مطعم للطلب</h2>
        <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded-full">
          اختياري: مطعم واحد في كل مرة
        </span>
      </div>

      {/* Info Banner */}
      <div className="bg-[#FEF3E2] border border-[#FCD34D] rounded-xl p-3 mb-4 flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-[#E5A04D] flex-shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#92400E]">
          لديك طلبات من أكثر من مطعم. يجب اختيار مطعم واحد لتأكيد الطلب. 
          يمكنك العودة لطلب باقي المطاعم بعد إتمام هذا الطلب.
        </div>
      </div>

      {/* Restaurant Options */}
      <div className="space-y-3">
        {restaurants.map((restaurant) => {
          const isSelected = selectedRestaurantId === restaurant.restaurantId;
          const isOpen = restaurant.is_open !== 0;
          const firstLetter = restaurant.restaurantName?.charAt(0) || '🍕';

          return (
            <motion.button
              key={restaurant.restaurantId}
              onClick={() => onSelectRestaurant(restaurant.restaurantId)}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-right ${
                isSelected
                  ? "border-[#E5A04D] bg-[#FEF3E2]"
                  : "border-[#E5E7EB] bg-white hover:border-[#E5A04D]/50"
              } ${!isOpen ? "opacity-60" : ""}`}
              disabled={!isOpen}
            >
              {/* Selection Indicator */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                isSelected ? "border-[#E5A04D] bg-[#E5A04D]" : "border-[#E5E7EB]"
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>

              {/* Restaurant Logo */}
              <div className="w-12 h-12 rounded-xl border-2 border-[#E5E7EB] overflow-hidden bg-[#E5A04D] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[18px] font-bold">{firstLetter}</span>
              </div>

              {/* Restaurant Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[15px] font-semibold text-[#1A1A1A] truncate">
                    {restaurant.restaurantName}
                  </span>
                  {!isOpen && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#EF4444]">
                      مغلق
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[12px] text-[#6B7280] mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{restaurant.restaurantLocation || 'غير محدد'}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-[12px]">
                  <div className="flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span className="text-[#1A1A1A]">{restaurant.totalItems} أصناف</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#1A1A1A] font-semibold">{restaurant.totalPrice} ج.م</span>
                  </div>
                  {hasLocation && restaurant.distanceKm > 0 && (
                    <div className="flex items-center gap-1 text-[#E5A04D]">
                      <span>{restaurant.distanceKm.toFixed(1)} كم</span>
                    </div>
                  )}
                </div>

                {/* Delivery Fee */}
                {hasLocation && restaurant.calculatedDeliveryFee > 0 && (
                  <div className="mt-2 text-[12px] text-[#6B7280]">
                    رسوم التوصيل: <span className="font-semibold text-[#1A1A1A]">{restaurant.calculatedDeliveryFee.toFixed(2)} ج.م</span>
                  </div>
                )}
                {!hasLocation && (
                  <div className="mt-2 text-[11px] text-[#9CA3AF]">
                    💡 حدد موقعك لحساب رسوم التوصيل
                  </div>
                )}
              </div>

              {/* Total Badge */}
              {isSelected && (
                <div className="bg-[#E5A04D] text-white px-3 py-1.5 rounded-lg text-[13px] font-semibold flex-shrink-0">
                  {(restaurant.totalPrice + (restaurant.calculatedDeliveryFee || 0)).toFixed(2)} ج.م
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
