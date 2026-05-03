'use client';

import { X, Clock, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
// eslint-disable-next-line react-hooks/exhaustive-deps
import { useState, useEffect } from 'react';

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
  rating?: number;
  reviewCount?: number;
  calories?: number;
}

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dishId: number, quantity: number, notes?: string) => void;
  initialQuantity?: number;
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onAddToCart,
  initialQuantity = 1,
}: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [notes, setNotes] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setQuantity(initialQuantity);
    setNotes('');
    setCurrentImageIndex(0);
  }, [dish, initialQuantity]);

  if (!isOpen || !dish) return null;

  const images = dish.image?.split(',').filter(Boolean) || [];
  const totalPrice = dish.price * quantity;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAddToCart(dish.id, quantity, notes);
    setIsAdding(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      <div className="relative bg-white w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slideUp sm:animate-scaleIn">
        <div className="sm:hidden sticky top-0 bg-white pt-3 pb-2 flex justify-center z-10">
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="h-2" />
        <div className="relative h-56 sm:h-64 md:h-72 bg-[#F3F4F6]">
          <Image
            src={images[currentImageIndex]?.trim() || '/placeholder-dish.jpg'}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, 512px"
            className="object-cover"
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImageIndex === index
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="h-2" />

        <div className="p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] mb-2">
            {dish.name}
          </h2>

        <div className="h-2" />
    

          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#FEF3E2] text-[#E5A04D] rounded-full text-[10px] sm:text-xs md:text-sm font-medium mb-3 sm:mb-4">
            <span>🍕</span>
            <span>{dish.category}</span>
          </div>
        <div className="h-2" />

          <p className="text-xs sm:text-sm md:text-base text-[#6B7280] leading-relaxed mb-3 sm:mb-4">
            {dish.description}
          </p>
        <div className="h-2" />

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#9CA3AF] mb-4 sm:mb-6">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{dish.preparation_time} دقيقة</span>
            </div>
            
          </div>
        <div className="h-2" />


          <div className="border-t border-[#F3F4F6] my-4 sm:my-5" />

        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-3 sm:p-4 md:p-5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="h-2" />

            <div className="flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center active:bg-[#E5E7EB] transition-colors disabled:opacity-50"
              >
                <Minus className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-[#6B7280]" strokeWidth={2.5} />
              </button>
              <div className="w-9 sm:w-10 md:w-11 text-center">
                <span className="text-base sm:text-lg font-bold text-[#1A1A1A]">{quantity}</span>
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center active:bg-[#E5E7EB] transition-colors"
              >
                <Plus className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-[#6B7280]" strokeWidth={2.5} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || dish.is_available === 0}
              className="flex-1 h-10 sm:h-11 md:h-12 bg-[#E5A04D] hover:bg-[#D4903D] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-[#E5A04D]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الإضافة...</span>
                </>
              ) : (
                <>
                  <span>إضافة للسلة</span>
                  <span>•</span>
                  <span>{totalPrice} ج.م</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="h-4" />

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 200ms ease-out;
        }
        .animate-slideUp {
          animation: slideUp 300ms ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 200ms ease-out;
        }
      `}</style>
    </div>
  );
}
