'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home, ShoppingCart, ClipboardList,
  User, MessageCircle, Utensils,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const customerNavItems: NavItem[] = [
  { href: '/explore',         label: 'الرئيسية',  icon: <Home className="w-[18px] h-[18px]" /> },
  { href: '/customer/orders', label: 'طلباتي',    icon: <ClipboardList className="w-[18px] h-[18px]" /> },
  { href: '/customer/cart',   label: 'السلة',     icon: <ShoppingCart className="w-[18px] h-[18px]" /> },
  { href: '/customer/chat',   label: 'المحادثات', icon: <MessageCircle className="w-[18px] h-[18px]" /> },
  { href: '/profile',         label: 'حسابي',     icon: <User className="w-[18px] h-[18px]" /> },
];

const vendorNavItems: NavItem[] = [
  { href: '/vendor/dashboard', label: 'الرئيسية',  icon: <Home className="w-[18px] h-[18px]" /> },
  { href: '/vendor/orders',    label: 'الطلبات',   icon: <ClipboardList className="w-[18px] h-[18px]" /> },
  { href: '/vendor/dishes',    label: 'القائمة',   icon: <Utensils className="w-[18px] h-[18px]" /> },
  { href: '/vendor/chat',      label: 'المحادثات', icon: <MessageCircle className="w-[18px] h-[18px]" /> },
  { href: '/vendor/profile',   label: 'حسابي',     icon: <User className="w-[18px] h-[18px]" /> },
];

interface SidebarProps {
  role: 'customer' | 'restaurant';
}

export default function Sidebar({ role }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const items    = role === 'customer' ? customerNavItems : vendorNavItems;

  const isActive = (href: string) => {
    if (href === '/explore') return pathname === '/explore' || pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
 
    <div className="hidden md:block w-16 flex-shrink-0">
      <aside
        className={cn(
          'fixed right-3 top-1/2 -translate-y-1/2 z-50',
          'flex flex-col gap-1 p-2',
          'bg-white/90 backdrop-blur-md',
          'border border-gray-200/80',
          'shadow-lg shadow-black/5',
          'rounded-2xl',
          'transition-all duration-300 ease-in-out',
          expanded ? 'w-50' : 'w-12',
        )}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-xl transition-all duration-200 overflow-hidden',
                expanded ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center',
                active
                  ? 'bg-[#FFF3E6] text-[#E5A04D]'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              )}
            >
              {/* Icon */}
              <span className={cn('flex-shrink-0', active && 'text-[#E5A04D]')}>
                {item.icon}
              </span>

              {/* Label */}
              <span className={cn(
                'text-[13px] font-medium whitespace-nowrap',
                'transition-all duration-200',
                expanded ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0',
              )}>
                {item.label}
              </span>

              {/* Active dot لما تكون مضغوطة */}
              {!expanded && active && (
                <span className="absolute right-1.5 w-1 h-1 rounded-full bg-[#E5A04D]" />
              )}
            </Link>
          );
        })}
      </aside>
    </div>
  );
}