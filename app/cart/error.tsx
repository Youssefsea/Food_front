'use client';

import { useRouter } from "next/navigation";

export default function CartError({
  reset,
}: {
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4" dir="rtl">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md w-full text-center">
        <p className="text-lg font-bold text-[#1A1A2E] mb-2">تعذر تحميل السلة</p>
        <p className="text-sm text-[#6B7280] mb-4">يمكنك المحاولة مرة أخرى أو الرجوع للصفحة السابقة.</p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-[#E5A04D] text-white font-semibold hover:bg-[#D4903D] transition-colors"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl border border-gray-200 text-[#1A1A2E] font-semibold hover:bg-gray-50 transition-colors"
          >
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
}
