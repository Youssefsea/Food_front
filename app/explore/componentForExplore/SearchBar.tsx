'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFiltersToggle: () => void;
  showFiltersIndicator?: boolean;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
}: SearchBarProps) {
  return (
    <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-white">
      <div className="relative max-w-full sm:max-w-md md:max-w-lg mx-auto">
        <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-[#9CA3AF]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث عن مطعم..."
          className="w-full h-10 sm:h-11 md:h-12 pr-10 sm:pr-12 pl-10 sm:pl-12 bg-[#F3F4F6] border-none rounded-full text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E5A04D] focus:bg-white transition-all"
        />
      
      </div>
    </div>
  );
}
