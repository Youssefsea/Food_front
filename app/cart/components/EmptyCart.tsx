'use client';

import { ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyCart() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col" dir="rtl">
      <div className="bg-white h-[60px] px-5 flex items-center justify-between border-b border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
          onClick={() => router.back()}
        >
          <ArrowRight className="w-6 h-6 text-[#1A1A1A]" />
        </button>
        <span className="text-[20px] font-bold text-[#1A1A1A]">سلة المشتريات</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-[120px] h-[120px] rounded-full bg-[#F3F4F6] flex items-center justify-center mb-6">
          <ShoppingCart className="w-16 h-16 text-[#E5E7EB]" />
        </div>

        <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-3">
          سلتك فارغة
        </h1>

        <p className="text-[16px] text-[#6B7280] text-center mb-8 max-w-[300px]">
          ابدأ بإضافة أطباقك المفضلة من المطاعم القريبة
        </p>

        <button
          onClick={() => router.push("/explore")}
          className="bg-gradient-to-r from-[#E5A04D] to-[#D4903D] text-white px-8 py-4 rounded-xl text-[16px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(229,160,77,0.4)] flex items-center gap-2"
        >
          <span className="text-[20px]">🍕</span>
          <span>تصفح المطاعم</span>
        </button>
      </div>
    </div>
  );
}
