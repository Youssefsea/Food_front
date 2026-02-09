'use client';

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div 
        className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#FEF3E2' }}
      >
        <ShoppingBag className="w-12 h-12" style={{ color: '#E5A04D' }} />
      </div>
      <h3 
        className="mb-2"
        style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1A1A1A' }}
      >
        لا توجد طلبات بعد
      </h3>
      <p 
        className="mb-6 text-center"
        style={{ fontSize: '0.875rem', color: '#6B7280' }}
      >
        ابدأ باستكشاف المطاعم وقم بطلبك الأول
      </p>
      <button 
        onClick={() => router.push('/explore')}
        className="px-6 py-3 rounded-lg transition-all active:scale-[0.98] min-h-[44px]"
        style={{ 
          backgroundColor: '#E5A04D',
          color: 'white',
          fontWeight: 500
        }}
      >
        استكشف المطاعم
      </button>
    </div>
  );
}
