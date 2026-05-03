"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Store, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getUserRole, isAuthenticated } from "@/lib/api";

type AccountType = "customer" | "vendor" | null;

const accountTypes = [
  {
    type: "customer" as const,
    icon: User,
    title: "زبون",
    description: "اطلب أكلك المفضل من أفضل المطاعم القريبة منك",
    features: ["تصفح المطاعم", "اطلب واتوصل", "تابع طلبك"],
    gradient: "from-[#FF6B35] to-[#E63946]",
    bgLight: "bg-orange-50",
  },
  {
    type: "vendor" as const,
    icon: Store,
    title: "مطعم / بائع",
    description: "سجّل مطعمك واستقبل طلبات من آلاف العملاء",
    features: ["لوحة تحكم", "إدارة الأطباق", "تتبع الطلبات"],
    gradient: "from-[#E63946] to-[#C62828]",
    bgLight: "bg-red-50",
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  useEffect(() => {
    if (!isAuthenticated()) return;
    const role = getUserRole();
    if (role === 'customer') router.replace('/customer/home');
    else if (role === 'restaurant') router.replace('/restaurant/dashboard');
    else if (role === 'admin') router.replace('/admin/payments');
  }, [router]);

  const handleContinue = () => {
    if (selectedType === "customer") router.push("/signup/customer");
    else if (selectedType === "vendor") router.push("/signup/vendor");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]" dir="rtl">
      {/* Top gradient */}
      <div className="h-2 gradient-primary" />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </Link>
        <span className="text-[var(--text-primary)] font-bold text-base">إنشاء حساب</span>
        <div className="w-9" />
      </header>

      <main className="px-5 pb-8 max-w-lg mx-auto">
        {/* Title */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">مرحباً بك في أكلي 🍕</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            اختر نوع حسابك للمتابعة.{" "}
            <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
              لديك حساب بالفعل؟
            </Link>
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="space-y-4 mb-8">
          {accountTypes.map((account) => {
            const Icon = account.icon;
            const isSelected = selectedType === account.type;

            return (
              <button
                key={account.type}
                onClick={() => setSelectedType(account.type)}
                className={cn(
                  "w-full p-5 rounded-2xl border-2 transition-all duration-300 text-right group",
                  isSelected
                    ? "border-[var(--color-primary)] bg-white shadow-lg shadow-orange-500/10"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      isSelected
                        ? `bg-gradient-to-br ${account.gradient} text-white shadow-md`
                        : `${account.bgLight} text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]`
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{account.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">{account.description}</p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {account.features.map((feature) => (
                        <span
                          key={feature}
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors",
                            isSelected
                              ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                              : "bg-gray-100 text-[var(--text-muted)]"
                          )}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Radio */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all",
                      isSelected ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-gray-300"
                    )}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-[var(--bg-card-muted)] border border-[var(--border-soft)] rounded-xl p-4 mb-8 animate-fadeIn">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {selectedType === "vendor" ? (
              <>
                <span className="font-bold text-[var(--text-primary)]">ملاحظة للمطاعم:</span>{" "}
                سيتم مراجعة طلبك والتحقق من بياناتك قبل تفعيل حسابك. قد يستغرق ذلك 24-48 ساعة.
              </>
            ) : (
              <>
                <span className="font-bold text-[var(--text-primary)]">كيف يعمل؟</span>{" "}
                اختر نوع حسابك، أكمل بياناتك، وابدأ في طلب أو استقبال طلبات الوجبات.
              </>
            )}
          </p>
        </div>

        {/* Continue Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedType}
          onClick={handleContinue}
          className={cn(!selectedType && "!opacity-40")}
        >
          <span>متابعة</span>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Button>
      </main>
    </div>
  );
}
