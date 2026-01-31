import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wajbat - احجز وجبتك مقدماً",
  description: "منصة لحجز الوجبات مسبقاً من المطاعم والبائعين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
