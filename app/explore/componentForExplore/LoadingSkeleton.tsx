export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-32 sm:h-36 md:h-40 bg-[#E5E7EB]">
            <div className="flex h-full gap-0.5">
              <div className="flex-1 bg-[#D1D5DB]" />
              <div className="flex-1 bg-[#E5E7EB]" />
              <div className="flex-1 bg-[#D1D5DB]" />
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-9 sm:w-10 h-9 sm:h-10 bg-[#E5E7EB] rounded-full" />
              <div className="flex-1">
                <div className="h-4 sm:h-5 bg-[#E5E7EB] rounded-lg w-3/4 mb-1.5" />
                <div className="h-3 sm:h-3.5 bg-[#F3F4F6] rounded-lg w-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="h-3.5 sm:h-4 bg-[#E5E7EB] rounded-lg w-12" />
              <div className="h-3.5 sm:h-4 bg-[#F3F4F6] rounded-lg w-20" />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="h-3 sm:h-3.5 bg-[#F3F4F6] rounded-lg w-16" />
              <div className="h-3 sm:h-3.5 bg-[#F3F4F6] rounded-lg w-20" />
            </div>

            <div className="border-t border-[#E5E7EB] pt-2 sm:pt-3">
              <div className="h-3 bg-[#E5E7EB] rounded-lg w-20 mb-2" />
              <div className="flex gap-2 sm:gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-20 sm:w-24">
                    <div className="h-16 sm:h-20 bg-[#E5E7EB] rounded-lg sm:rounded-xl mb-1.5" />
                    <div className="h-2.5 bg-[#F3F4F6] rounded w-full mb-1" />
                    <div className="h-3 bg-[#E5E7EB] rounded w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
