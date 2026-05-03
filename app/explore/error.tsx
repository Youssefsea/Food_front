'use client';

export default function ExploreError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4" dir="rtl">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md w-full text-center">
        <p className="text-lg font-bold text-[#1A1A2E] mb-2">حدث خطأ أثناء تحميل صفحة الاستكشاف</p>
        <p className="text-sm text-[#6B7280] mb-4">حاول مرة أخرى، وإن استمرت المشكلة أعد فتح التطبيق.</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-[#E5A04D] text-white font-semibold hover:bg-[#D4903D] transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
