'use client';

import { Search } from 'lucide-react';
import { useRef } from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  dishCounts: Record<string, number>;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange, dishCounts }: CategoryTabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-0   z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div
        ref={tabsRef}
        className="overflow-x-auto hide-scrollbar"
      >
        <div className="flex gap-1.5 h-10 sm:gap-4 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 whitespace-nowrap text-xs sm:text-sm md:text-base font-medium rounded-lg sm:rounded-xl transition-all ${
                activeCategory === category
                  ? 'bg-[#FEF3E2] text-[#E5A04D] border-2 border-[#E5A04D]'
                  : 'bg-white text-[#6B7280] border-2 border-transparent hover:bg-[#F9FAFB]'
              }`}
            >
              {category}
              {category !== 'الكل' && dishCounts[category] !== undefined && (
                <span className="mr-1 sm:mr-1.5 text-[10px] sm:text-xs text-[#9CA3AF]">
                  ({dishCounts[category]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MenuSearchBar({ value, onChange, placeholder = 'ابحث في قائمة المطعم...' }: SearchBarProps) {
  return (
    <div className="bg-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 border-b border-[#F3F4F6]">
      <div className="relative">
        <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-[#9CA3AF]" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-9 sm:h-10 md:h-11 pr-10 sm:pr-11 md:pr-12 pl-3 sm:pl-4 bg-[#F3F4F6] border-none rounded-lg sm:rounded-xl md:rounded-2xl text-xs sm:text-sm md:text-base placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E5A04D] focus:bg-white transition-all"
        />
      </div>
    </div>
  );
}
