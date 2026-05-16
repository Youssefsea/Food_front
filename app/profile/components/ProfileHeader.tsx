'use client';

import { ArrowLeft, Edit2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { logout } from "@/services/auth.service";

interface ProfileHeaderProps {
  user: UserProfile | null;
  onEditClick: () => void;
}

export function ProfileHeader({ user, onEditClick }: ProfileHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── تتبع السكرول عشان نغير خلفية الـ top bar ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">

      {/* ── Top Bar ── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-center h-14 px-4 transition-all duration-300"
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, #FF6B35 0%, #E5A04D 100%)'
            : 'transparent',
          boxShadow: scrolled ? '0 2px 12px rgba(229,95,30,0.25)' : 'none',
        }}
      >
        {/* زر الرجوع */}
        <button
          onClick={() => router.back()}
          className="absolute right-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(8px)',
          }}
          aria-label="رجوع"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        <h1 className="text-base font-bold text-white drop-shadow-sm">حسابي</h1>

        {/* زر تسجيل الخروج في الـ top bar */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="absolute left-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(8px)',
            opacity: isLoggingOut ? 0.6 : 1,
          }}
          aria-label="تسجيل الخروج"
        >
          {isLoggingOut ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* ── Hero Section ── */}
      <div
        className="relative overflow-hidden px-6 pb-14 pt-4 flex flex-col items-center text-center"
        style={{
          background: 'linear-gradient(145deg, #FF6B35 0%, #E5A04D 65%, #f7c97e 100%)',
          marginTop: '-56px', // يبدأ من تحت الـ sticky bar مباشرةً
          paddingTop: '72px',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div
          className="absolute -bottom-16 -left-8 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />

        {/* زر التعديل — يمين الأفاتار */}
        <button
          onClick={onEditClick}
          className="absolute top-[72px] left-5 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-semibold active:scale-95 transition-transform"
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Edit2 className="w-3 h-3" />
          تعديل
        </button>

        {/* Avatar */}
        <div className="relative z-10 mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black"
            style={{
              background: '#fff',
              color: '#FF6B35',
              border: '4px solid rgba(255,255,255,0.6)',
              boxShadow: '0 10px 32px rgba(0,0,0,0.2)',
            }}
          >
            {user ? getInitials(user.name) : '؟'}
          </div>

          {/* نقطة الحالة */}
          <span
            className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ background: '#22c55e' }}
          />
        </div>

        {/* Name */}
        <p className="text-xl font-black text-white relative z-10 drop-shadow-sm">
          {user?.name || 'اسم المستخدم'}
        </p>

        {/* Phone */}
        <p className="text-sm mt-1 relative z-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
          📞 {user?.phone || '+20 XXX XXX XXXX'}
        </p>

        {/* Wave bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{
            background: '#FAFAFA',
            clipPath: 'ellipse(55% 100% at 50% 100%)',
          }}
        />
      </div>
    </div>
  );
}