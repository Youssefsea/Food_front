'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Intentionally left blank to avoid exposing runtime internals in production.
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">حدث خطأ غير متوقع</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-5">تعذر تحميل هذه الصفحة حالياً.</p>
        <button
          onClick={reset}
          className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
