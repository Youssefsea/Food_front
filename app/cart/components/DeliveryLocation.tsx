'use client';

import { MapPin } from "lucide-react";
import { LocationData } from "../types";

interface DeliveryLocationProps {
  location: LocationData | null;
  onOpenLocationPicker: () => void;
}

export function DeliveryLocation({ location, onOpenLocationPicker }: DeliveryLocationProps) {
  return (
    <div className="bg-white rounded-2xl mx-5 mb-5 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-[#1A1A1A] flex items-center gap-2">
          📍 عنوان التوصيل
        </h2>
        <span className="text-[#EF4444] text-[18px]">*</span>
      </div>

      {!location ? (
        /* Empty State */
        <button
          onClick={onOpenLocationPicker}
          className="w-full bg-[#F9FAFB] border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#E5A04D] hover:bg-[#FEF3E2] transition-all cursor-pointer"
        >
          <div className="text-[48px] text-[#9CA3AF] mb-3">📍</div>
          <div className="text-[16px] font-semibold text-[#1A1A1A] mb-1">
            أضف عنوان التوصيل
          </div>
          <div className="text-[14px] text-[#6B7280]">
            اضغط لتحديد موقعك
          </div>
        </button>
      ) : (
        /* Location Set */
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 flex gap-3.5">
          {/* Map Icon */}
          <div className="w-[60px] h-[60px] rounded-[10px] bg-gradient-to-br from-[#E5A04D] to-[#D4903D] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-7 h-7 text-white" />
          </div>

          {/* Location Details */}
          <div className="flex-1 min-w-0">
            <div className="text-[14px] text-[#1A1A1A] mb-1 line-clamp-2">
              {location.address}
            </div>
            <div className="text-[11px] text-[#9CA3AF] font-mono">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onOpenLocationPicker}
            className="text-[14px] font-semibold text-[#E5A04D] hover:underline self-start"
          >
            تعديل
          </button>
        </div>
      )}
    </div>
  );
}
