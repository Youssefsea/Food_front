'use client';

import { ArrowRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartHeaderProps {
  itemCount: number;
  onClearCart: () => void;
  hasItems: boolean;
}

export function CartHeader({ itemCount, onClearCart, hasItems }: CartHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 bg-white h-[60px] px-5 flex items-center justify-between border-b border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button 
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors"
        onClick={() => router.back()}
      >
        <ArrowRight className="w-6 h-6 text-[#1A1A1A]" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[20px] font-bold text-[#1A1A1A]">سلة المشتريات</span>
        <span className="bg-[#FEF3E2] text-[#E5A04D] px-2.5 py-1 rounded-xl text-[12px] font-semibold">
          {itemCount} أصناف
        </span>
      </div>

      {hasItems ? (
        <button
          onClick={onClearCart}
          className="flex items-center gap-1 text-[#EF4444] text-[13px] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>إفراغ</span>
        </button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  );
}
