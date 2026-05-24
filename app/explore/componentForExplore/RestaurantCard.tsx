'use client';

import { MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Dish {
  id:    number;
  name:  string;
  price: number;
  image: string;
}

interface RestaurantCardProps {
  id:              number;
  restaurant_name?: string;
  location:        string;
  latitude?:       number;
  longitude?:      number;
  can_deliver:     boolean;
  can_reserve:     boolean;
  distance?:       number;
  isNearby?:       boolean;
  dishes?:         Dish[];
  description?:    string;
  delivery_fees?:  number;
  minOrder?:       number;
  isOpen?:         boolean;
  tags?:           string[];
}

// ─── RestaurantCard ───────────────────────────────────────────────────────────
export function RestaurantCard({
  id,
  restaurant_name,
  location,
  can_reserve,
  isNearby,
  dishes = [],
  delivery_fees,
  isOpen = true,
  tags = [],
}: RestaurantCardProps) {
  const displayName  = restaurant_name || 'مطعم';
  const displayDishes = dishes.slice(0, 3);

  return (
    <Link
      href={`/restaurant/${restaurant_name ? encodeURIComponent(restaurant_name) : id}`}
      className="block"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl active:shadow-md transition-all duration-200 sm:hover:-translate-y-1 active:scale-[0.98] sm:active:scale-100 cursor-pointer">

        {/* Cover */}
        <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
          {displayDishes.length >= 3 ? (
            <div className="flex h-full gap-0.5">
              {displayDishes.map((dish, index) => (
                <div key={dish.id ?? index} className="flex-1 overflow-hidden relative">
                  <Image
                    src={dish.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg'}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : displayDishes.length > 0 ? (
            <Image
              src={displayDishes[0]?.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg'}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FEF3E2] to-[#FDE8C9] flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Open/Closed badge */}
          <div
            className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl text-[10px] sm:text-xs font-semibold shadow-sm ${
              isOpen ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'
            }`}
          >
            {isOpen ? (
              <span className="flex items-center gap-0.5 sm:gap-1">
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                مفتوح
              </span>
            ) : (
              'مغلق'
            )}
          </div>

          {/* Nearby badge */}
          {isNearby && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/60 backdrop-blur-sm text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1">
              <MapPin className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              قريب
            </div>
          )}

          {/* Reservation badge */}
          {can_reserve && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#EDE9FE] text-[#8B5CF6] rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-semibold flex items-center gap-0.5 sm:gap-1 shadow-sm">
              <Calendar className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              يقبل الحجز
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          {/* Name & Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center bg-gradient-to-br from-[#E5A04D] to-[#D4903D] text-white font-bold text-base sm:text-lg flex-shrink-0">
              {displayName.charAt(0)}
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A] truncate flex-1">
              {displayName}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs sm:text-[13px] text-[#6B7280] mb-2 sm:mb-3">
            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 overflow-hidden mb-2 sm:mb-3">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FEF3E2] text-[#E5A04D] rounded-lg text-[10px] sm:text-[11px] font-medium whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Featured dishes */}
          {displayDishes.length > 0 && (
            <div className="border-t border-[#E5E7EB] pt-2 sm:pt-3 mt-2 sm:mt-3">
              <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] mb-2 flex items-center gap-1.5">
                <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-gradient-to-b from-[#E5A04D] to-[#D4903D] rounded-full" />
                وجبات مميزة
              </p>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-1">
                {displayDishes.map((dish) => (
                  <div key={dish.id} className="flex-shrink-0 w-20 sm:w-24">
                    <div className="relative h-16 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden mb-1 sm:mb-1.5 shadow-sm">
                      <Image
                        src={dish.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg'}
                        alt={dish.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-[#1A1A1A] truncate mb-0.5">
                      {dish.name}
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-[#E5A04D]">
                      {dish.price} ج.م
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}