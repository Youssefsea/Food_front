'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, ShoppingCart, ClipboardList, User, MessageCircle, Utensils } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const customerNavItems: NavItem[] = [
  { href: '/customer/home', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
  { href: '/explore', label: 'استكشف', icon: <Utensils className="w-5 h-5" /> },
  { href: '/customer/orders', label: 'طلباتي', icon: <ClipboardList className="w-5 h-5" /> },
  { href: '/customer/cart', label: 'السلة', icon: <ShoppingCart className="w-5 h-5" /> },
  { href: '/customer/chat', label: 'المحادثات', icon: <MessageCircle className="w-5 h-5" /> },
  { href: '/profile', label: 'حسابي', icon: <User className="w-5 h-5" /> },
];

const vendorNavItems: NavItem[] = [
  { href: '/vendor/dashboard', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
  { href: '/vendor/orders', label: 'الطلبات', icon: <ClipboardList className="w-5 h-5" /> },
  { href: '/vendor/dishes', label: 'القائمة', icon: <Utensils className="w-5 h-5" /> },
  { href: '/vendor/chat', label: 'المحادثات', icon: <MessageCircle className="w-5 h-5" /> },
];

interface SidebarProps {
  role: 'customer' | 'vendor';
}

export default function Sidebar({ role }: SidebarProps) {

  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const items = role === 'customer' ? customerNavItems : vendorNavItems;
  if (role === 'vendor') {
    return null;
  }
  const isActive = (href: string) => {
    if (href === '/customer/home') {
      return pathname === '/customer/home' || pathname === '/explore' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col transition-all duration-300 bg-white border-l border-gray-200 h-screen sticky top-0',
        expanded ? 'w-56' : 'w-16'
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-center h-16 border-b border-gray-100">
        {expanded ? (
          <span className="font-bold text-[#E5A04D] text-lg">🍽️ فودي</span>
        ) : (
          <span className="text-2xl">🍽️</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                active
                  ? 'bg-[#FFF8F0] text-[#E5A04D] font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className={cn(
                  'text-sm whitespace-nowrap overflow-hidden transition-all duration-300',
                  expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Toggle button for desktop */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="hidden lg:flex items-center justify-center h-10 border-t border-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {expanded ? '◀' : '▶'}
      </button>
    </aside>
  );
}
