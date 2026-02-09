import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from './context/CartContext';
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Wajbat - احجز وجبتك مقدماً",
  description: "منصة لحجز الوجبات مسبقاً من المطاعم والبائعين",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <CartProvider>

          <main className="main-content-with-bottom-nav">
            {children}
          </main>

          <ClientLayout />

        </CartProvider>
      </body>
    </html>
  );
}
