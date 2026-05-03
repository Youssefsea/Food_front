'use client';

import { Plus, Minus, Clock } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface Dish {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  category: string;
  image: string;
  is_available: number;
  is_featured?: number;
  isPopular?: boolean;
}

interface DishCardProps {
  dish: Dish;
  onAddToCart?: (dishId: number, quantity: number) => void;
  onClick?: (dish: Dish) => void;
  cartQuantity?: number;
}

export function DishCard({ dish, onAddToCart, onClick, cartQuantity = 0 }: DishCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const quantity = cartQuantity;

  const imageUrl = dish.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg';
  const isAvailable = dish.is_available;
  const handleAddClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;

    setIsAdding(true);
    const newQty = quantity + 1;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    onAddToCart?.(dish.id, newQty);
    setIsAdding(false);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQty = quantity + 1;
    onAddToCart?.(dish.id, newQty);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      const newQty = quantity - 1;
      onAddToCart?.(dish.id, newQty);
    }
  };

  const handleCardClick = () => {
    onClick?.(dish);
  };

return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm transition-all duration-300 mb-3 sm:mb-4 cursor-pointer border border-[#F3F4F6] ${
        isAvailable ? 'active:scale-[0.98] sm:hover:shadow-xl sm:hover:-translate-y-1 sm:hover:border-[#E5A04D]/20' : 'opacity-70'
      }`}
    >
      <div className="flex flex-row gap-4 h-36 sm:h-40 md:h-44">
        <div className="relative w-36 sm:w-40 md:w-44 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 144px, 176px"
            className="object-cover"
            loading="lazy"
          />

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white/95 px-4 py-2 rounded-full shadow-lg">
                <span className="text-[#1A1A1A] text-xs sm:text-sm font-bold">غير متوفر</span>
              </div>
            </div>
          )}

          {dish.is_featured && (
            <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#E5A04D] to-[#D4903D] px-2.5 py-1 rounded-full shadow-lg">
              <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-wide">⭐ مميز</span>
            </div>
          )}
        </div>

        <div className="flex-1 px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1A1A1A] line-clamp-1 mb-2 leading-snug">
                {dish.name}
              </h3>
              
              <p className="text-xs sm:text-sm md:text-base text-[#6B7280] line-clamp-2 leading-relaxed font-normal">
                {dish.description || 'وصف لذيذ للطبق'}
              </p>
            </div>

            {isAvailable && (
              <div className="flex-shrink-0">
                {quantity === 0 ? (
                  <button
                    onClick={handleAddClick}
                    disabled={isAdding}
                    className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-gradient-to-br from-[#E5A04D] to-[#D4903D] rounded-2xl flex items-center justify-center shadow-md hover:shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-5 sm:w-5.5 md:w-6 h-5 sm:h-5.5 md:h-6 text-white" strokeWidth={3} />
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-[#FEF3E2] rounded-2xl overflow-hidden shadow-md border border-[#E5A04D]/20">
                    <button
                      onClick={handleDecrease}
                      className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 flex items-center justify-center hover:bg-[#E5A04D]/15 active:bg-[#E5A04D]/25 transition-colors"
                    >
                      <Minus className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-[#E5A04D]" strokeWidth={2.5} />
                    </button>
                    <span className="min-w-[24px] sm:min-w-[28px] text-center text-sm sm:text-base md:text-lg font-bold text-[#E5A04D]">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 flex items-center justify-center hover:bg-[#E5A04D]/15 active:bg-[#E5A04D]/25 transition-colors"
                    >
                      <Plus className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-[#E5A04D]" strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] mt-auto">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#E5A04D] tracking-tight">
                {dish.price}
              </span>
              <span className="text-xs sm:text-sm text-[#E5A04D]/80 font-medium">ج.م</span>
            </div>

            {dish.preparation_time && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] rounded-full">
                <Clock className="w-3.5 sm:w-4 md:w-4.5 h-3.5 sm:h-4 md:h-4.5 text-[#6B7280]" />
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#6B7280]">
                  {dish.preparation_time} دقيقة
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
