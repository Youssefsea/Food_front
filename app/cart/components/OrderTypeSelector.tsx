'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface OrderTypeSelectorProps {
  orderType: "instant" | "reservation";
  setOrderType: (type: "instant" | "reservation") => void;
  canReserve: boolean;
  reservationDate: string;
  setReservationDate: (date: string) => void;
  reservationTime: string;
  setReservationTime: (time: string) => void;
  restaurantName?: string;
}

export function OrderTypeSelector({
  orderType,
  setOrderType,
  canReserve,
  reservationDate,
  setReservationDate,
  reservationTime,
  setReservationTime,
  restaurantName
}: OrderTypeSelectorProps) {
  // Get tomorrow's date as minimum for reservation
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="bg-[#F9FAFB] rounded-xl p-4 mt-4 border border-[#E5E7EB]">
      <h3 className="text-[14px] font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
        <span>🚗</span>
        <span>نوع الطلب {restaurantName ? `- ${restaurantName}` : ''}</span>
      </h3>

      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Instant Delivery */}
        <button
          onClick={() => setOrderType("instant")}
          className={`p-3 rounded-xl border-2 transition-all text-center ${
            orderType === "instant"
              ? "border-[#E5A04D] bg-[#FEF3E2]"
              : "border-[#E5E7EB] bg-white"
          }`}
        >
          <div className="text-[24px] mb-1">🚗</div>
          <div className="text-[13px] font-semibold text-[#1A1A1A]">توصيل فوري</div>
          <div className="text-[11px] text-[#6B7280]">استلم الآن</div>
        </button>

        {/* Reservation */}
        <button
          onClick={() => canReserve && setOrderType("reservation")}
          disabled={!canReserve}
          className={`p-3 rounded-xl border-2 transition-all text-center ${
            orderType === "reservation"
              ? "border-[#E5A04D] bg-[#FEF3E2]"
              : "border-[#E5E7EB] bg-white"
          } ${!canReserve ? "opacity-50 cursor-not-allowed" : ""}`}
          title={!canReserve ? "هذا المطعم لا يدعم الحجز" : ""}
        >
          <div className="text-[24px] mb-1">📅</div>
          <div className="text-[13px] font-semibold text-[#1A1A1A]">حجز مسبق</div>
          <div className="text-[11px] text-[#6B7280]">
            {canReserve ? "حدد موعد" : "غير متاح"}
          </div>
        </button>
      </div>

      {/* Reservation Date/Time Picker */}
      <AnimatePresence>
        {orderType === "reservation" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-dashed border-[#E5E7EB] overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Date Picker */}
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] mb-2 block">
                  📅 التاريخ
                </label>
                <input
                  type="date"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  min={getTomorrowDate()}
                  className="w-full h-11 px-3 border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:border-[#E5A04D] transition-colors"
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="text-[13px] font-semibold text-[#1A1A1A] mb-2 block">
                  🕐 الوقت
                </label>
                <select
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                  className="w-full h-11 px-3 border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:border-[#E5A04D] transition-colors bg-white"
                >
                  <option value="">اختر</option>
                  <option value="10:00">١٠:٠٠ ص</option>
                  <option value="11:00">١١:٠٠ ص</option>
                  <option value="12:00">١٢:٠٠ م</option>
                  <option value="13:00">١:٠٠ م</option>
                  <option value="14:00">٢:٠٠ م</option>
                  <option value="15:00">٣:٠٠ م</option>
                  <option value="16:00">٤:٠٠ م</option>
                  <option value="17:00">٥:٠٠ م</option>
                  <option value="18:00">٦:٠٠ م</option>
                  <option value="19:00">٧:٠٠ م</option>
                  <option value="20:00">٨:٠٠ م</option>
                  <option value="21:00">٩:٠٠ م</option>
                  <option value="22:00">١٠:٠٠ م</option>
                </select>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 mt-3 text-[11px] text-[#6B7280]">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>سيتم تجهيز طلبك قبل الموعد المحدد</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
