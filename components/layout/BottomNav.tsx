'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, ClipboardList, User, MessageCircle, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/app/context/CartContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  matchExact?: boolean;
  showBadge?: boolean;
}

const customerNavItems: NavItem[] = [
  { href: '/explore', label: 'الرئيسية', icon: Home, matchExact: true },
  { href: '/customer/orders', label: 'طلباتي', icon: ClipboardList },
  { href: '/customer/cart', label: 'السلة', icon: ShoppingCart, showBadge: true },
  { href: '/customer/chat', label: 'المحادثات', icon: MessageCircle },
];

const vendorNavItems: NavItem[] = [
  { href: '/vendor/dashboard', label: 'الرئيسية', icon: Home, matchExact: true },
  { href: '/vendor/orders', label: 'الطلبات', icon: ClipboardList },
  { href: '/vendor/dishes', label: 'القائمة', icon: Utensils },
  { href: '/vendor/chat', label: 'المحادثات', icon: MessageCircle },
];

interface BottomNavProps {
  role: 'customer' | 'vendor';
}

const BottomNav = memo(function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const navItems = role === 'customer' ? customerNavItems : vendorNavItems;

  const isActive = (item: NavItem) => {
    if (item.matchExact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="px-2 py-1.5">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200 relative',
                  active
                    ? 'text-[#E5A04D]'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-all duration-200',
                      active && 'scale-110'
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {/* Cart Badge - only for customer cart */}
                  {role === 'customer' && item.showBadge && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-[#E5A04D] text-white text-[9px] font-bold rounded-full px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  active && 'font-bold'
                )}>
                  {item.label}
                </span>
                {/* Active Indicator */}
                {active && (
                  <div className="absolute -bottom-1 w-5 h-0.5 rounded-full bg-[#E5A04D]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

export default BottomNav;
