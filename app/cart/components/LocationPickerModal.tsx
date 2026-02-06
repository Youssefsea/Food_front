'use client';

import { X, MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationData } from "../types";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

export function LocationPickerModal({ 
  isOpen, 
  onClose, 
  onSelectLocation,
  initialLocation 
}: LocationPickerModalProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedLat, setSelectedLat] = useState(initialLocation?.lat || 30.0444);
  const [selectedLng, setSelectedLng] = useState(initialLocation?.lng || 31.2357);
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [accuracy, setAccuracy] = useState<number | null>(initialLocation?.accuracy || null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Reverse geocoding using OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await response.json();
      return data.display_name || 'موقع غير معروف';
    } catch {
      return 'موقع غير معروف';
    }
  }, []);

  useEffect(() => {
    if (isOpen && selectedLat && selectedLng) {
      reverseGeocode(selectedLat, selectedLng).then(setAddress);
    }
  }, [isOpen, selectedLat, selectedLng, reverseGeocode]);

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy; // دقة GPS بالمتر
          
          setSelectedLat(lat);
          setSelectedLng(lng);
          setAccuracy(acc);
          
          const addr = await reverseGeocode(lat, lng);
          setAddress(addr);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("تم رفض الإذن. يرجى السماح بالوصول للموقع.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("الموقع غير متاح. تحقق من إعدادات GPS.");
              break;
            case error.TIMEOUT:
              setLocationError("انتهت مهلة تحديد الموقع. حاول مرة أخرى.");
              break;
            default:
              setLocationError("حدث خطأ في تحديد الموقع.");
          }
        },
        { 
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0 // لا تستخدم موقع مخزن
        }
      );
    } else {
      setIsLoadingLocation(false);
      setLocationError("المتصفح لا يدعم تحديد الموقع.");
    }
  };

  const handleConfirm = () => {
    onSelectLocation({
      lat: selectedLat,
      lng: selectedLng,
      address,
      accuracy: accuracy || undefined
    });
    onClose();
  };

  // تحديد لون الدقة
  const getAccuracyColor = () => {
    if (!accuracy) return 'text-[#6B7280]';
    if (accuracy <= 20) return 'text-[#10B981]'; // ممتاز
    if (accuracy <= 50) return 'text-[#F59E0B]'; // جيد
    return 'text-[#EF4444]'; // ضعيف
  };

  const getAccuracyLabel = () => {
    if (!accuracy) return '';
    if (accuracy <= 20) return 'دقة ممتازة ✓';
    if (accuracy <= 50) return 'دقة جيدة';
    return 'دقة منخفضة ⚠️';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-[100] bg-white rounded-t-[24px] max-h-[90vh] overflow-hidden md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-[500px] md:rounded-[24px]"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-[18px] font-semibold text-[#1A1A1A]">📍 حدد موقع التوصيل</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
              >
                <X className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Use Current Location Button */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full h-[52px] bg-[#FEF3E2] border-2 border-dashed border-[#E5A04D] rounded-xl flex items-center justify-center gap-2 text-[#E5A04D] font-semibold hover:bg-[#FEF3E2]/80 transition-colors disabled:opacity-50"
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تحديد الموقع...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    <span>استخدم موقعي الحالي</span>
                  </>
                )}
              </button>

              {/* Location Error */}
              {locationError && (
                <div className="mt-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#991B1B]">{locationError}</span>
                </div>
              )}

              {/* GPS Accuracy Note */}
              <div className="mt-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-[14px]">💡</span>
                  <div className="text-[12px] text-[#0369A1]">
                    <p className="font-medium mb-1">لماذا قد يختلف العنوان؟</p>
                    <p>دقة GPS تختلف حسب قوة الإشارة والمباني المحيطة. قد يظهر عنوان شارع مختلف لكن الإحداثيات الفعلية صحيحة ويتم حساب رسوم التوصيل بناءً عليها.</p>
                  </div>
                </div>
              </div>

              {/* Map Container - Placeholder */}
              <div className="mt-4 h-[250px] bg-gradient-to-br from-[#E5E7EB] to-[#F3F4F6] rounded-xl relative overflow-hidden flex items-center justify-center">
                {/* Mock Map Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-300" />
                    ))}
                  </div>
                </div>
                
                {/* Center Pin */}
                <div className="relative z-10">
                  <MapPin 
                    className="w-12 h-12 text-[#E5A04D] drop-shadow-lg animate-bounce" 
                    style={{ animationDuration: "2s" }} 
                  />
                </div>

                {/* Note */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 rounded-lg p-2 text-center text-[12px] text-[#6B7280]">
                  💡 استخدم GPS لتحديد موقعك الحالي
                </div>
              </div>

              {/* Selected Address Preview */}
              <div className="mt-4 bg-[#F9FAFB] p-4 rounded-[10px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[12px] text-[#6B7280]">العنوان المحدد:</div>
                  {accuracy && (
                    <div className={`text-[11px] font-medium ${getAccuracyColor()}`}>
                      {getAccuracyLabel()} ({Math.round(accuracy)}م)
                    </div>
                  )}
                </div>
                <div className="text-[14px] text-[#1A1A1A] line-clamp-2">
                  {address || 'جاري تحديد العنوان...'}
                </div>
                <div className="text-[11px] text-[#9CA3AF] font-mono mt-1">
                  {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!address}
                className="w-full h-[52px] bg-gradient-to-r from-[#E5A04D] to-[#D4903D] text-white text-[16px] font-bold rounded-xl mt-4 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(229,160,77,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                تأكيد الموقع
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
