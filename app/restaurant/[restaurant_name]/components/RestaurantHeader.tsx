'use client';

import { ChevronRight, Share2, Heart, Star, MapPin, Clock, DollarSign, Phone, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Restaurant {
  id: number;
  restaurant_name: string;
  description: string;
  location: string;
  delivery_fees: number;
  can_deliver: number;
  can_reserve: number;
  is_open?: number;
  phone?: string;
  open_time?: string;
  close_time?: string;
  logo?: string;
  cover_image?: string;
  rating?: number;
  review_count?: number;
}

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  coverImage?: string;
}

export function RestaurantHeader({ restaurant, coverImage }: RestaurantHeaderProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isOpen = restaurant.is_open === 1;

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.restaurant_name,
          text: restaurant.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleCall = () => {
    if (restaurant.phone) {
      window.location.href = `tel:${restaurant.phone}`;
    }
  };

return (
    <>
      {/* Hero Header */}
      <div className="relative h-50 sm:h-60 md:h-72 lg:h-80 overflow-visible">
        {/* Background Image */}
        <img
          src={coverImage || '/placeholder-restaurant.jpg'}
          alt={restaurant.restaurant_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Top Navigation Bar */}
        <div
          className={`fixed top-4 left-1 right-1 z-50 transition-all duration-300 ${
            isHeaderScrolled ? 'bg-white shadow-md' : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4">
            {/* Back Button */}
            <button 
              onClick={() => router.back()}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isHeaderScrolled
                  ? 'bg-[#F3F4F6] text-[#1A1A1A]'
                  : 'bg-white/90 backdrop-blur-sm text-[#1A1A1A]'
              }`}
            >
              <ChevronRight className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
            </button>

            {/* Restaurant Name (shown when scrolled) */}
            {isHeaderScrolled && (
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#1A1A1A] flex-1 mx-3 sm:mx-4 truncate">
                {restaurant.restaurant_name}
              </h1>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button 
                onClick={handleShare}
                className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  isHeaderScrolled
                    ? 'bg-[#F3F4F6] text-[#1A1A1A]'
                    : 'bg-white/90 backdrop-blur-sm text-[#1A1A1A]'
                }`}
              >
                <Share2 className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Container للوجو والكارت */}
      <div className="relative">
        {/* Logo + Status - خارج الكارت البيضاء */}
        <div className="absolute -top-18 sm:-top-10 md:-top-27 right-3 sm:right-5 md:right-5 z-20 flex items-end gap-1 sm:gap-3">
          {/* Restaurant Logo */}
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border-3 sm:border-4 border-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {restaurant.logo ? (
              <img
                src={restaurant.logo}
                alt={restaurant.restaurant_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-[#E5A04D] to-[#D4903D] bg-clip-text text-transparent">
                {restaurant.restaurant_name.charAt(0)}
              </span>
            )}
          </div>

          {/* Status Badge جنب اللوجو */}
          <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 mb-2 sm:mb-3 rounded-full text-[10px] sm:text-xs md:text-[13px] font-semibold shadow-md whitespace-nowrap ${
            isOpen ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'
          }`}>
            {isOpen ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                مفتوح الآن
              </span>
            ) : (
              'مغلق'
            )}
          </div>
        </div>
        
        <div className='h-2'/>

        {/* Restaurant Info Card */}
        <div className="bg-white -mt-4 sm:-mt-5 rounded-t-2xl sm:rounded-t-3xl relative z-10 pt-12 sm:pt-14 md:pt-16 pb-4 sm:pb-5 px-4 sm:px-5 md:px-6 pr-24 sm:pr-28 md:pr-32">
          {/* Restaurant Name */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] mb-1.5 sm:mb-2">
            {restaurant.restaurant_name}
          </h1>
        <div className='h-2'/>


          {/* Rating & Category Row */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
            <span className="text-xs sm:text-sm md:text-base text-[#6B7280]">
              🍕 مطعم
            </span>
          </div>
        <div className='h-2'/>


          {/* Info Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          
        <div className='h-2'/>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#F3F4F6] rounded-full text-[10px] sm:text-xs md:text-[13px] text-[#6B7280]">
              <MapPin className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
              <span className="truncate max-w-[120px] sm:max-w-[150px]">{restaurant.location}</span>
            </div>
            {restaurant.open_time && restaurant.close_time && (
              <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#F3F4F6] rounded-full text-[10px] sm:text-xs md:text-[13px] text-[#6B7280]">
                <Clock className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                <span>{restaurant.open_time} - {restaurant.close_time}</span>
              </div>
            )}
            {restaurant.can_reserve === 1 && (
              <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#EDE9FE] text-[#8B5CF6] rounded-full text-[10px] sm:text-xs md:text-[13px] font-medium">
                <Calendar className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                <span>يقبل الحجز</span>
              </div>
            )}
          </div>

          {/* Description */}
          {restaurant.description && (
            <div className="mb-3 sm:mb-4">
              <p className={`text-xs sm:text-sm md:text-base text-[#6B7280] leading-relaxed ${
                showFullDescription ? '' : 'line-clamp-2'
              }`}>
                {restaurant.description}
              </p>
              {restaurant.description.length > 100 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-xs sm:text-sm text-[#E5A04D] font-medium mt-1 hover:underline"
                >
                  {showFullDescription ? 'إخفاء' : '...المزيد'}
                </button>
              )}
            </div>
          )}
        <div className='h-2'/>


          {/* Quick Actions */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#F3F4F6]">
            {restaurant.phone && (
              <button 
                onClick={handleCall}
                className="flex-1 h-9 sm:h-10 md:h-11 flex items-center justify-center gap-1.5 sm:gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-lg sm:rounded-xl md:rounded-2xl transition-colors active:scale-95"
              >
                <Phone className="w-3.5 sm:w-4 md:w-4.5 h-3.5 sm:h-4 md:h-4.5 text-[#1A1A1A]" />
                <span className="text-xs sm:text-sm md:text-base font-semibold text-[#1A1A1A]">اتصال</span>
              </button>
            )}
          
            {restaurant.can_reserve === 1 && (
              <span className="flex-1 h-9 sm:h-10 md:h-11 flex items-center justify-center gap-1.5 sm:gap-2 bg-[#EDE9FE] text-[#8B5CF6] rounded-lg sm:rounded-xl md:rounded-2xl transition-colors ">
                <Calendar className="w-3.5 sm:w-4 md:w-4.5 h-3.5 sm:h-4 md:h-4.5" />
                <span className="text-xs sm:text-sm md:text-base font-semibold">يقبل الحجوزات </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
