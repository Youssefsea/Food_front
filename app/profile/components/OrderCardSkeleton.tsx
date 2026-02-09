'use client';

export function OrderCardSkeleton() {
  return (
    <div 
      className="bg-white rounded-[16px] shadow-md overflow-hidden mx-4 mb-4"
      style={{ borderColor: '#E5E7EB', borderWidth: '1px' }}
    >
      <div className="p-4 pb-3 flex items-start gap-3">
        <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gray-200 animate-pulse" />
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 animate-pulse rounded mb-2" style={{ width: '60%' }} />
          <div className="h-3 bg-gray-200 animate-pulse rounded" style={{ width: '40%' }} />
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 16px' }} />

      <div className="p-4 py-3">
        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" style={{ width: '80%' }} />
        <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '12px 0 8px' }} />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: '30%' }} />
          <div className="h-5 bg-gray-200 animate-pulse rounded" style={{ width: '35%' }} />
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 16px' }} />

      <div className="p-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: '30%' }} />
          <div className="h-6 bg-gray-200 animate-pulse rounded-full" style={{ width: '35%' }} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-11 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}
