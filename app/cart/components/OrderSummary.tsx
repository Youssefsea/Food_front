'use client';

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartSummary as CartSummaryType, RestaurantCart } from "../types";

interface OrderSummaryProps {
  summary: CartSummaryType;
  restaurants: RestaurantCart[];
}

export function OrderSummary({ summary, restaurants }: OrderSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="bg-white rounded-2xl mx-5 mb-5 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-4">📊 ملخص الطلبات</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">عدد المطاعم</span>
          <span className="font-semibold text-[#1A1A1A]">
            {summary.totalRestaurants} مطعم
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">إجمالي الأصناف</span>
          <span className="font-semibold text-[#1A1A1A]">
            {summary.totalItems} أصناف
          </span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">المجموع الفرعي</span>
          <span className="text-[#1A1A1A]">{summary.subtotal.toFixed(2)} ج.م</span>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#6B7280]">
            رسوم التوصيل ({summary.totalRestaurants} طلب)
          </span>
          <span className="text-[#1A1A1A]">{summary.totalDeliveryFees.toFixed(2)} ج.م</span>
        </div>

        <div className="h-px bg-[#E5E7EB] my-2" />

        <div className="bg-gradient-to-r from-[#E5A04D] to-[#F59E0B] rounded-xl p-4 flex justify-between items-center">
          <span className="text-[16px] font-semibold text-white">الإجمالي الكلي</span>
          <span className="text-[24px] font-bold text-white">
            {summary.grandTotal.toFixed(2)} ج.م
          </span>
        </div>
      </div>

      {restaurants.length > 1 && (
        <>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-center gap-2 text-[14px] text-[#E5A04D] mt-4 hover:bg-[#FEF3E2] py-2 rounded-lg transition-colors"
          >
            <span>عرض تفاصيل كل طلب</span>
            {showBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3 overflow-hidden"
              >
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.restaurantId}
                    className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-[16px]">🏪</span>
                      <span className="text-[14px] font-semibold text-[#1A1A1A]">
                        {restaurant.restaurantName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full mr-auto ${
                        restaurant.orderType === 'reservation' 
                          ? 'bg-[#DBEAFE] text-[#3B82F6]' 
                          : 'bg-[#D1FAE5] text-[#10B981]'
                      }`}>
                        {restaurant.orderType === 'reservation' ? '📅 حجز' : '🚗 فوري'}
                      </span>
                    </div>
                    <div className="space-y-1 text-[13px] text-[#6B7280] pr-6">
                      <div>• {restaurant.dishes.length} أصناف: {restaurant.totalPrice} ج.م</div>
                      <div>• رسوم توصيل: {restaurant.calculatedDeliveryFee ? restaurant.calculatedDeliveryFee.toFixed(2) : restaurant.delivery_fees} ج.م</div>
                      <div className="font-semibold text-[#1A1A1A]">
                        • إجمالي: {(restaurant.totalPrice + (restaurant.calculatedDeliveryFee || 0)).toFixed(2)} ج.م
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    
    </div>
  );
}
