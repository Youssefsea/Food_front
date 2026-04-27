'use client';

interface OrdersFiltersProps {

  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function OrdersFilters({
 
  
  statusFilter,
  onStatusFilterChange,
}: OrdersFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-4 mb-5 flex items-center gap-6 flex-wrap">

      {/* Status Filter Tabs */}
      <div className="flex gap-2.5 bg-[#F3F4F6] p-1 rounded-lg">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-[#E5A04D] text-white'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => onStatusFilterChange('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-[#E5A04D] text-white'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          ⏳ قيد الانتظار
        </button>
        <button
          onClick={() => onStatusFilterChange('cooking')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'cooking'
              ? 'bg-[#E5A04D] text-white'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          🍳 جاري التحضير
        </button>
        <button
          onClick={() => onStatusFilterChange('delivering')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'delivering'
              ? 'bg-[#E5A04D] text-white'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          🚗 جاري التوصيل
        </button>
        <button
          onClick={() => onStatusFilterChange('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'completed'
              ? 'bg-[#E5A04D] text-white'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          ✅ مكتمل
        </button>
      </div>
    </div>
  );
}
