import { SkeletonRestaurantGrid } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 sm:px-5 py-6" dir="rtl">
      <SkeletonRestaurantGrid count={8} />
    </div>
  );
}
