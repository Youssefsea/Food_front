'use client';

import { MapPin, ChevronDown, User, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  city: string | null;
  cartCount?: number;
}

export function Header({ city, cartCount = 0 }: HeaderProps) {
  return (
    <header className="fixed top-2 left-1 right-1 bg-white z-50 shadow-sm safe-area-top">
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl">🍽️</span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#E5A04D]">وجبات</span>
          </div>

          {/* Location Button - Center on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-[#FEF3E2] rounded-full hover:bg-[#FDE8C9] active:scale-95 transition-all flex-shrink-0">
            <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#E5A04D]" />
            <span className="text-[11px] sm:text-[13px] font-semibold text-[#1A1A1A] max-w-[80px] sm:max-w-[120px] truncate">
              {city || 'حدد موقعك'}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Cart Button */}
            <button className="relative w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 flex items-center justify-center hover:bg-[#F3F4F6] active:scale-95 rounded-full transition-all">
              <ShoppingCart className="w-5 sm:w-5.5 md:w-6 h-5 sm:h-5.5 md:h-6 text-[#1A1A1A]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] bg-[#EF4444] text-white rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <button className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center hover:border-[#E5A04D] active:scale-95 transition-all bg-gradient-to-br from-[#E5A04D] to-[#D4903D]">
              <User className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
      `}</style>
    </header>
  );
}
