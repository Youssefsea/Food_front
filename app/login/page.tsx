"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Store, Mail, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { customerLogin, vendorLogin, adminLogin } from "@/services/auth.service";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";
import { getUserRole, isAuthenticated } from "@/lib/api";

type UserType = "customer" | "vendor" ;

const roleConfig = {
  customer: { label: "زبون", icon: User, gradient: "from-[#FF6B35] to-[#E63946]" },
  vendor: { label: "مطعم", icon: Store, gradient: "from-[#E63946] to-[#C62828]" },
};

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [userType, setUserType] = useState<UserType>("customer");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordIsValid = formData.password.length >= 6;

  useEffect(() => {
    if (!isAuthenticated()) return;
    const role = getUserRole();
    if (role === 'customer') router.replace('/explore');
    else if (role === 'restaurant') router.replace('/restaurant/dashboard');
  }, [router]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "بريد إلكتروني غير صالح";
    if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
    else if (formData.password.length < 6) newErrors.password = "كلمة المرور قصيرة جداً";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validate()) return;

    setIsLoading(true);

    try {
      if (userType === "customer") {
        await customerLogin(formData);
        toast.success("مرحباً بك! جاري التحويل...");
        refreshUser();
        setTimeout(() => router.push("/customer/home"), 800);
      } else if (userType === "vendor") {
        await vendorLogin(formData);
        toast.success("مرحباً بك! جاري التحويل...");
        refreshUser();
        setTimeout(() => router.push("/restaurant/dashboard"), 800);
      } 
    } catch {
      toast.error("فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Top Gradient Bar */}
      <div className="h-2 gradient-primary" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-extrabold text-gradient">أكلي</span>
            <span className="text-3xl mr-1">🍕</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[420px] animate-slideUp">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Role Selector */}
            <div className="flex border-b border-gray-100">
              {(Object.entries(roleConfig) as [UserType, typeof roleConfig.customer][]).map(
                ([key, config]) => {
                  const Icon = config.icon;
                  const active = userType === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { setUserType(key); setErrors({}); }}
                      className={cn(
                        "flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 relative",
                        active ? "text-primary" : "text-muted hover:text-[var(--text-secondary)]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{config.label}</span>
                      {active && (
                        <div className={cn("absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-gradient-to-r", config.gradient)} />
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">مرحباً بك</h1>
                <p className="text-sm text-muted">سجل دخول لتطلب أكلك المفضل</p>
              </div>

              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                error={errors.email}
                rightIcon={<Mail className="w-4 h-4" />}
                showValidCheck
                isValid={emailIsValid}
              />

              <Input
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: undefined }); }}
                error={errors.password}
                rightIcon={<Lock className="w-4 h-4" />}
              />
              <div className="min-h-5" />
            

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading || !emailIsValid || !passwordIsValid}
              >
                تسجيل الدخول
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-[var(--text-light)]">أو</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Signup Link */}
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-[var(--color-primary)]/5 transition-all duration-200"
              >
                <span>إنشاء حساب جديد</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Link>
            </form>
          </div>

          {/* Footer dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            <div className="w-8 h-1 rounded-full bg-[var(--color-primary)]" />
            <div className="w-8 h-1 rounded-full bg-gray-100" />
            <div className="w-8 h-1 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
