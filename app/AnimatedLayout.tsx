'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import BottomNav from '@/components/layout/BottomNav';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';
import { getUserRole } from '@/lib/api';

// ✅ الروتس اللي بنخفي فيها الـ nav والـ sidebar
const AUTH_ROUTES    = ['/login', '/register', '/', '/signup'];
const NO_NAV_ROUTES  = ['/customer/cart'];

const shouldHideNav = (pathname: string) =>
  AUTH_ROUTES.includes(pathname) ||
  NO_NAV_ROUTES.includes(pathname) ||
  pathname.startsWith('/customer/chat/') ||
  pathname.startsWith('/signup/') ||
  pathname.startsWith('/admin');

const shouldHideSidebar = (pathname: string) =>
  AUTH_ROUTES.includes(pathname) ||
  pathname.startsWith('/customer/chat/') ||
  pathname.startsWith('/signup/') ||
  pathname.startsWith('/admin');

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ role في state عشان نتجنب hydration mismatch
  const [role, setRole] = useState<'customer' | 'restaurant'>('customer');

  useEffect(() => {
    const r = getUserRole();
    if (r === 'restaurant') setRole('restaurant');
    else setRole('customer');
  }, [pathname]); // بنعيد التحقق كل ما الـ route تتغير

  const isVendor  = role === 'restaurant';
  const hideNav     = shouldHideNav(pathname);
  const hideSidebar = shouldHideSidebar(pathname);

  const showSidebar = !hideSidebar;

  return (
    <AuthProvider>
      <CartProvider>
        <div
          className="flex min-h-screen bg-[#FAFAFA]"
          dir="rtl"
        >
          {showSidebar && <Sidebar role={isVendor ? 'restaurant' : 'customer'} />}

          <div className="flex flex-col flex-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                className="flex-1"
                initial={{ opacity: 0, y: isVendor ? 8 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isVendor ? -8 : -12 }}
                transition={{ duration: isVendor ? 0.2 : 0.25 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>

            {!hideNav && <BottomNav role={isVendor ? 'restaurant' : 'customer'} />}
          </div>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}