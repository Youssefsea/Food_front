'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface Dish {
  id: string;
  name: string;
  price: number;
  image?: string;
  soldCount?: number;
  revenue?: number;
}

interface TopSellingDishesProps {
  dishes: Dish[];
}

export function TopSellingDishes({ dishes }: TopSellingDishesProps) {
  const topDishes = dishes.slice(0, 5);
  const dishImgs = topDishes.map(dish => dish.image?.split(',').map(img => img.trim()) || []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1A1A1A]">الأطباق الأكثر مبيعاً</h2>
        <button className="flex items-center gap-2 text-[#E5A04D] hover:text-[#D4903D] transition-colors">
          <span className="text-sm font-medium">عرض الكل</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {topDishes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-[#6B7280]">لا توجد أطباق حتى الآن</p>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
          {topDishes.map((dish, index) => (
            <div
              key={dish.id}
              className="shrink-0 w-55 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <div className="relative h-40 rounded-t-2xl overflow-hidden bg-[#F3F4F6]">
                {dishImgs[index] && dishImgs[index][0] ? (
                  <Image
                    src={dishImgs[index][0]}
                    alt={dish.name}
                    fill
                    className={"object-cover transition-all duration-300 ease-in-out hover:scale-105"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                    🍽️
                  </div>
                )}
                <div className="absolute top-2 right-2 w-8 h-8 bg-[#E5A04D] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  #{index + 1}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-[#1A1A1A]">{dish.name}</h3>

                <div className="inline-block px-3 py-1 bg-[#E5A04D] text-white text-sm rounded-full font-medium">
                  {dish.price.toLocaleString('ar-EG')} ج.م
                </div>

                <div className="space-y-1 pt-2">
                  {dish.soldCount !== undefined && (
                    <div className="text-xs text-[#9CA3AF]">
                      تم بيع: {dish.soldCount.toLocaleString('ar-EG')} مرة
                    </div>
                  )}
                  {dish.revenue !== undefined && (
                    <div className="text-xs text-[#6B7280] font-medium">
                      الإيرادات: {dish.revenue.toLocaleString('ar-EG')} ج.م
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
