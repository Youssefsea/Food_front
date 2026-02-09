'use client';

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartDish } from "../types";

interface DishItemProps {
  dish: CartDish;
  isLast: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function DishItem({ dish, isLast, onQuantityChange, onRemove }: DishItemProps) {

  const imageUrl = dish.image?.split(',')[0]?.trim() || '/placeholder-dish.jpg';

  return (
    <div className={`p-4 flex gap-3.5 ${!isLast ? 'border-b border-[#F3F4F6]' : ''}`}>
      <div className="w-[70px] h-[70px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gray-100">
        <img 
          src={imageUrl} 
          alt={dish.dishName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] line-clamp-1">
            {dish.dishName}
          </h3>
          <span className="text-[16px] font-semibold text-[#E5A04D] whitespace-nowrap">
            {dish.subtotal} ج.م
          </span>
        </div>

        <p className="text-[12px] text-[#9CA3AF] mt-1 line-clamp-1">
          {dish.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center bg-[#F3F4F6] rounded-[10px] h-9 overflow-hidden">
            <button
              onClick={() => onQuantityChange(dish.quantity - 1)}
              disabled={dish.quantity <= 1}
              className="w-9 h-9 flex items-center justify-center hover:bg-[#E5E7EB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-[18px] h-[18px] text-[#6B7280]" />
            </button>
            
            <div className="w-10 text-center text-[16px] font-bold text-[#1A1A1A]">
              {dish.quantity}
            </div>
            
            <button
              onClick={() => onQuantityChange(dish.quantity + 1)}
              className="w-9 h-9 flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
            >
              <Plus className="w-[18px] h-[18px] text-[#6B7280]" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="flex items-center gap-1 text-[#EF4444] text-[13px] hover:bg-[#FEE2E2] px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
        </div>
      </div>
    </div>
  );
}
