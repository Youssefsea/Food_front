import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "./AnimatedLayout";
import { Toast } from "@/components/ui/Toast";

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "أكلي — اطلب أكلك المفضل",
  description: "منصة توصيل طعام — اطلب من أفضل المطاعم حواليك. توصيل سريع وأسعار مناسبة.",
  keywords: "طعام, توصيل, مطاعم, أكلي, akly, food delivery",
  openGraph: {
    title: "أكلي — اطلب أكلك المفضل",
    description: "منصة توصيل طعام — اطلب من أفضل المطاعم حواليك",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FF6B35',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cairo.variable}>
        <AnimatedLayout>
          {children}
        </AnimatedLayout>
        <Toast />
      </body>
    </html>
  );
}
