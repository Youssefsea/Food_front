'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import BottomNav from '@/components/layout/BottomNav';
import VendorSidebar from '@/components/layout/VendorSidebar';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isVendor = pathname.startsWith('/vendor');

  const hideNavRoutes = ['/login', '/register', '/', '/signup', '/cart', '/customer/cart'];
  const hideNav =
    hideNavRoutes.includes(pathname) ||
    pathname.startsWith('/customer/chat/') ||
    pathname.startsWith('/signup/') ||
    pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        {isVendor ? (
          /* ── Vendor: VendorSidebar فقط ── */
          <div className="flex min-h-screen bg-[#FAFAFA]" dir="rtl">
            <VendorSidebar />
            <main className="flex-1 min-w-0 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        ) : (
          /* ── Customer: Sidebar للـ desktop + BottomNav للـ mobile ── */
          <div className="flex min-h-screen">
            {/* Sidebar يظهر على md+ فقط */}
            <Sidebar role="customer" />

            <div className="flex flex-col flex-1 min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pathname}
                  className="flex-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>

              {/* BottomNav يظهر على mobile فقط */}
              {!hideNav && <BottomNav role="customer" />}
            </div>
          </div>
        )}
      </CartProvider>
    </AuthProvider>
  );
}