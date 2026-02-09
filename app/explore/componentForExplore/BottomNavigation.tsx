'use client';

import { Home, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(cartCount);
  
  const [activeTab, setActiveTab] = useState(() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/explore')) return 'explore';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/profile')) return 'profile';
    return '';
  });

  useEffect(() => {
    if (prevCountRef.current !== cartCount) {
      prevCountRef.current = cartCount;
      requestAnimationFrame(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      });
    }
  }, [cartCount]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'home':
        router.push('/');
        break;          
      case 'explore':
        router.push('/explore');
        break;
      case 'cart':
        router.push('/cart');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        break;
    }
  };

  const navItems = [
    { id: 'explore', label: 'استكشف', icon: Home },
    { id: 'cart', label: 'السلة', icon: ShoppingCart, badge: cartCount },
    { id: 'profile', label: 'حسابي', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-[60]"
      style={{ 
        height: 'var(--bottom-nav-height)', 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all active:scale-95 relative ${
                isActive ? 'text-[#E5A04D]' : 'text-[#9CA3AF]'
              }`}
            >
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
                  <span 
                    className={`absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-[#EF4444] text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 transition-transform duration-300 ${
                      isAnimating && item.id === 'cart' ? 'animate-cart-badge-pop' : ''
                    }`}
                  >
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
    </nav>
  );
}
