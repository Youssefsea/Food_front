'use client';

import { Pencil, Trash2, Clock } from 'lucide-react';
import { useState,useEffect } from 'react';
import Image from 'next/image';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  category: string;
  image: string;
  is_available: boolean;
}

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
  onToggleAvailability: (dishId: number, isAvailable: boolean) => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'مقبلات': { bg: '#DBEAFE', text: '#3B82F6' },
  'أطباق رئيسية': { bg: '#FEF3E2', text: '#E5A04D' },
  'بيتزا': { bg: '#FEE2E2', text: '#EF4444' },
  'برجر': { bg: '#FEF9C3', text: '#CA8A04' },
  'مشروبات': { bg: '#CFFAFE', text: '#06B6D4' },
  'حلويات': { bg: '#FCE7F3', text: '#EC4899' },
  'سلطات': { bg: '#D1FAE5', text: '#10B981' },
  'مشويات': { bg: '#E9D5FF', text: '#9333EA' },
  'سندويتشات': { bg: '#FED7AA', text: '#EA580C' },
  'شوربات': { bg: '#FEF3C7', text: '#D97706' },
};

export function DishCard({ dish, onEdit, onDelete, onToggleAvailability }: DishCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  
  const images = dish.image ? dish.image.split(',') : [];
  const categoryStyle = categoryColors[dish.category] || categoryColors['أطباق رئيسية'];
const [currentImageIndex, setCurrentImageIndex] = useState(0);

useEffect(() => {
  if (!images || images.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, 3000); // كل 3 ثواني

  return () => clearInterval(interval);
}, [images]);


  const handleToggle = async () => {
    setIsToggling(true);
    await onToggleAvailability(dish.id, !dish.is_available);
    setIsToggling(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default">
{/* Image Section */}
<div className="relative w-full p-3 rounded-3xl h-40 bg-[#F3F4F6] overflow-hidden group">
  {images && images.length > 0 ? (
    <Image
      src={images[currentImageIndex] || images[0]}
      alt={dish.name}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-6xl text-[#9CA3AF]">🍽️</span>
    </div>
  )}

  {/* Multiple Images Indicator */}
  {images && images.length > 1 && (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
      {images.slice(0, 3).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentImageIndex
              ? "bg-white"
              : "bg-white/50"
          }`}
        />
      ))}
    </div>
  )}

  {/* Availability Badge */}
  <div className="absolute top-3 right-3">
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
        dish.is_available
          ? "bg-[#D1FAE5] text-[#10B981]"
          : "bg-[#FEE2E2] text-[#EF4444]"
      }`}
    >
      {dish.is_available ? "✓ متاح" : "غير متاح"}
    </span>
  </div>

  {/* Category Badge */}
  <div className="absolute top-3 left-3">
    <span
      className="px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: categoryStyle.bg,
        color: categoryStyle.text,
      }}
    >
      {dish.category}
    </span>
  </div>
</div>



      {/* Content Section */}
      <div className="p-4">
        {/* Dish Name */}
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 line-clamp-1">
          {dish.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#6B7280] mb-3 line-clamp-2 min-h-10">
          {dish.description}
        </p>

        {/* Price & Prep Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[22px] font-bold text-[#E5A04D]">
            {dish.price} ج.م
          </span>
          <div className="flex items-center gap-1 text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{dish.preparation_time} دقيقة</span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="border-t border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
        {/* Availability Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              dish.is_available ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'
            } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                dish.is_available ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-xs text-[#6B7280]">
            {dish.is_available ? 'متاح' : 'غير متاح'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(dish)}
            className="w-9 h-9 flex items-center justify-center bg-[#F3F4F6] hover:bg-[#E5A04D] rounded-lg transition-colors group"
          >
            <Pencil className="w-4 h-4 text-[#6B7280] group-hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(dish)}
            className="w-9 h-9 flex items-center justify-center bg-[#FEE2E2] hover:bg-[#EF4444] rounded-lg transition-colors group"
          >
            <Trash2 className="w-4 h-4 text-[#EF4444] group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}


