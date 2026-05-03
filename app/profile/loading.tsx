export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24" dir="rtl">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-center max-w-2xl mx-auto">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Wallet Card Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-28 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Orders Section Skeleton */}
        <div className="mt-6 space-y-3">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
