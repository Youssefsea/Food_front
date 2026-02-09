"use client";

import { ChevronLeft, Eye, EyeOff, Check, User, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import api from "../../axios";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();

  const [userType, setUserType] = useState<"customer" | "vendor">("customer");


  const [loginMsg, setLoginMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginForCustomer = async (): Promise<boolean> => {
    try {
      const res = await api.post('/customer/login', { ...formData });
    
      if (res.status === 200) {
        if (res.data?.user?.token) {
          localStorage.removeItem('token');
          localStorage.removeItem('vendorToken');
          localStorage.setItem('customerToken', res.data.user.token);
        }
        return true;
      }
      return false;
    } catch {
      setErrorMsg("فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.");
      return false;
    }
  };


  const loginForVendor = async (): Promise<boolean> => {
    try {
      const res = await api.post('/restaurant/login', { ...formData });
      if (res.status === 200) {
        if (res.data?.restaurant?.token) {
          localStorage.removeItem('token');
          localStorage.removeItem('customerToken');
          localStorage.setItem('vendorToken', res.data.restaurant.token);
        }
        return true;
      }
      return false;
    } catch {
      setErrorMsg("فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.")
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setLoginMsg("");
    setErrorMsg("");

    let successForCustomer = false;
let successForVendor = false;
    if (userType === "customer") {
      successForCustomer = await loginForCustomer();
    } else {
      successForVendor = await loginForVendor();
    }


    setTimeout(() => {
      setIsLoading(false);

      if (successForCustomer) {
        setLoginMsg("تم تسجيل الدخول بنجاح.");
        setTimeout(() => {
          router.push('/explore');
        }, 1000);
      } else if (successForVendor) {
        setLoginMsg("تم تسجيل الدخول بنجاح.");
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 1000);
      }
    }, 1500);
  };



  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6" style={{ margin: '10px' }}>
      <div className="bg-white rounded-2xl sm:rounded-3xl min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col shadow-sm">
        <header className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <span className="text-gray-800 font-medium text-lg">تسجيل الدخول</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            مرحباً بعودتك
          </h1>
          <p className="text-gray-500 text-start">
            سجّل دخولك للمتابعة.
          </p>

          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              نوع الحساب
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setUserType("customer")}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${userType === "customer"
                  ? "border-[#E5A04D] bg-orange-50 text-[#E5A04D]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">زبون</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("vendor")}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${userType === "vendor"
                  ? "border-[#E5A04D] bg-orange-50 text-[#E5A04D]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">مطعم</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors bg-transparent outline-none"
                />
                {isValidEmail(formData.email) && (
                  <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.password.length >= 6 && (
                  <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />
                )}
              </div>
            </div>



            <div style={{ marginBottom: '1rem' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-[#E5A04D] text-[20px] hover:bg-[#D4903D] text-white font-semibold transition-colors disabled:opacity-70"
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
              <div className="mt-2 text-center min-h-[24px]">
                {isLoading && (
                  <p className="text-gray-400 text-sm animate-pulse">

                  </p>
                )}

                {!isLoading && loginMsg && (
                  <p className="text-green-500 text-sm">
                    {loginMsg}
                  </p>
                )}

                {!isLoading && errorMsg && (
                  <p className="text-red-500 text-sm">
                    {errorMsg}
                  </p>
                )}
              </div>




            </div>

            <p className="text-center text-gray-500 text-sm">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-[#E5A04D] font-medium hover:underline">
                سجّل الآن
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
