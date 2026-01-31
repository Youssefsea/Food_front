import { Search } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function EmptyState({ 
  message = 'لا توجد مطاعم قريبة منك',
  onClearFilters,
  hasActiveFilters = false
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4">
        <Search className="w-12 h-12 text-[#9CA3AF]" />
      </div>
      <h3 className="text-[#1A1A1A] text-lg font-bold mb-2 text-center">
        {message}
      </h3>
      <p className="text-[#9CA3AF] text-sm text-center max-w-xs mb-6">
        جرب تغيير الموقع أو الفلاتر للعثور على المطاعم المتاحة
      </p>
      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 bg-[#E5A04D] text-white rounded-xl text-sm font-medium hover:bg-[#D4903D] transition-colors shadow-md"
        >
          مسح الفلاتر
        </button>
      )}
    </div>
  );
}
