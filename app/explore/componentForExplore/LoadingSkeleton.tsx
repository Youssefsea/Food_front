export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-[#E5E7EB]"></div>

          {/* Content Skeleton */}
          <div className="p-4">
            {/* Title */}
            <div className="h-6 bg-[#E5E7EB] rounded-lg mb-2 w-3/4"></div>
            {/* Description */}
            <div className="h-4 bg-[#E5E7EB] rounded-lg mb-3 w-full"></div>

            {/* Rating & Distance */}
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 bg-[#E5E7EB] rounded-lg w-12"></div>
              <div className="h-4 bg-[#E5E7EB] rounded-lg w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
