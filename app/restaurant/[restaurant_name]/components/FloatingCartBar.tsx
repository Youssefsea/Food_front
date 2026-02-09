'use client';

import { ShoppingCart, ChevronLeft } from 'lucide-react';

interface FloatingCartBarProps {
  itemCount: number;
  totalPrice: number;
  onViewCart: () => void;
}

export function FloatingCartBar({ itemCount, totalPrice, onViewCart }: FloatingCartBarProps) {
  if (itemCount === 0) return null;

  return (
    <div className="fixed left-0 right-0 z-[100] p-3 sm:p-4 md:p-5 animate-slideUpBounce fixed-above-bottom-nav">
      <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-5">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-[#FEF3E2] rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#E5A04D]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs md:text-sm text-[#6B7280]">
                {itemCount} {itemCount === 1 ? 'صنف' : 'أصناف'}
              </p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-[#1A1A1A]">
                {totalPrice} ج.م
              </p>
            </div>
          </div>

          <button
            onClick={onViewCart}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 h-9 sm:h-10 md:h-11 bg-[#E5A04D] hover:bg-[#D4903D] text-white rounded-lg sm:rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-[#E5A04D]/30 active:scale-95 transition-all"
          >
            <span>عرض السلة</span>
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUpBounce {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          60% {
            transform: translateY(-10px);
            opacity: 1;
          }
          80% {
            transform: translateY(5px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-slideUpBounce {
          animation: slideUpBounce 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
