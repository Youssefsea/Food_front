import BottomNav from '@/components/layout/BottomNav';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      {/* <BottomNav role="restaurant" /> */}
    </div>
  );
}
