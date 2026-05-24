'use client';

import { Pencil, Trash2, Clock } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
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
  'مقبلات':       { bg: '#DBEAFE', text: '#2563EB' },
  'أطباق رئيسية': { bg: '#FEF3E2', text: '#D97706' },
  'بيتزا':        { bg: '#FEE2E2', text: '#DC2626' },
  'برجر':         { bg: '#FEF9C3', text: '#B45309' },
  'مشروبات':      { bg: '#CFFAFE', text: '#0891B2' },
  'حلويات':       { bg: '#FCE7F3', text: '#DB2777' },
  'سلطات':        { bg: '#D1FAE5', text: '#059669' },
  'مشويات':       { bg: '#EDE9FE', text: '#7C3AED' },
  'سندويتشات':    { bg: '#FFEDD5', text: '#C2410C' },
  'شوربات':       { bg: '#FEF3C7', text: '#B45309' },
};

export const DishCard = memo(function DishCard({
  dish,
  onEdit,
  onDelete,
  onToggleAvailability,
}: DishCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = dish.image ? dish.image.split(',') : [];
  const categoryStyle = categoryColors[dish.category] ?? categoryColors['أطباق رئيسية'];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggleAvailability(dish.id, !dish.is_available);
    setIsToggling(false);
  };

  return (
    <div
      dir="rtl"
      className="
        group relative flex flex-col
        bg-white rounded-2xl overflow-hidden
        border border-[#F0F0F0]
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]
        hover:-translate-y-1
        transition-all duration-250 ease-out
        cursor-default
      "
    >
      {/* ── Image area ── */}
      <div className="relative w-full h-44 bg-[#F5F5F5] overflow-hidden">
        {images.length > 0 ? (
          <Image
            src={images[currentImageIndex] ?? images[0]}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-400 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Subtle bottom gradient so badges are readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.slice(0, 4).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentImageIndex
                    ? 'w-4 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Availability badge — top right */}
        <span
          className={`
            absolute top-2.5 right-2.5 z-10
            px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide
            backdrop-blur-sm
            ${dish.is_available
              ? 'bg-emerald-500/90 text-white'
              : 'bg-red-500/90 text-white'}
          `}
        >
          {dish.is_available ? '✓ متاح' : 'غير متاح'}
        </span>

        {/* Category badge — top left */}
        <span
          className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm"
          style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
        >
          {dish.category}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-3 gap-1.5">
        <h3 className="text-[15px] font-bold text-[#111827] leading-snug line-clamp-1">
          {dish.name}
        </h3>

        <p className="text-[13px] text-[#6B7280] leading-relaxed line-clamp-2 min-h-[2.6rem]">
          {dish.description}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-[20px] font-extrabold text-[#E5A04D] leading-none">
            {dish.price.toLocaleString('ar-EG')}
            <span className="text-[13px] font-medium text-[#9CA3AF] mr-1">ج.م</span>
          </span>

          <div className="flex items-center gap-1 text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[12px]">{dish.preparation_time} دقيقة</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-[#F3F4F6] px-4 py-2.5 flex items-center justify-between">
        {/* Toggle */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={dish.is_available ? 'إيقاف الطبق' : 'تفعيل الطبق'}
          className={`
            flex items-center gap-2
            ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div
            className={`
              relative w-10 h-5 rounded-full transition-colors duration-200
              ${dish.is_available ? 'bg-emerald-500' : 'bg-[#E5E7EB]'}
            `}
          >
            <div
              className={`
                absolute top-0.5 w-4 h-4 bg-white rounded-full
                shadow-[0_1px_3px_rgba(0,0,0,0.2)]
                transition-all duration-200
                ${dish.is_available ? 'right-0.5' : 'left-0.5'}
              `}
            />
          </div>
          <span className="text-[12px] text-[#6B7280]">
            {dish.is_available ? 'متاح' : 'غير متاح'}
          </span>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(dish)}
            aria-label="تعديل الطبق"
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              bg-[#F9FAFB] hover:bg-[#E5A04D]
              border border-[#E5E7EB] hover:border-[#E5A04D]
              transition-all duration-150
              group/edit
            "
          >
            <Pencil className="w-3.5 h-3.5 text-[#6B7280] group-hover/edit:text-white" />
          </button>

          <button
            onClick={() => onDelete(dish)}
            aria-label="حذف الطبق"
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              bg-[#FEF2F2] hover:bg-[#EF4444]
              border border-[#FECACA] hover:border-[#EF4444]
              transition-all duration-150
              group/del
            "
          >
            <Trash2 className="w-3.5 h-3.5 text-[#EF4444] group-hover/del:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
});