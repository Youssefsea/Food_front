'use client';
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

const Skeleton = memo(function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton-shimmer rounded-card', className)}
      style={{ width, height }}
    />
  );
});

export const SkeletonText = memo(function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-button h-3"
          style={{ width: i === lines - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
});

export const SkeletonAvatar = memo(function SkeletonAvatar({ size = 48 }: { size?: number }) {
  return <div className="skeleton-shimmer rounded-full" style={{ width: size, height: size }} />;
});

export const SkeletonCard = memo(function SkeletonCard() {
  return <Skeleton className="h-32 w-full" />;
});

export const SkeletonRestaurantCard = memo(function SkeletonRestaurantCard() {
  return (
    <div className="bg-white rounded-card overflow-hidden border border-gray-100">
      <Skeleton className="h-36 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-button" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16 rounded-button" />
          <Skeleton className="h-3 w-20 rounded-button" />
        </div>
        <Skeleton className="h-3 w-full rounded-button" />
      </div>
    </div>
  );
});

export const SkeletonRestaurantGrid = memo(function SkeletonRestaurantGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRestaurantCard key={i} />
      ))}
    </div>
  );
});

// Legacy aliases
export const RestaurantCardSkeleton = SkeletonRestaurantCard;
export const SkeletonDishCard = memo(function SkeletonDishCard() {
  return (
    <div className="bg-white rounded-card border border-gray-100 flex gap-3 p-3">
      <Skeleton className="w-20 h-20 rounded-card shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-button" />
        <Skeleton className="h-3 w-full rounded-button" />
        <Skeleton className="h-4 w-16 rounded-button" />
      </div>
    </div>
  );
});
export const DishCardSkeleton = SkeletonDishCard;
export const CategoryChipSkeleton = memo(function CategoryChipSkeleton() {
  return <Skeleton className="h-8 w-24 rounded-full" />;
});

export default Skeleton;
