'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  RestaurantInfoTab,
  LocationPricingTab,
  AccountSecurityTab,
} from './components';
import { generateCirclePolygon } from './utils/geocoding';
import { ArrowRight, Save, Loader2, CheckCircle, XCircle, Store, MapPin, Shield } from 'lucide-react';

interface RestaurantData {
  name: string;
  email: string;
  phone: string;
  description: string;
  location: string;
  allowed_radius_km: number;
  open_time: string;
  close_time: string;
  delivery_fees: number;
  latitude?: number | null;
  longitude?: number | null;
}

type TabType = 'info' | 'location' | 'security';

export default function EditRestaurantSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [originalData, setOriginalData] = useState<RestaurantData>({
    name: '',
    email: '',
    phone: '',
    description: '',
    location: '',
    allowed_radius_km: 15,
    open_time: '',
    close_time: '',
    delivery_fees: 0,
    latitude: null,
    longitude: null,
  });

  const [formData, setFormData] = useState<RestaurantData>({
    name: '',
    email: '',
    phone: '',
    description: '',
    location: '',
    allowed_radius_km: 15,
    open_time: '',
    close_time: '',
    delivery_fees: 0,
    latitude: null,
    longitude: null,
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/restaurant/profile');
      const profile = res.data.restaurantProfile;

      const data: RestaurantData = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        description: profile.description || '',
        location: profile.location || '',
        allowed_radius_km: parseFloat(profile.allowed_radius_km) || 15,
        open_time: profile.open_time || '',
        close_time: profile.close_time || '',
        delivery_fees: profile.delivery_fees || 0,
        latitude: null,
        longitude: null,
      };

      setOriginalData(data);
      setFormData(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const { latitude: fLat, longitude: fLng, ...formWithoutCoords } = formData;
    const { latitude: oLat, longitude: oLng, ...originalWithoutCoords } = originalData;

    const basicChanged = JSON.stringify(formWithoutCoords) !== JSON.stringify(originalWithoutCoords);
    const locationChanged = (fLat !== oLat) || (fLng !== oLng);

    setHasChanges(basicChanged || locationChanged);
  }, [formData, originalData]);

  const handleChange = (newData: Partial<RestaurantData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const infoChanged =
        formData.name !== originalData.name ||
        formData.phone !== originalData.phone ||
        formData.email !== originalData.email ||
        formData.description !== originalData.description ||
        formData.open_time !== originalData.open_time ||
        formData.close_time !== originalData.close_time ||
        formData.delivery_fees !== originalData.delivery_fees;

      const locationChanged =
        formData.location !== originalData.location ||
        formData.latitude !== originalData.latitude ||
        formData.longitude !== originalData.longitude ||
        formData.allowed_radius_km !== originalData.allowed_radius_km;

      const promises: Promise<unknown>[] = [];

      if (infoChanged) {
        promises.push(
          api.put('/restaurant/change-info', {
            description: formData.description,
            location: formData.location,
            allowed_radius_km: Number(formData.allowed_radius_km),
            open_time: formData.open_time,
            close_time: formData.close_time,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            delivery_fees: formData.delivery_fees,
          })
        );
      }

      if (locationChanged && formData.latitude && formData.longitude) {
        const deliveryPolygon = generateCirclePolygon(
          formData.latitude,
          formData.longitude,
          formData.allowed_radius_km
        );

        promises.push(
          api.put('/restaurant/update-location', {
            req_latitude: formData.latitude,
            req_longitude: formData.longitude,
            allowed_radius_km: Number(formData.allowed_radius_km),
            delivery_area: deliveryPolygon,
            area_name: JSON.stringify(formData.location).split(',')[1] || formData.location,
            can_deliver: true,
            can_reserve: true,
            location: formData.location,
          })
        );

      }

      if (promises.length > 0) {
        await Promise.all(promises);
        setOriginalData({ ...formData });
        setSuccessMessage('تم حفظ التغييرات بنجاح');
      } else {
        setSuccessMessage('لا توجد تغييرات لحفظها');
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'حدث خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...originalData });
    setError(null);
    setSuccessMessage(null);
  };

  const tabs = [
    { id: 'info' as TabType, label: 'معلومات المطعم', icon: Store },
    { id: 'location' as TabType, label: 'الموقع والتوصيل', icon: MapPin },
    { id: 'security' as TabType, label: 'الحساب والأمان', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5A04D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => router.push('/restaurant/dashboard')}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="hidden sm:inline">العودة للوحة التحكم</span>
            </button>

            {/* Title */}
            <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              إعدادات المطعم
            </h1>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                hasChanges && !saving
                  ? 'bg-[#E5A04D] text-white hover:bg-[#D4922F] shadow-md hover:shadow-lg'
                  : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </div>
      </header>
              

      {/* Notifications */}
      {(error || successMessage) && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          {error && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
              <p className="text-sm text-[#EF4444]">{error}</p>
              <button onClick={() => setError(null)} className="mr-auto text-[#EF4444] hover:text-[#DC2626]">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
          {successMessage && (
            <div className="bg-[#D1FAE5] border border-[#10B981] rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
              <p className="text-sm text-[#065F46]">{successMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-35 flex items-center h-7 justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#E5A04D] text-white shadow-md'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'info' && (
            <RestaurantInfoTab data={formData} onChange={handleChange} />
          )}
          {activeTab === 'location' && (
            <LocationPricingTab data={formData} onChange={handleChange} />
          )}
          {activeTab === 'security' && (
            <AccountSecurityTab data={formData} onChange={handleChange} />
          )}
     

        </div>
       

        {/* Floating Actions - Mobile */}
    {hasChanges && (
  <div className="fixed bottom-4 left-2 right-2 bg-white/80 border-t border-gray-200 p-2 sm:hidden z-50 backdrop-blur-sm rounded-xl animate-slide-up">
    <div className="flex gap-2">
      <button
        onClick={handleReset}
        className="flex-1 h-8 border border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
      >
        إلغاء
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex-1 h-8 bg-orange-400 text-white rounded-lg font-semibold text-sm hover:bg-orange-500 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ"}
      </button>
    </div>
  </div>
)}


        {/* Changes Indicator */}
        {hasChanges && (
          <div className="hidden sm:block fixed bottom-6 left-6 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#E5A04D] rounded-full animate-pulse"></div>
              <span className="text-sm">لديك تغييرات غير محفوظة</span>
              <button
                onClick={handleReset}
                className="text-xs text-[#9CA3AF] hover:text-white underline"
              >
                تراجع
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}
