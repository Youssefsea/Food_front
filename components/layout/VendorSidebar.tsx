'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, Menu, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/vendor/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/vendor/dishes',    label: 'الأطباق',      icon: UtensilsCrossed },
  { href: '/vendor/orders',    label: 'الطلبات',      icon: ClipboardList },
  { href: '/vendor/settings',  label: 'الإعدادات',    icon: Settings },
];

interface VendorSidebarProps {
  restaurantName?: string;
}

function NavLinks({
  collapsed,
  isActive,
  onClick,
}: {
  collapsed: boolean;
  isActive: (href: string) => boolean;
  onClick?: () => void;
}) {
  return (
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            title={label}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
              active
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
            )}
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
            {collapsed && (
              <span className="absolute right-full mr-2 px-2 py-1 rounded-lg bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {label}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}

export default function VendorSidebar({ restaurantName = 'مطعمي' }: VendorSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initial = restaurantName.charAt(0);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-card"
        onClick={() => setDrawerOpen(true)}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer (slides from right — RTL) */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-floating transition-transform duration-300 flex flex-col',
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {initial}
            </div>
            <span className="font-semibold text-dark text-sm">{restaurantName}</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLinks collapsed={collapsed} isActive={isActive} onClick={() => setDrawerOpen(false)} />
        </nav>
      </aside>

      {/* Desktop / tablet sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 bg-white border-l border-gray-100 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center p-4 border-b border-gray-100', collapsed ? 'justify-center' : 'gap-3')}>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
            {initial}
          </div>
          {!collapsed && (
            <span className="font-semibold text-dark text-sm truncate">{restaurantName}</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto relative">
          <NavLinks collapsed={collapsed} isActive={isActive} />
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-3 border-t border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className={cn('w-4 h-4 text-gray-400 transition-transform duration-300', collapsed && 'rotate-180')} />
        </button>
      </aside>
    </>
  );
}
