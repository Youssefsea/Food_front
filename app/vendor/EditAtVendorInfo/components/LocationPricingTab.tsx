'use client';

import { useState } from 'react';
import { Toggle } from './Toggle';
import { MapPin, Truck } from 'lucide-react';

interface LocationData {
  location?: string;
  allowed_radius_km?: number;
  delivery_fees?: number;
}

interface LocationPricingTabProps {
  data: LocationData;
  onChange: (data: Partial<LocationData>) => void;
}

export function LocationPricingTab({ data, onChange }: LocationPricingTabProps) {
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);

  const handleDeliveryToggle = (enabled: boolean) => {
    setDeliveryEnabled(enabled);
  };

  // Parse location if it's a string (e.g., "30.0444,31.2357")
  const parseLocation = (location: string) => {
    if (!location) return { lat: '', lng: '' };
    const parts = location.split(',');
    return {
      lat: parts[0]?.trim() || '',
      lng: parts[1]?.trim() || '',
    };
  };

  const coords = parseLocation(data.location || '');

  return (
    <div className="space-y-6">
      {/* Location Section - Editable ✓ */}
      <div className="bg-white rounded-2xl shadow-sm p-7">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#E5A04D]" />
            موقع المطعم
          </h3>
          <p className="text-sm text-[#6B7280]">الموقع الذي يظهر للعملاء</p>
        </div>

        <div className="space-y-5">
          {/* Location Input - Editable ✓ */}
          <div>
            <label className="text-sm font-medium text-[#1A1A1A] mb-2 flex items-center gap-2">
              📍 إحداثيات الموقع <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              placeholder="مثال: 30.0444,31.2357"
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">أدخل الإحداثيات بصيغة: خط العرض,خط الطول</p>
          </div>

          {/* Map Preview Placeholder */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              الموقع على الخريطة
            </label>
            <div className="w-full h-[280px] border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#E5A04D] mx-auto mb-3" />
                <p className="text-sm text-[#6B7280] mb-2">الإحداثيات الحالية:</p>
                {coords.lat && coords.lng ? (
                  <p className="text-sm font-mono text-[#1A1A1A]">
                    {coords.lat}, {coords.lng}
                  </p>
                ) : (
                  <p className="text-sm text-[#9CA3AF]">لم يتم تحديد الموقع</p>
                )}
              </div>
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">خط العرض (Latitude)</label>
              <input
                type="text"
                value={coords.lat}
                readOnly
                className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-sm font-mono text-[#6B7280]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">خط الطول (Longitude)</label>
              <input
                type="text"
                value={coords.lng}
                readOnly
                className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-sm font-mono text-[#6B7280]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Settings - Partially Editable */}
      <div className="bg-white rounded-2xl shadow-sm p-7">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">إعدادات التوصيل</h3>
          <p className="text-sm text-[#6B7280]">حدد نطاق ورسوم التوصيل</p>
        </div>

        {/* Enable Delivery Toggle */}
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
            {/* Delivery Radius - Editable ✓ */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                أقصى مسافة للتوصيل <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
              </label>
              <div className="flex items-end gap-4">
                <div className="w-32">
                  <input
                    type="number"
                    min="1"
                    max="50"                    value={data.allowed_radius_km || ''}
                    onChange={(e) => onChange({ ...data, allowed_radius_km: Number(e.target.value) || 0 })}
                    className="w-full h-12 px-4 border border-[#E5E7EB] rounded-[10px] text-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]"
                  />
                  <p className="text-xs text-[#9CA3AF] text-center mt-1">كم</p>
                </div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="50"                    value={data.allowed_radius_km || 15}
                    onChange={(e) => onChange({ ...data, allowed_radius_km: Number(e.target.value) })}
                    className="w-full h-2 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to left, #E5E7EB ${100 - (Number(data.allowed_radius_km || 15) / 50) * 100}%, #E5A04D ${100 - (Number(data.allowed_radius_km || 15) / 50) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
                    <span>1 كم</span>
                    <span>50 كم</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Fees - Editable ✓ */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                رسوم التوصيل <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
              </label>              <div className="relative w-48">
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

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #E5A04D;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #E5A04D;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
