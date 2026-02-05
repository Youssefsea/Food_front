'use client';

import { MapPinned, Truck, Clock, Navigation } from 'lucide-react';

interface FilterChipsProps {
  nearbyOnly: boolean;
  deliveryOnly: boolean;
  bookingOnly: boolean;
  onNearbyToggle: () => void;
  onDeliveryToggle: () => void;
  onBookingToggle: () => void;
  onLocationClick: () => void;
  isLocating: boolean;
}

export function FilterChips({
  nearbyOnly,
  deliveryOnly,
  bookingOnly,
  onNearbyToggle,
  onDeliveryToggle,
  onBookingToggle,
  onLocationClick,
  isLocating
}: FilterChipsProps) {
  return (
    <div className="bg-white border-b border-[#E5E7EB] py-2 sm:py-2.5 md:py-3">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-1.5 sm:gap-2 md:gap-2.5 px-3 sm:px-4 md:px-5">
          {/* Location Button */}
          <button
            onClick={onLocationClick}
            disabled={isLocating}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] active:scale-95 disabled:opacity-50 text-[11px] sm:text-xs md:text-[13px] font-medium border border-transparent"
          >
            {isLocating ? (
              <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Navigation className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            )}
            <span>موقعي</span>
          </button>

          {/* Nearby Filter */}
          <button
            onClick={onNearbyToggle}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all active:scale-95 text-[11px] sm:text-xs md:text-[13px] font-medium border ${
              nearbyOnly
                ? 'bg-[#FEF3E2] border-[#E5A04D] text-[#E5A04D] shadow-sm'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
            }`}
          >
            <MapPinned className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>قريب مني</span>
          </button>

          {/* Delivery Filter */}
          <button
            onClick={onDeliveryToggle}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all active:scale-95 text-[11px] sm:text-xs md:text-[13px] font-medium border ${
              deliveryOnly
                ? 'bg-[#FEF3E2] border-[#E5A04D] text-[#E5A04D] shadow-sm'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
            }`}
          >
            <Truck className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>توصيل</span>
          </button>

          {/* Booking Filter */}
          <button
            onClick={onBookingToggle}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all active:scale-95 text-[11px] sm:text-xs md:text-[13px] font-medium border ${
              bookingOnly
                ? 'bg-[#FEF3E2] border-[#E5A04D] text-[#E5A04D] shadow-sm'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'
            }`}
          >
            <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>حجز مسبق</span>
          </button>
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
