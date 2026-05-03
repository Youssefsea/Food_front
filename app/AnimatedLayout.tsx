"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import BottomNav from "@/components/layout/BottomNav";
import { usePathname } from "next/navigation";

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isVendor = pathname.startsWith("/vendor");

  const hideNavRoutes = ["/login", "/register", "/", "/signup", "/cart", "/customer/cart"];
  const hideNav =
    hideNavRoutes.includes(pathname) ||
    pathname.startsWith("/customer/chat/") ||
    pathname.startsWith("/signup/");

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
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

          {!hideNav && <BottomNav role={isVendor ? "vendor" : "customer"} />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
