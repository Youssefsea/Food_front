'use client';

import { LayoutDashboard, ShoppingBag, Calendar, MessageCircle, Utensils, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  badgeColor?: string;
}

interface SidebarProps {
  pendingOrders: number;
  unreadMessages: number;
  todayReservations: number;
  isVisible: boolean;
  onClose: () => void;
}

export function Sidebar({ pendingOrders, unreadMessages, todayReservations, isVisible, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, href: '/restaurant/dashboard' },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag, href: '/restaurant/orders', badge: pendingOrders, badgeColor: '#F59E0B' },
    { id: 'reservations', label: 'الحجوزات', icon: Calendar, href: '/restaurant/orders', badge: todayReservations, badgeColor: '#8B5CF6' },
    { id: 'chat', label: 'المحادثات', icon: MessageCircle, href: '/restaurant/orders', badge: unreadMessages, badgeColor: '#EF4444' },
    { id: 'menu', label: 'قائمة الأطباق', icon: Utensils, href: '/restaurant/menu' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/vendor/EditAtVendorInfo' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <aside 
        className={`fixed right-0 top-1 h-full w-72 bg-white border-l border-[#E5E7EB] z-60 pt-6 shadow-2xl transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-1 left-5 p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>

        <div className="px-6 mb-6">
          <h2 className="text-xl font-bold text-[#E5A04D]">القائمة</h2>
        </div>

        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="px-2 py-0.5 text-xs font-bold text-white rounded-full"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
