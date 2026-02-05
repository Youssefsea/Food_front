'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, Clock, DollarSign, Calendar, Truck } from 'lucide-react';
import Link from 'next/link';

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface RestaurantCardProps {
  id: number;
  name?: string;
  restaurant_name?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  can_deliver: boolean;
  can_reserve: boolean;
  distance?: number;
  isNearby?: boolean;
  dishes?: Dish[];
  description?: string;
  delivery_fees?: number;
  minOrder?: number;
  isOpen?: boolean;
  tags?: string[];
}

export function RestaurantCard({
  id,
  restaurant_name,
  location,
  can_deliver,
  can_reserve,
  isNearby,
  dishes = [],
  description,
  delivery_fees,
  isOpen = true,
  tags = [],
}: RestaurantCardProps) {
 
  const displayName = restaurant_name || 'مطعم';
  const displayDishes = dishes.slice(0, 3);


  return (
    <Link href={`/restaurant/${restaurant_name ? encodeURIComponent(restaurant_name) : id}`} className="block">
      <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl active:shadow-md transition-all duration-200 sm:hover:-translate-y-1 active:scale-[0.98] sm:active:scale-100 cursor-pointer">
        {/* Image Section */}
        <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
          {/* Images Grid or Single Cover */}
          {displayDishes.length >= 3 ? (
            <div className="flex h-full gap-0.5">
              {displayDishes.slice(0, 3).map((dish, index) => (
                <div key={dish.id || index} className="flex-1 overflow-hidden">
                  <img
                    src={dish.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg'}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : displayDishes.length > 0 ? (
            <img
              src={displayDishes[0]?.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg'}
              alt={displayName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FEF3E2] to-[#FDE8C9] flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Open/Closed Badge */}
          <div
            className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl text-[10px] sm:text-xs font-semibold shadow-sm ${
              isOpen
                ? 'bg-[#D1FAE5] text-[#10B981]'
                : 'bg-[#FEE2E2] text-[#EF4444]'
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

          {/* Nearby Badge */}
          {isNearby && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-black/60 backdrop-blur-sm text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1">
              <MapPin className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              قريب
            </div>
          )}

          {/* Reservation Badge */}
          {can_reserve && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#EDE9FE] text-[#8B5CF6] rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-semibold flex items-center gap-0.5 sm:gap-1 shadow-sm">
              <Calendar className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              يقبل الحجز
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Logo */}
              <div className="w-9 sm:w-10 md:w-11 h-9 sm:h-10 md:h-11 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center bg-gradient-to-br from-[#E5A04D] to-[#D4903D] text-white font-bold text-base sm:text-lg flex-shrink-0">
                {displayName.charAt(0)}
              </div>

              {/* Name */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A] truncate">
                  {displayName}
                </h3>
                {/* {description && (
                  <p className="text-[10px] sm:text-xs text-[#6B7280] truncate">{description}</p>
                )} */}
              </div>
            </div>

            {/* Favorite Button */}
            {/* <button
              onClick={handleFavoriteClick}
              className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center active:scale-95 sm:hover:scale-110 transition-transform flex-shrink-0"
            >
              <Heart
                className={`w-4.5 sm:w-5 h-4.5 sm:h-5 transition-colors ${
                  isFavorite
                    ? 'fill-[#EF4444] stroke-[#EF4444]'
                    : 'stroke-[#9CA3AF] fill-none'
                }`}
              />
            </button> */}
          </div>

          {/* Meta Info Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] text-[#6B7280] mb-1.5 sm:mb-2">
            {/* Rating */}
            {/* <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-[#F59E0B] stroke-[#F59E0B]" />
              <span className="font-semibold text-[#1A1A1A]">{rating}</span>
              <span className="text-[#9CA3AF] text-[10px] sm:text-xs">({reviewCount})</span>
            </div> */}

            <span className="text-[#D1D5DB]">•</span>

            {/* Location */}
            <div className="truncate flex-1 flex items-center gap-1">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Delivery Info Row */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[#6B7280] mb-2 sm:mb-3 flex-wrap">
            {/* Delivery Time */}
            {/* <div className="flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{deliveryTime} دقيقة</span>
            </div> */}            {/* Delivery Fee */}
            {/* {can_deliver && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                {delivery_fees === 0 ? (
                  <span className="text-[#10B981] font-medium flex items-center gap-1">
                    <Truck className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    توصيل مجاني
                  </span>
                ) : (
                  <>
                    <DollarSign className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    <span>رسوم {delivery_fees} ج.م</span>
                  </>
                )}
              </div>
            )} */}

            {/* Min Order */}

          </div>
          <div className='h-3'/>

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

          {/* Dishes Preview */}
          {displayDishes.length > 0 && (
            <div className="border-t border-[#E5E7EB] pt-2 sm:pt-3 mt-2 sm:mt-3">
              <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] mb-2 flex items-center gap-1.5">
                <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-gradient-to-b from-[#E5A04D] to-[#D4903D] rounded-full"></span>
                وجبات مميزة
              </p>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-1">
                {displayDishes.map((dish) => (
                  <div key={dish.id} className="flex-shrink-0 w-20 sm:w-24">
                    <div className="relative h-16 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden mb-1 sm:mb-1.5 shadow-sm">
                      <img
                        src={dish.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg'}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-[#1A1A1A] truncate mb-0.5">
                      {dish.name}
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-[#E5A04D]">{dish.price} ج.م</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <style>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </Link>
  );
}