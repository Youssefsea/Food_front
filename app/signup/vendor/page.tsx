"use client";

import { ChevronRight, Eye, EyeOff, Check, MapPin, Locate, Map, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import api, { getUserRole, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-[250px] md:h-[400px] w-full bg-gray-100 animate-pulse rounded-xl" />,
});

export default function VendorSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4; // ✅ أضفنا step 4 للـ OTP

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    description: "",
    location: "",
    latitude: 30.0444,
    longitude: 31.2357,
    allowed_radius_km: 5,
    open_time: "09:00",
    close_time: "22:00",
    area_name: "",
    can_deliver: true,
    can_reserve: true,
  });

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    if (!isAuthenticated()) return;
    const role = getUserRole();
    if (role === "customer") router.replace("/customer/home");
    else if (role === "restaurant") router.replace("/restaurant/dashboard");
    else if (role === "admin") router.replace("/admin/payments");
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: prev.location || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
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
      } catch {
        setLocationName("تعذر تحديد الموقع");
      }
    };
    fetchLocation();
  }, [formData.latitude, formData.longitude]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{10,}$/.test(phone.replace(/\s/g, ""));

  const handleGetCurrentLocation = () => {
    setErrorMsg("");
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            location: prev.location || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
          setIsLocating(false);
        },
        () => {
          setErrorMsg("تعذر الوصول إلى موقعك الحالي. يرجى التحقق من إعدادات المتصفح.");
          setIsLocating(false);
        }
      );
    } else {
      setErrorMsg("المتصفح لا يدعم تحديد الموقع.");
      setIsLocating(false);
    }
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (formData.name.trim().length < 3) errors.name = "اسم المطعم يجب أن يكون 3 أحرف على الأقل";
      if (!isValidEmail(formData.email)) errors.email = "البريد الإلكتروني غير صالح";
      if (!isValidPhone(formData.phone)) errors.phone = "رقم الهاتف غير صالح";
      if (formData.password.length < 6) errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    if (step === 2) {
      if (!formData.area_name.trim()) errors.area_name = "اسم المنطقة مطلوب";
      if (!locationName.trim()) errors.location = "يرجى تحديد الموقع";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateCirclePolygon = (lat: number, lng: number, radiusKm: number) => {
    const points = 64;
    const coords = [];
    const earthRadius = 6371;
    for (let i = 0; i <= points; i++) {
      const angle = (i * 360) / points;
      const rad = (angle * Math.PI) / 180;
      const dLat = (radiusKm / earthRadius) * (180 / Math.PI) * Math.cos(rad);
      const dLng = ((radiusKm / earthRadius) * (180 / Math.PI) * Math.sin(rad)) / Math.cos((lat * Math.PI) / 180);
      coords.push([lng + dLng, lat + dLat]);
    }
    return coords;
  };

  // ✅ بعت الـ OTP للإيميل
  const sendOtp = async () => {
    try {
      const res = await api.post("/restaurant/send-otp", {
        email: formData.email,
        phone: formData.phone,
      });
      return res.status === 200;
    } catch (error) {
      const err = error as { response?: { data?: { error?: string }; status?: number } };
      if (err.response?.data?.error === "Email or phone already exists") {
        setErrorMsg("البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً.");
      } else if (err.response?.status === 429) {
        setErrorMsg("تم إرسال الرمز مسبقاً، انتظر دقيقة قبل إعادة المحاولة.");
      } else {
        setErrorMsg("فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.");
      }
      return false;
    }
  };

  const nextStep = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg("");
    if (!validateStep()) return;

    // ✅ لما نوصل Step 3 وننتهي، نبعت الـ OTP وننتقل لـ Step 4
    if (step === 3) {
      setIsLoading(true);
      const success = await sendOtp();
      setIsLoading(false);
      if (!success) return;
    }

    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    if (step > 1) setStep(step - 1);
  };

  // ✅ Submit النهائي بعد التحقق من الـ OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (otp.length !== 6) {
      setFieldErrors((prev) => ({ ...prev, otp: "أدخل رمز التحقق المكون من 6 أرقام" }));
      return;
    }

    setIsLoading(true);

    try {
      const deliveryPolygon = generateCirclePolygon(
        formData.latitude,
        formData.longitude,
        Number(formData.allowed_radius_km) || 5
      );

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        description: formData.description,
        location: locationName,
        allowed_radius_km: Number(formData.allowed_radius_km),
        open_time: formData.open_time,
        close_time: formData.close_time,
        area_name: formData.area_name,
        can_deliver: formData.can_deliver,
        can_reserve: formData.can_reserve,
        delivery_area: deliveryPolygon,
        otp, // ✅ بنبعت الـ OTP للباك اند
      };

      await api.post("/restaurant/signup", payload);

      setTimeout(() => {
        setIsLoading(false);
        router.push("/login");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const err = error as { response?: { data?: { error?: string }; status?: number } };
      if (err.response?.data?.error === "Invalid OTP" || err.response?.data?.error === "OTP expired or not found") {
        setErrorMsg("رمز التحقق غير صحيح أو منتهي الصلاحية.");
      } else if (err.response?.data?.error === "Email or phone already exists") {
        setErrorMsg("البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً.");
      } else {
        setErrorMsg("فشل التسجيل. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">اسم المطعم</label>
        <div className="relative">
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="مطعم الشرق" required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors" />
          {formData.name.length >= 3 && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
        {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">البريد الإلكتروني</label>
        <div className="relative">
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="restaurant@email.com" required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors" />
          {isValidEmail(formData.email) && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
        {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">رقم الهاتف</label>
        <div className="relative">
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="01012345678" required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors" />
          {isValidPhone(formData.phone) && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
        {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">كلمة المرور</label>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
            onChange={handleChange} placeholder="••••••" required
            className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {formData.password.length >= 6 && <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />}
        </div>
        {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">الوصف</label>
        <textarea name="description" value={formData.description} onChange={handleChange}
          placeholder="وصف مختصر عن المطعم..."
          className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base transition-colors resize-none"
          rows={3} />
      </div>

      <div className="space-y-4">
        <label className="text-xs text-gray-400 uppercase tracking-wide">الموقع</label>
        <div className="flex gap-3">
          <button type="button" onClick={handleGetCurrentLocation} disabled={isLocating}
            className="flex-1 py-3 px-4 rounded-xl border border-[#E5A04D] text-[#E5A04D] hover:bg-orange-50 font-medium text-sm transition-colors flex items-center justify-center gap-2">
            {isLocating
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <Locate className="w-4 h-4" />}
            تحديد موقعي الحالي
          </button>
          <button type="button" onClick={() => setShowMap(true)}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors flex items-center justify-center gap-2">
            <Map className="w-4 h-4" />
            تحديد على الخريطة
          </button>
        </div>
        <div className="relative">
          <input type="text" disabled value={locationName}
            placeholder="العنوان التفصيلي (اسم الشارع، رقم المبنى...)"
            className="w-full py-2 border-b border-gray-200 text-gray-800 text-base" />
          <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {fieldErrors.location && <p className="text-xs text-red-500">{fieldErrors.location}</p>}
      </div>

      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">اسم المنطقة</label>
        <input type="text" name="area_name" value={formData.area_name} onChange={handleChange}
          placeholder="المعادي، التجمع..."
          className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base" />
        {fieldErrors.area_name && <p className="text-xs text-red-500">{fieldErrors.area_name}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-wide">وقت الفتح</label>
          <input type="time" name="open_time" value={formData.open_time} onChange={handleChange}
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base" />
        </div>
        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-wide">وقت الإغلاق</label>
          <input type="time" name="close_time" value={formData.close_time} onChange={handleChange}
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs text-gray-400 uppercase tracking-wide">نطاق التوصيل (كم)</label>
        <div className="relative">
          <input type="number" name="allowed_radius_km" value={formData.allowed_radius_km} onChange={handleChange}
            className="w-full py-2 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-base" />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">كم</span>
        </div>
        <p className="text-[10px] text-gray-400">سيتم تحديد منطقة التوصيل تلقائياً بناءً على هذا النطاق حول موقع المطعم.</p>
      </div>

      <div className="flex gap-8 pt-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.can_deliver ? "bg-[#E5A04D] border-[#E5A04D]" : "border-gray-300 group-hover:border-[#E5A04D]"}`}>
            {formData.can_deliver && <Check className="w-4 h-4 text-white" />}
          </div>
          <input type="checkbox" name="can_deliver" checked={formData.can_deliver} onChange={handleChange} className="hidden" />
          <span className="text-gray-700 font-medium select-none">يقبل التوصيل</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.can_reserve ? "bg-[#E5A04D] border-[#E5A04D]" : "border-gray-300 group-hover:border-[#E5A04D]"}`}>
            {formData.can_reserve && <Check className="w-4 h-4 text-white" />}
          </div>
          <input type="checkbox" name="can_reserve" checked={formData.can_reserve} onChange={handleChange} className="hidden" />
          <span className="text-gray-700 font-medium select-none">يقبل الحجز</span>
        </label>
      </div>
    </div>
  );

  // ✅ Step 4 الجديد — OTP
  const renderStep4 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-[#E5A04D]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">التحقق من البريد</h2>
        <p className="text-sm text-gray-500 text-center">
          تم إرسال رمز مكون من 6 أرقام إلى
          <br />
          <span className="font-semibold text-gray-800">{formData.email}</span>
        </p>
      </div>

      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-3 text-right">رمز التحقق</label>
        <div className="flex justify-center gap-2" dir="ltr">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                const next = otp.split("");
                next[index] = value;
                setOtp(next.join("").slice(0, 6));
                setFieldErrors((prev) => ({ ...prev, otp: undefined }));
                // ✅ auto-focus للخانة الجاية
                if (value && index < 5) {
                  const inputs = document.querySelectorAll<HTMLInputElement>('input[inputMode="numeric"]');
                  inputs[index + 1]?.focus();
                }
              }}
              className="w-10 h-12 rounded-xl border border-gray-200 bg-transparent text-gray-800 text-center text-2xl focus:ring-2 focus:ring-[#E5A04D]/30 focus:border-[#E5A04D] outline-none transition-all"
            />
          ))}
        </div>
        {fieldErrors.otp && <p className="text-xs text-red-500 mt-2 text-right">{fieldErrors.otp}</p>}
      </div>

      <p className="text-center text-gray-500 text-sm">
        لم يصلك الرمز؟{" "}
        <button type="button" disabled={isLoading}
          onClick={async () => { setErrorMsg(""); setOtp(""); setIsLoading(true); await sendOtp(); setIsLoading(false); }}
          className="text-[#E5A04D] font-semibold disabled:opacity-50">
          إعادة الإرسال
        </button>
      </p>
    </div>
  );

  const stepTitles = ["بيانات الحساب", "تفاصيل المطعم", "إعدادات التشغيل", "التحقق من البريد"];
  const stepLabels = ["المعلومات الأساسية", "الموقع", "إعدادات التوصيل", "التحقق"];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col shadow-sm max-w-lg mx-auto w-full relative overflow-hidden">

        <header className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <Link href={step === 1 ? "/signup" : "#"} onClick={step > 1 ? (e) => { e.preventDefault(); prevStep(); } : undefined}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-gray-800 font-semibold text-lg">{stepTitles[step - 1]}</span>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s}
                  className={`h-1 rounded-full transition-all duration-300 ${s <= step ? "w-6 bg-[#E5A04D]" : "w-2 bg-gray-200"}`} />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 flex-wrap justify-center">
              {stepLabels.map((label, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={step === i + 1 ? "text-[#E5A04D] font-semibold" : ""}>{label}</span>
                  {i < stepLabels.length - 1 && <span>•</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {step < 4 && (
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
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {errorMsg && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl text-right">{errorMsg}</p>
            )}

            <div className="pt-4">
              {step < totalSteps ? (
                <button type="button" onClick={(e) => nextStep(e)} disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-[#E5A04D] hover:bg-[#D4903D] text-white font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-100 disabled:opacity-70">
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{step === 3 ? "إرسال رمز التحقق" : "التالي"}</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button type="submit" disabled={isLoading || otp.length !== 6}
                  className="w-full py-4 rounded-xl bg-[#E5A04D] hover:bg-[#D4903D] text-white font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-orange-100 disabled:opacity-70 disabled:active:scale-100">
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