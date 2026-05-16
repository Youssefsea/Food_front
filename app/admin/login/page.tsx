"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { adminLogin } from "@/services/auth.service";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setIsLoading(true);
    try {
      await adminLogin(formData);
      toast.success("مرحباً بك!");
      refreshUser();
      setTimeout(() => router.push("/admin/payments"), 800);
    } catch {
      toast.error("بيانات الاعتماد غير صحيحة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#252540] flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm animate-slideUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-[#FF6B35]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">لوحة الإدارة</h1>
          <p className="text-sm text-white/50">أكلي — Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-5">
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="admin@akly.app"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock className="w-4 h-4" />}
          />

          <Button type="submit" variant="secondary" size="lg" fullWidth isLoading={isLoading}>
            تسجيل الدخول
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-xs text-white/40 hover:text-white/60 transition-colors">
            ← العودة لتسجيل الدخول العادي
          </Link>
        </div>
      </div>
    </div>
  );
}
