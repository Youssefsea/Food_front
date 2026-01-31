import { MapPin } from 'lucide-react';

export function Header({ city }: { city: string | null }) {
  return (
    <header className="fixed  left-1.5 right-1.5 bg-white z-50 max-h-max shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-[#1A1A1A]">اكتشف وجبتك</h1>
        <div className="flex items-center gap-2 text-[#6B7280]">
          <MapPin className="w-5 h-5 text-[#E5A04D]" />
          <span>{city || "الموقع غير معروف"}</span>
        </div>
      </div>
    </header>
  );
}
