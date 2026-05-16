"use client";

import { ChevronRight, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api, { getUserRole, isAuthenticated } from "@/lib/api";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CustomerSignUpPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", role: "customer",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [signUpMsg, setSignUpMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "email" | "phone" | "password" | "otp", string>>>({});

  useEffect(() => {
    if (!isAuthenticated()) return;
    const role = getUserRole();
    if (role === "customer") router.replace("/customer/home");
    else if (role === "restaurant") router.replace("/restaurant/dashboard");
    else if (role === "admin") router.replace("/admin/payments");
  }, [router]);

  // ✅ تعريف واحد نضيف لـ err مع status
  const sendOtp = async () => {
    try {
      const res = await api.post("/customer/send-otp", { email: formData.email, phone: formData.phone });
      if (res.status === 200) return true;
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

  const signupForCustomer = async () => {
    try {
      const res = await api.post("/customer/signup", { ...formData, otp });
      if (res.status === 201) {
        setSignUpMsg("تم التسجيل بنجاح. يمكنك الآن تسجيل الدخول.");
        return 1;
      }
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      if (err.response?.data?.error === "Invalid or expired OTP") {
        setErrorMsg("رمز التحقق غير صحيح أو منتهي الصلاحية.");
      } else {
        setErrorMsg("فشل تسجيل الاشتراك. يرجى التحقق من بياناتك.");
      }
      return 0;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validateStepOne = () => {
    const nextErrors: typeof fieldErrors = {};
    if (formData.name.trim().length < 3) nextErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = "البريد الإلكتروني غير صالح";
    if (!/^0\d{10,}$/.test(formData.phone.replace(/\s/g, ""))) nextErrors.phone = "رقم الهاتف غير صالح";
    if (formData.password.length < 6) nextErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!validateStepOne()) return;
    setIsLoading(true);
    const success = await sendOtp();
    setIsLoading(false);
    if (success) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (otp.length !== 6) {
      setFieldErrors((prev) => ({ ...prev, otp: "أدخل رمز التحقق المكون من 6 أرقام" }));
      return;
    }
    setIsLoading(true);
    const result = await signupForCustomer();
    if (result === 1) {
      setTimeout(() => { setIsLoading(false); router.push("/login"); }, 2000);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <div className="h-2 bg-gradient-to-r from-primary to-secondary" />

      <header className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto w-full">
        {step === 2 ? (
          <button onClick={() => { setStep(1); setErrorMsg(""); }}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-dark">
              <ChevronRight className="w-4 h-4" />
              رجوع
            </span>
          </button>
        ) : (
          <Link href="/signup" className="p-2 rounded-full hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-dark" />
          </Link>
        )}
        <span className="text-dark font-bold text-base">تسجيل زبون</span>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <div className="bg-surface rounded-card shadow-card p-6">
          <p className="text-xs sm:text-sm text-muted text-right mb-4">
            {step === 1 ? "الخطوة 1 من 2" : "الخطوة 2 من 2"}
          </p>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-dark mb-1">إنشاء حساب</h1>
              <p className="text-sm text-muted mb-6">
                أدخل بياناتك للتسجيل كزبون.{" "}
                <Link href="/login" className="text-primary font-semibold">لديك حساب؟</Link>
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input label="الاسم الكامل" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="أحمد محمد" required error={fieldErrors.name}
                  className="bg-transparent outline-none" />

                <Input label="البريد الإلكتروني" type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="example@email.com" required error={fieldErrors.email}
                  className="bg-transparent outline-none" />

                <Input label="رقم الهاتف" type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="01012345678" required error={fieldErrors.phone}
                  className="bg-transparent outline-none" />

                <Input label="كلمة المرور" type="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••" required error={fieldErrors.password}
                  className="bg-transparent outline-none" />

                {errorMsg && (
                  <p className="text-sm text-secondary text-center bg-secondary/10 rounded-input px-3 py-2">
                    {errorMsg}
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                  إرسال رمز التحقق
                </Button>

                <p className="text-center text-muted text-xs">
                  بالتسجيل أنت توافق على{" "}
                  <Link href="/terms" className="text-dark underline">الشروط والأحكام</Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-dark mb-1">التحقق من البريد</h1>
                <p className="text-sm text-muted text-center">
                  تم إرسال رمز مكون من 6 أرقام إلى
                  <br />
                  <span className="font-semibold text-dark">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-2 text-right">
                    رمز التحقق
                  </label>
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
                          const merged = next.join("").slice(0, 6);
                          setOtp(merged);
                          setFieldErrors((prev) => ({ ...prev, otp: undefined }));
                          // ✅ auto-focus للخانة الجاية
                          if (value && index < 5) {
                            const inputs = document.querySelectorAll<HTMLInputElement>('input[inputMode="numeric"]');
                            inputs[index + 1]?.focus();
                          }
                        }}
                        className="w-10 h-12 rounded-input border border-muted/30 bg-transparent text-dark text-center text-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                      />
                    ))}
                  </div>
                  {fieldErrors.otp && (
                    <p className="text-xs text-secondary mt-2 text-right">{fieldErrors.otp}</p>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-sm text-secondary text-center bg-secondary/10 rounded-input px-3 py-2">
                    {errorMsg}
                  </p>
                )}
                {signUpMsg && (
                  <p className="text-sm text-accent text-center bg-accent/10 rounded-input px-3 py-2">
                    {signUpMsg}
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth
                  isLoading={isLoading} disabled={otp.length !== 6}>
                  تسجيل
                </Button>

                <p className="text-center text-muted text-sm">
                  لم يصلك الرمز؟{" "}
                  <button type="button" onClick={async () => {
                    setErrorMsg(""); setOtp(""); setIsLoading(true);
                    await sendOtp(); setIsLoading(false);
                  }} disabled={isLoading} className="text-primary font-semibold disabled:opacity-50">
                    إعادة الإرسال
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
