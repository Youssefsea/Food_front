"use client";

import { ChevronLeft, User, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"customer" | "vendor" | null>(null);

  const handleContinue = () => {
    if (selectedType === "customer") {
      router.push("/signup/customer");
    } else if (selectedType === "vendor") {
      router.push("/signup/vendor");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col shadow-sm">
        <header className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <span className="text-gray-800 font-medium text-lg">إنشاء حساب</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            مرحباً بك
          </h1>
          <p className="text-gray-500 text-sm">
            اختر نوع حسابك للمتابعة.{" "}
            <Link href="/login" className="text-[#E5A04D] hover:underline">
              لديك حساب بالفعل؟
            </Link>
          </p>
        </div>

        <div className="space-y-3 mb-6">
         
          <button
            onClick={() => setSelectedType("customer")}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
              selectedType === "customer"
                ? "border-[#E5A04D] bg-orange-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                selectedType === "customer"
                  ? "bg-[#E5A04D] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <User className="w-6 h-6" />
            </div>
            <div className="text-right flex-1">
              <h3 className="text-base font-semibold text-gray-800">زبون</h3>
              <p className="text-gray-500 text-xs">
                احجز وجباتك مسبقاً من المطاعم المفضلة
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selectedType === "customer"
                  ? "bg-[#E5A04D] border-[#E5A04D]"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedType === "customer" && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

        
          <button
            onClick={() => setSelectedType("vendor")}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
              selectedType === "vendor"
                ? "border-[#E5A04D] bg-orange-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                selectedType === "vendor"
                  ? "bg-[#E5A04D] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Store className="w-6 h-6" />
            </div>
            <div className="text-right flex-1">
              <h3 className="text-base font-semibold text-gray-800">مطعم / بائع</h3>
              <p className="text-gray-500 text-xs">
                سجّل مطعمك واستقبل حجوزات الوجبات
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selectedType === "vendor"
                  ? "bg-[#E5A04D] border-[#E5A04D]"
                  : "border-gray-300 bg-white"
              }`}
            >
              {selectedType === "vendor" && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        </div>

     
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-xs leading-relaxed">
            {selectedType === "vendor" ? (
              <>
                <span className="font-semibold text-gray-800">ملاحظة للمطاعم:</span>{" "}
                سيتم مراجعة طلبك والتحقق من بياناتك قبل تفعيل حسابك. قد يستغرق ذلك 24-48 ساعة.
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-800">كيف يعمل؟</span>{" "}
                اختر نوع حسابك، أكمل بياناتك، وابدأ في حجز أو استقبال طلبات الوجبات المسبقة.
              </>
            )}
          </p>
        </div>
      </main>    
      <div className="px-4 sm:px-6 py-4 pb-6">
        <button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`w-full py-4 rounded-full text-2xl text-white font-semibold transition-all duration-200 ${
            selectedType
              ? "bg-[#E5A04D] hover:bg-[#D4903D]  active:scale-[0.98]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          متابعة
        </button>
      </div>
      </div>
    </div>
  );
}
