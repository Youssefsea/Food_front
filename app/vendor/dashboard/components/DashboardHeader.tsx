'use client';

import { Store, RefreshCw, Bell, MessageCircle, Menu } from 'lucide-react';
import api from '../../../../axios';
import { useState } from 'react';
interface DashboardHeaderProps {
  restaurantName: string;
  isOpen: boolean;
  onToggleStatus: () => void;
  unreadMessages: number;
  notifications: number;
  onRefresh: () => void;
  onToggleSidebar: () => void;
}

export function DashboardHeader({
  restaurantName,
  isOpen,
  onToggleStatus,
  unreadMessages,
  notifications,
  onRefresh,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateString = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  




  const handleToggleStatus = async () => {
    try {
      const res = await api.get('/restaurant/is-open');
     
    
      onToggleStatus();
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
    }
  };

  return (
  <header className="fixed top-1 right-1 left-1 z-50 h-20 w-full bg-white border-b border-[#E5E7EB] shadow-sm">
  <div className="max-w-full mx-auto px-4 sm:px-8 h-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">

    {/* Right Side - Restaurant Info */}
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Menu Toggle Button */}
      <button 
        onClick={onToggleSidebar}
        className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-[#6B7280]" />
      </button>

      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E5A04D] rounded-full flex items-center justify-center">
        <Store className="w-5 h-5 text-white" />
      </div>

      <div>
        <h1 className="text-lg sm:text-[28px] font-bold text-[#1A1A1A]">{restaurantName}</h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF]">لوحة التحكم</p>
      </div>
    </div>

    {/* Center - Status Toggle */}
    <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
      <span className="text-xs sm:text-sm text-[#6B7280]">حالة المطعم</span>
      <button
        onClick={handleToggleStatus}
        className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}
      >
        <div className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-all duration-300 shadow-md ${isOpen ? 'right-1' : 'left-1'}`} />
      </button>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
        <span className={`text-xs sm:text-sm font-medium ${isOpen ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {isOpen ? 'مفتوح' : 'مغلق'}
        </span>
      </div>
    </div>

  {/* Left Side - Date, Time & Notifications */}
<div className="flex flex-wrap  items-center gap-2 sm:gap-6 mt-2 sm:mt-0 justify-end">
  
  {/* Date & Time */}
  <div className="text-right flex-shrink-0">
    <div className="text-xs sm:text-xl font-bold text-[#1A1A1A]">{timeString}</div>
    <div className="text-[10px] sm:text-sm text-[#6B7280]">{dateString}</div>
  </div>

  {/* Refresh */}
  <button onClick={onRefresh} className="p-1 left-2 sm:p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
    <RefreshCw className="w-4 sm:w-5 h-4 sm:h-5 text-[#6B7280]" />
  </button>

  {/* Chat Icon */}
  <button className="relative left-1 p-1 sm:p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
    <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-[#6B7280]" />
    {unreadMessages > 0 && (
      <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-[#7C3AED] text-white text-[8px] sm:text-xs font-bold rounded-full flex items-center justify-center">
        {unreadMessages}
      </span>
    )}
  </button>

  {/* Notification Bell */}
  <button className="relative left-2 p-1 sm:p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
    <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-[#6B7280]" />
    {notifications > 0 && (
      <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-[#EF4444] text-white text-[8px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
        {notifications}
      </span>
    )}
  </button>

</div>


  </div>
</header>

  );
}


