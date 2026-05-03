export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24" dir="rtl">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
        </div>
        {/* Tabs Skeleton */}
        <div className="flex border-b border-gray-100 max-w-2xl mx-auto">
          <div className="flex-1 py-3 flex justify-center">
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex-1 py-3 flex justify-center">
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Order Cards Skeleton */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
