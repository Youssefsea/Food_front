'use client';

import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  role: 'customer' | 'restaurant';
}

const shouldHideNav = (pathname: string) =>
  ['/login', '/register', '/', '/signup', '/customer/cart'].includes(pathname) ||
  pathname.startsWith('/customer/chat/') ||
  pathname.startsWith('/signup/') ||
  pathname.startsWith('/admin');

export default function AppLayout({ children, role }: AppLayoutProps) {
  const pathname = usePathname();
  const hideNav  = shouldHideNav(pathname);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]" dir="rtl">
      <Sidebar role={role} />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {!hideNav && <BottomNav role={role} />}
    </div>
  );
}