'use client';

import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useState } from 'react';

interface BottomNavigationProps {
  cartCount?: number;
}

export function BottomNavigation({ cartCount = 0 }: BottomNavigationProps) {
  const [activeTab, setActiveTab] = useState('explore');

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'explore', label: 'استكشف', icon: Search },
    { id: 'cart', label: 'السلة', icon: ShoppingCart, badge: cartCount },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'profile', label: 'حسابي', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-2 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all active:scale-95 relative ${
                isActive ? 'text-[#E5A04D]' : 'text-[#9CA3AF]'
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E5A04D] rounded-full" />
              )}
              
              <div className="relative">
                <Icon
                  className={`w-5 sm:w-6 h-5 sm:h-6 transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-[#EF4444] text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-all ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        @supports (-webkit-touch-callout: none) {
          .safe-area-bottom {
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 0.5rem);
          }
        }
      `}</style>
    </nav>
  );
}
