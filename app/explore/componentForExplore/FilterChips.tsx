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
    <div className="px-4 py-2 bg-white">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {/* Location Button */}
        <button
          onClick={onLocationClick}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] disabled:opacity-50"
        >
          <span className="text-sm">موقعي</span>
          
          {isLocating ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </button>

        {/* Nearby Filter */}
        <button
          onClick={onNearbyToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            nearbyOnly
              ? 'bg-[#E5A04D] text-white shadow-md'
              : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
          }`}
        >
          <span className="text-sm">قريب مني</span>
          <MapPinned className="w-4 h-4" />
        </button>

        {/* Delivery Filter */}
        <button
          onClick={onDeliveryToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            deliveryOnly
              ? 'bg-[#E5A04D] text-white shadow-md'
              : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
          }`}
        >
          <span className="text-sm">توصيل</span>
          <Truck className="w-4 h-4" />
        </button>

        {/* Booking Filter */}
        <button
          onClick={onBookingToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            bookingOnly
              ? 'bg-[#E5A04D] text-white shadow-md'
              : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
          }`}
        >
          <span className="text-sm">حجز مسبق</span>
          <Clock className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
