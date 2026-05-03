export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 min-w-[80px]">
              <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Orders List Skeleton */}
      <div className="px-4 pb-24 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="mt-3 flex gap-2">
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
