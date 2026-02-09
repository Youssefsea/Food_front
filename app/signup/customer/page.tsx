"use client";

import { ChevronLeft, Eye, EyeOff, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import api from "../../../axios";
import { useRouter } from "next/navigation";
export default function CustomerSignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });
    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
const [SignUpMsg, setSignUpMsg] = useState("");
const SignupForCustomer=async () => 
  {

try
{
const res=await api.post('/customer/signup',{...formData});
if (res.status === 201) {

  setSignUpMsg("تم التسجيل بنجاح. يمكنك الآن تسجيل الدخول.");
  return 1;
}

}
catch(error){
  if(error.response.data.error=="User already exists")
    {
     
      setErrorMsg("المستخدم موجود بالفعل. يرجى تسجيل الدخول.");
      return 0;
  }
  else{
   
  setErrorMsg("فشل تسجيل الاشتراك. يرجى التحقق من بياناتك .");
  return 0;
}
}

}



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9]{10,}$/.test(phone.replace(/\s/g, ""));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

  const bool=  await SignupForCustomer();
  if(bool==1){
   setTimeout(() => {
    setIsLoading(false);
    router.push('/login');
  }, 2000);
  }

else{
  setIsLoading(false);

}


}

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col shadow-sm">
        <header className="flex items-center justify-between px-4 py-4">
          <Link href="/signup" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <span className="text-gray-800 font-medium text-lg">تسجيل زبون</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            إنشاء حساب
          </h1>
          <p className="text-gray-500 text-sm">
          أدخل بياناتك للتسجيل كزبون.{" "}
          <Link href="/login" className="text-[#E5A04D]">
            لديك حساب؟
          </Link>        </p>
       
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=""
                className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
              />
              {formData.name.length >= 3 && (
                <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />
              )}
            </div>
          </div>

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
                className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
              />
              {isValidEmail(formData.email) && (
                <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />
              )}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=""
                className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
              />
              {isValidPhone(formData.phone) && (
                <Check className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5A04D]" />
              )}
            </div>
          </div>

         
          <div style={{ marginBottom: '3rem' }}>
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
                className="w-full py-3 border-b border-gray-200 focus:border-[#E5A04D] text-gray-800 text-lg transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
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
              className="w-full py-4 rounded-full bg-[#E5A04D] text-[20px] hover:bg-[#D4903D] text-white font-semibold  transition-colors disabled:opacity-70"
            >
              {isLoading ? "جاري التسجيل..." : "تسجيل"}
            </button>
            <div className="mt-2 text-center">
              {errorMsg && (
                <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
              )}
            </div>
            <div className="mt-2 text-center">
              {SignUpMsg && (
                <p className="text-green-500 text-sm mt-2">{SignUpMsg}</p>
              )}
            </div>
          </div>

          <p className="text-center text-gray-500 text-xs pb-4">
            بالتسجيل أنت توافق على{" "}
            <Link href="/terms" className="text-gray-700 underline">
              الشروط والأحكام
            </Link>{" "}
            و{" "}
            <Link href="/privacy" className="text-gray-700 underline">
              سياسة الخصوصية
            </Link>
          </p>
        </form>
      </main>
      </div>
    </div>
  );
}
