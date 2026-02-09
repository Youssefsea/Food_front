"use client";

import { ChevronLeft, Eye, EyeOff, Check, Clock, MapPin, ChevronRight, ChevronsRight, Locate, Map } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api from "../../../axios";

import { useRouter } from "next/navigation";

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl" />,
});

export default function VendorSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    description: "",
    location: "",
    latitude: 30.0444, // Default Cairo
    longitude: 31.2357,
    allowed_radius_km: 5,
    open_time: "09:00",
    close_time: "22:00",
    area_name: "",
    can_deliver: true,
    can_reserve: true,
    delivery_area: "[[30.0444, 31.2357], [30.0444, 31.2367], [30.0454, 31.2367], [30.0454, 31.2357], [30.0444, 31.2357]]",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState("");

  const [showManualCoords, setShowManualCoords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: prev.location || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }));
  };


  useEffect(() => {
    if (!formData.latitude || !formData.longitude) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${formData.latitude}&lon=${formData.longitude}&format=json`
        );
        const data = await res.json();
        setLocationName(data.display_name);
      } catch (err) {
        setLocationName("تعذر تحديد الموقع");
      }
    };

    fetchLocation();
  }, [formData.latitude, formData.longitude]);




  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9]{10,}$/.test(phone.replace(/\s/g, ""));
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            location: prev.location || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setIsLocating(false);
        },
        (error) => {
          alert("تعذر الوصول إلى موقعك الحالي. يرجى التحقق من إعدادات المتصفح.");
          setIsLocating(false);
        }
      );
    } else {
      alert("المتصفح لا يدعم تحديد الموقع.");
      setIsLocating(false);
    }
  };

  const nextStep = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateCirclePolygon = (lat: number, lng: number, radiusKm: number) => {
  const points = 64;
  const coords = [];
  const earthRadius = 6371;

  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const rad = (angle * Math.PI) / 180;

    const dLat = (radiusKm / earthRadius) * (180 / Math.PI) * Math.cos(rad);
    const dLng = (radiusKm / earthRadius) * (180 / Math.PI) * Math.sin(rad) / Math.cos(lat * Math.PI / 180);

    coords.push([
      lng + dLng,
      lat + dLat
    ]);
  }

  return coords;
};



  const signUpForVendor = async (data:any) => {
    try {
      const res = await api.post("/restaurant/signup", data);
      if (res.status == 201) {
      }
    }
    catch (error) {
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Auto-generate delivery polygon
      const deliveryPolygon = generateCirclePolygon(
        formData.latitude,
        formData.longitude,
        Number(formData.allowed_radius_km) || 5
      );

      // Prepare payload exactly as backend expects
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        description: formData.description,
        location: locationName,
        req_latitude: formData.latitude,
        req_longitude: formData.longitude,
        allowed_radius_km: Number(formData.allowed_radius_km),
        open_time: formData.open_time,
        close_time: formData.close_time,
        area_name: formData.area_name,
        can_deliver: formData.can_deliver,
        can_reserve: formData.can_reserve,
        delivery_area: deliveryPolygon
      };

      await signUpForVendor(payload);

      setTimeout(() => {
        setIsLoading(false);
      router.push('/login');
     
      }, 2000);

    } catch (error) {
      setIsLoading(false);
    }
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">اسم المطعم</label>
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="مطعم الشرق"
            required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
          />
          {formData.name.length >= 3 && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">البريد الإلكتروني</label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="restaurant@email.com"
            required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
          />
          {isValidEmail(formData.email) && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">رقم الهاتف</label>
        <div className="relative">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01012345678"
            required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
          />
          {isValidPhone(formData.phone) && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">كلمة المرور</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••"
            required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {formData.password.length >= 6 && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
      </div>
    </div>
  );

  // Step 2: Details & Location
  const renderStep2 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">الوصف</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="وصف مختصر عن المطعم..."
          className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base transition-colors resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <label className="text-xs text-gray-400 uppercase tracking-wide">الموقع</label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="flex-1 py-3 px-4 rounded-xl border border-[#E5A04D] text-[#E5A04D] hover:bg-orange-50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLocating ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Locate className="w-4 h-4" />
            )}
            تحديد موقعي الحالي
          </button>
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4" />
            تحديد على الخريطة
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            disabled
            name="location"
            value={locationName}
            onChange={handleChange}
            placeholder="العنوان التفصيلي (اسم الشارع، رقم المبنى...)"
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base"
          />
          <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">اسم المنطقة</label>
        <input
          type="text"
          name="area_name"
          value={formData.area_name}
          onChange={handleChange}
          placeholder="المعادي، التجمع..."
          className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base"
        />
      </div>
    </div>
  );

  // Step 3: Operations
  const renderStep3 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-wide">وقت الفتح</label>
          <input
            type="time"
            name="open_time"
            value={formData.open_time}
            onChange={handleChange}
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base dir-ltr"
          />
        </div>
        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-wide">وقت الإغلاق</label>
          <input
            type="time"
            name="close_time"
            value={formData.close_time}
            onChange={handleChange}
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base dir-ltr"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">نطاق التوصيل (كم)</label>
        <div className="relative">
          <input
            type="number"
            name="allowed_radius_km"
            value={formData.allowed_radius_km}
            onChange={handleChange}
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base"
          />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">كم</span>
        </div>
        <p className="text-[10px] text-gray-400">سيتم تحديد منطقة التوصيل تلقائياً بناءً على هذا النطاق حول موقع المطعم.</p>
      </div>

      <div className="flex gap-8 pt-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.can_deliver ? 'bg-[#E5A04D] border-[#E5A04D]' : 'border-gray-300 group-hover:border-[#E5A04D]'}`}>
            {formData.can_deliver && <Check className="w-4 h-4 text-white" />}
          </div>
          <input
            type="checkbox"
            name="can_deliver"
            checked={formData.can_deliver}
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-gray-700 font-medium select-none">يقبل التوصيل</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.can_reserve ? 'bg-[#E5A04D] border-[#E5A04D]' : 'border-gray-300 group-hover:border-[#E5A04D]'}`}>
            {formData.can_reserve && <Check className="w-4 h-4 text-white" />}
          </div>
          <input
            type="checkbox"
            name="can_reserve"
            checked={formData.can_reserve}
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-gray-700 font-medium select-none">يقبل الحجز</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col shadow-sm max-w-lg mx-auto w-full relative overflow-hidden">

        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <Link href={step === 1 ? "/signup" : "#"} onClick={step > 1 ? prevStep : undefined} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-gray-800 font-semibold text-lg">
              {step === 1 && "بيانات الحساب"}
              {step === 2 && "تفاصيل المطعم"}
              {step === 3 && "إعدادات التشغيل"}
            </span>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-300 ${s <= step ? 'w-6 bg-[#E5A04D]' : 'w-2 bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 ? "أنشئ حسابك" : "أكمل البيانات"}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 && "أدخل بياناتك الأساسية للبدء"}
              {step === 2 && "أخبرنا المزيد عن مطعمك وموقعه"}
              {step === 3 && "حدد أوقات العمل وخدماتك"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="pt-4 flex gap-3">
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={(e) => nextStep(e)}
                  className="flex-1 py-4 rounded-xl bg-[#E5A04D] hover:bg-[#D4903D] text-white font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-100"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-xl bg-[#E5A04D] hover:bg-[#D4903D] text-white font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-100 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isLoading ? "جاري التسجيل..." : "إتمام التسجيل"}
                </button>
              )}
            </div>
          </form>
        </main>
      </div>

      {showMap && (
        <LocationPicker
          lat={formData.latitude}
          lng={formData.longitude}
          radiusKm={formData.allowed_radius_km}
          onLocationChange={handleLocationChange}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}
