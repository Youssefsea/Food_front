'use client';

import { useEffect, useState, useCallback } from 'react';
import { Toggle } from './Toggle';
import { MapPin, Truck, Map, Locate, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { reverseGeocode, forwardGeocode } from '../utils/geocoding';

const LocationPicker = dynamic(() => import('../../../signup/vendor/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl" />,
});

interface LocationData {
  location?: string;
  allowed_radius_km?: number;
  delivery_fees?: number;
  latitude?: number | null;
  longitude?: number | null;
}

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

interface LocationPricingTabProps {
  data: LocationData;
  onChange: (data: Partial<LocationData>) => void;
}

export function LocationPricingTab({ data, onChange }: LocationPricingTabProps) {
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<Coordinates>({ 
    lat: data.latitude || null, 
    lng: data.longitude || null 
  });
  const [locationMessage, setLocationMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const fetchCoordsFromLocation = async () => {
      if (data.latitude && data.longitude) {
        setCoords({ lat: data.latitude, lng: data.longitude });
        return;
      }

      if (data.location && !data.latitude && !data.longitude) {
        const result = await forwardGeocode(data.location);
        if (result) {
          setCoords({ lat: result.lat, lng: result.lng });
          onChange({ 
            latitude: result.lat, 
            longitude: result.lng 
          });
        }
      }
    };

    fetchCoordsFromLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeliveryToggle = (enabled: boolean) => {
    setDeliveryEnabled(enabled);
  };

  const handleGetCurrentLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationMessage(null);

    if (!('geolocation' in navigator)) {
      setLocationMessage({ type: 'error', text: 'المتصفح لا يدعم تحديد الموقع' });
      setIsLocating(false);
      return;
    }

    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setLocationMessage({ 
        type: 'error', 
        text: 'تحديد الموقع يتطلب اتصال آمن (HTTPS). يرجى استخدام الخريطة بدلاً من ذلك.' 
      });
      setIsLocating(false);
      return;
    }

    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setLocationMessage({ 
            type: 'error', 
            text: 'تم رفض إذن الموقع. يرجى تفعيل صلاحية الموقع من إعدادات المتصفح أو استخدم الخريطة.' 
          });
          setIsLocating(false);
          return;
        }
      } catch {
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        const locationName = await reverseGeocode(latitude, longitude);
        
        setCoords({ lat: latitude, lng: longitude });
        
        onChange({ 
          location: locationName, 
          latitude: latitude,
          longitude: longitude
        });
        
        setLocationMessage({ type: 'info', text: '📍 تم تحديد الموقع - اضغط "حفظ التغييرات" للتأكيد' });
        setTimeout(() => setLocationMessage(null), 5000);
        
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'تعذر الوصول إلى موقعك الحالي';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض إذن الموقع. يرجى السماح بالوصول للموقع من إعدادات المتصفح أو استخدم الخريطة.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'خدمة الموقع غير متاحة حالياً. تأكد من تفعيل GPS أو استخدم الخريطة.';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع. حاول مرة أخرى أو استخدم الخريطة.';
            break;
        }
        
        setLocationMessage({ type: 'error', text: errorMessage });
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }, [onChange]);

  const handleLocationChange = useCallback(async (lat: number, lng: number) => {
    const locationName = await reverseGeocode(lat, lng);
    
    setCoords({ lat, lng });
    
    onChange({ 
      location: locationName,
      latitude: lat,
      longitude: lng
    });
    
    setLocationMessage({ type: 'info', text: '📍 تم تحديد الموقع - اضغط "حفظ التغييرات" للتأكيد' });
    setTimeout(() => setLocationMessage(null), 5000);
  }, [onChange]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-7">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#E5A04D]" />
            موقع المطعم
          </h3>
          <p className="text-sm text-[#6B7280]">الموقع الذي يظهر للعملاء</p>
        </div>

        {locationMessage && (
          <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
            locationMessage.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : locationMessage.type === 'info'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {locationMessage.text}
          </div>
        )}

        <div className="space-y-5">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-[#E5A04D] text-[#E5A04D] hover:bg-orange-50 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Locate className="w-4 h-4" />
              )}
              {isLocating ? 'جاري التحديد...' : 'تحديد موقعي الحالي'}
            </button>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Map className="w-4 h-4" />
              تحديد على الخريطة
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-[#1A1A1A] mb-2 flex items-center gap-2">
              📍 عنوان المطعم الحالي
            </label>
            <div className="w-full min-h-12 px-4 py-3 border border-[#E5E7EB] rounded-[10px] text-sm bg-[#F8FAFC] text-[#374151]">
              {data.location || 'لم يتم تحديد العنوان بعد'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              الموقع على الخريطة
            </label>
            <div className="w-full h-64 border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#E5A04D] mx-auto mb-3" />
                {coords.lat && coords.lng ? (
                  <>
                    <p className="text-sm text-[#6B7280] mb-1">الإحداثيات:</p>
                    <p className="text-sm font-mono text-[#1A1A1A] mb-2">
                      {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-[#E5A04D]">
                      نطاق التوصيل: {data.allowed_radius_km || 15} كم
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#9CA3AF]">لم يتم تحديد الموقع</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">خط العرض (Latitude)</label>
              <input
                type="text"
                value={coords.lat?.toFixed(6) || 'N/A'}
                readOnly
                className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-sm font-mono text-[#6B7280]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">خط الطول (Longitude)</label>
              <input
                type="text"
                value={coords.lng?.toFixed(6) || 'N/A'}
                readOnly
                className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-sm font-mono text-[#6B7280]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-7">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">إعدادات التوصيل</h3>
          <p className="text-sm text-[#6B7280]">حدد نطاق ورسوم التوصيل</p>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#E5A04D]" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#1A1A1A]">خدمة التوصيل</h4>
                <p className="text-[13px] text-[#6B7280]">تفعيل التوصيل للعملاء</p>
              </div>
            </div>
            <Toggle enabled={deliveryEnabled} onChange={handleDeliveryToggle} />
          </div>
        </div>

        {deliveryEnabled && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                أقصى مسافة للتوصيل <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
              </label>
              <div className="flex items-end gap-4">
                <div className="w-32">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={data.allowed_radius_km || ''}
                    onChange={(e) => onChange({ ...data, allowed_radius_km: Number(e.target.value) || 0 })}
                    className="w-full h-12 px-4 border border-[#E5E7EB] rounded-[10px] text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]"
                  />
                  <p className="text-xs text-[#9CA3AF] text-center mt-1">كم</p>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={data.allowed_radius_km || 15}
                    onChange={(e) => onChange({ ...data, allowed_radius_km: Number(e.target.value) })}
                    className="w-full h-2 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer accent-[#E5A04D]"
                  />
                  <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                    <span>1 كم</span>
                    <span>50 كم</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                رسوم التوصيل <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
              </label>
              <div className="relative w-48">
                <input
                  type="number"
                  min="0"
                  value={data.delivery_fees ?? ''}
                  onChange={(e) => onChange({ ...data, delivery_fees: Number(e.target.value) || 0 })}
                  placeholder="20"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">
                  ج.م
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">سيتم إضافة هذا المبلغ على كل طلب توصيل</p>
            </div>
          </div>
        )}
      </div>

      {showMap && (
        <LocationPicker
          lat={coords.lat || 30.0444}
          lng={coords.lng || 31.2357}
          radiusKm={data.allowed_radius_km || 15}
          onLocationChange={handleLocationChange}
          onClose={() => setShowMap(false)}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}