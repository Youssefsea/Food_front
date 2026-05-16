'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList,
  Settings, Menu, X, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/vendor/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/vendor/dishes',    label: 'الأطباق',      icon: UtensilsCrossed },
  { href: '/vendor/orders',    label: 'الطلبات',      icon: ClipboardList },
  { href: '/vendor/chat',      label: 'المحادثات',    icon: Settings },
  { href: '/vendor/profile',  label: 'الإعدادات',    icon: Settings },

];

// ── خارج الـ VendorSidebar تماماً ──

function NavItem({
  href, label, icon: Icon, active, collapsed, onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="relative group">
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
          active
            ? 'bg-[#FF6B35] text-white shadow-sm'
            : 'text-gray-600 hover:bg-[#FFF0EB] hover:text-[#FF6B35]'
        )}
      >
        <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
        {!collapsed && (
          <span className="text-sm font-medium whitespace-nowrap">{label}</span>
        )}
      </Link>

      {/* Tooltip لما يكون collapsed */}
      {collapsed && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1.5 rounded-lg bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
          {label}
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}
    </div>
  );
}

function NavList({
  items,
  collapsed,
  isActive,
  onClick,
}: {
  items: typeof navItems;
  collapsed: boolean;
  isActive: (href: string) => boolean;
  onClick?: () => void;
}) {
  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {items.map(({ href, label, icon }) => (
        <NavItem
          key={href}
          href={href}
          label={label}
          icon={icon}
          active={isActive(href)}
          collapsed={collapsed}
          onClick={onClick}
        />
      ))}
    </nav>
  );
}

// ── الـ main component ──

interface VendorSidebarProps {
  restaurantName?: string;
}

// export default function VendorSidebar({ restaurantName  }: VendorSidebarProps) {
//   const pathname = usePathname();
//   const [collapsed, setCollapsed] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const initial = restaurantName?.trim().charAt(0) || 'م';

//   const isActive = (href: string) =>
//     pathname === href || pathname.startsWith(href + '/');

//   return (
//     <>
//       {/* ══ Mobile: Hamburger ══ */}
//       <button
//         className="lg:hidden fixed top-4 right-4 z-150 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md border border-gray-100"
//         onClick={() => setDrawerOpen(true)}
//         aria-label="فتح القائمة"
//       >
//         <Menu className="w-5 h-5 text-gray-700" />
//       </button>

//       {/* ══ Mobile: Overlay ══ */}
//       {drawerOpen && (
//         <div
//           className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
//           onClick={() => setDrawerOpen(false)}
//         />
//       )}

//       {/* ══ Mobile: Drawer ══ */}
//       <aside
//         className={cn(
//           'lg:hidden fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out',
//           drawerOpen ? 'translate-x-0' : 'translate-x-full'
//         )}
//         dir="rtl"
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm">
//               {initial}
//             </div>
//             <span className="font-semibold text-[#1A1A1A] text-sm truncate max-w-[130px]">
//               {restaurantName}
//             </span>
//           </div>
//           <button
//             onClick={() => setDrawerOpen(false)}
//             className="p-1.5 rounded-lg hover:bg-gray-100"
//             aria-label="إغلاق"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <NavList
//           items={navItems}
//           collapsed={false}
//           isActive={isActive}
//           onClick={() => setDrawerOpen(false)}
//         />
//       </aside>

//       {/* ══ Desktop Sidebar ══ */}
//       <aside
//         className={cn(
//           'hidden lg:flex flex-col h-screen sticky top-0 bg-white border-l border-gray-100 transition-all duration-300 ease-out shrink-0',
//           collapsed ? 'w-[68px]' : 'w-60'
//         )}
//         dir="rtl"
//       >
        
//         <div
//           className={cn(
//             'flex items-center p-4 border-b border-gray-100 h-16',
//             collapsed ? 'justify-center' : 'gap-3'
//           )}
//         >
//           <div className="w-9 h-9 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm shrink-0">
//             {initial}
//           </div>
//           {!collapsed && (
//             <span className="font-semibold text-[#1A1A1A] text-sm truncate">
//               {restaurantName}
//             </span>
//           )}
//         </div>

//         {/* Nav */}
//         <NavList
//           items={navItems}
//           collapsed={collapsed}
//           isActive={isActive}
//         />

//         {/* Collapse Toggle */}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="flex items-center justify-center h-11 border-t border-gray-100 hover:bg-gray-50 transition-colors"
//           aria-label={collapsed ? 'توسيع' : 'طي'}
//         >
//           <ChevronLeft
//             className={cn(
//               'w-4 h-4 text-gray-400 transition-transform duration-300',
//               collapsed && 'rotate-180'
//             )}
//           />
//         </button>   
//       </aside>
//     </>
//   );
// }    