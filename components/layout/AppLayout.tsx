'use client';

import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  role: 'customer' | 'vendor';
}

export default function AppLayout({ children, role }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]" dir="rtl">
      {/* Sidebar — tablet/desktop only */}
      <Sidebar role={role} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Bottom Nav — mobile only */}
      <BottomNav role={role} />
    </div>
  );
}
