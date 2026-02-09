'use client';

import { Search, MapPin } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function EmptyState({ 
  message = 'لا توجد مطاعم',
  onClearFilters,
  hasActiveFilters = false
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4">
      <div className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 bg-[#FEF3E2] rounded-full flex items-center justify-center mb-4 sm:mb-5">
        <div className="relative">
          <Search className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 text-[#E5A04D]" />
          <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-[#D4903D] absolute -bottom-1 -right-1" />
        </div>
      </div>

      <h3 className="text-[#1A1A1A] text-base sm:text-lg md:text-xl font-bold mb-2 text-center">
        {message}
      </h3>

      <p className="text-[#6B7280] text-xs sm:text-sm text-center max-w-[280px] sm:max-w-xs mb-5 sm:mb-6 leading-relaxed">
        جرب تغيير الموقع أو الفلاتر للعثور على المطاعم المتاحة بالقرب منك
      </p>

      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#E5A04D] text-white rounded-xl text-sm font-semibold hover:bg-[#D4903D] active:scale-95 transition-all shadow-md hover:shadow-lg"
        >
          مسح الفلاتر
        </button>
      )}

      <div className="flex items-center gap-2 mt-6 sm:mt-8 text-[#D1D5DB]">
        <span className="text-xl sm:text-2xl">🍕</span>
        <span className="text-lg sm:text-xl">🍔</span>
        <span className="text-xl sm:text-2xl">🍜</span>
      </div>
    </div>
  );
}
