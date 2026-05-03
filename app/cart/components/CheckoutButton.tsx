'use client';

import { Loader2, ShoppingCart } from "lucide-react";

interface CheckoutButtonProps {
  totalItems: number;
  totalRestaurants: number;
  grandTotal: number;
  isDisabled: boolean;
  disabledReason: string;
  isSubmitting: boolean;
  onCheckout: () => void;
}

export function CheckoutButton({
  totalItems,
  totalRestaurants,
  grandTotal,
  isDisabled,
  disabledReason,
  isSubmitting,
  onCheckout
}: CheckoutButtonProps) {
  return (
    <div 
      className="fixed left-0 right-0 bottom-[var(--bottom-nav-total-height)] md:bottom-0 bg-white px-4 sm:px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 rounded-t-[20px]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] text-[#6B7280]">
          {totalItems} أصناف من {totalRestaurants} مطعم
        </span>
        <span className="text-[18px] font-bold text-[#E5A04D]">
          {grandTotal.toFixed(2)} ج.م
        </span>
      </div>

      <button
        onClick={onCheckout}
        disabled={isDisabled || isSubmitting}
        className={`w-full h-14 rounded-[14px] flex items-center justify-center gap-2.5 text-[18px] font-bold text-white transition-all ${
          isDisabled || isSubmitting
            ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
            : "bg-gradient-to-r from-[#E5A04D] to-[#D4903D] shadow-[0_4px_16px_rgba(229,160,77,0.4)] hover:scale-[1.01] active:scale-[0.98]"
        }`}
        title={isDisabled ? disabledReason : ""}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري إرسال الطلب...</span>
          </>
        ) : isDisabled ? (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>{disabledReason}</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>تأكيد الطلب</span>
          </>
        )}
      </button>
    </div>
  );
}
