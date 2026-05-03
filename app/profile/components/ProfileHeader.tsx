'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" style={{ height: '56px' }}>
      <div className="flex items-center justify-between h-full px-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-full active:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" style={{ color: '#1A1A1A' }} />
        </button>
        
        <h1 className="absolute left-1/2 -translate-x-1/2" style={{ color: '#1A1A1A', fontWeight: 600 }}>
          حسابي
        </h1>
        
     
      </div>
    </header>
  );
}
