export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32" dir="rtl">
      {/* Header */}
      <div className="px-5 py-4">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Cart Items */}
      <div className="px-5 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center justify-between mt-4">
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="mx-5 mt-6 bg-white rounded-2xl p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="border-t pt-3 flex justify-between">
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Checkout Button Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
