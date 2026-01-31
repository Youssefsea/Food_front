import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFiltersToggle: () => void;
  showFiltersIndicator?: boolean;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  onFiltersToggle,
  showFiltersIndicator = false 
}: SearchBarProps) {
  return (
  
    <div className="px-4 py-3  bg-white">
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث عن مطعم أو وجبة…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3 px-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-right placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E5A04D] focus:border-transparent transition-all"
        />        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
        <button 
          onClick={onFiltersToggle}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5 text-[#6B7280]" />
          {showFiltersIndicator && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E5A04D] rounded-full"></span>
          )}
        </button>
      </div>
    </div>
  
  );
}
