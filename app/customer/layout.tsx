

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <main className="pb-5 md:pb-0">
        {children}
      </main>
    
    </div>
  );
}
