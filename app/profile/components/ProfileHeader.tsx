'use client';

import { ArrowLeft, Edit2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserProfile } from "../types";
import { logout } from "@/app/services/authService";

interface ProfileHeaderProps {
  user: UserProfile | null;
  onEditClick: () => void;
}

export function ProfileHeader({ user, onEditClick }: ProfileHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout(); // بيعمل redirect لـ /login تلقائياً
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-center h-14 bg-transparent px-4">
        <button
          onClick={() => router.back()}
          className="absolute right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-base font-bold text-white">حسابي</h1>
      </div>

      {/* Gradient hero */}
      <div
        className="relative overflow-hidden px-6 pb-12 pt-2 flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(145deg, #FF6B35 0%, #E5A04D 65%, #f7c97e 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute -bottom-14 -left-6 w-40 h-40 rounded-full bg-white/6 pointer-events-none" />

        {/* Edit button — يسار */}
        <button
          onClick={onEditClick}
          className="absolute top-0 left-16 flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
        >
          <Edit2 className="w-3 h-3" />
          تعديل
        </button>

        {/* Logout button — أقصى اليسار */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="absolute top-0 left-4 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            opacity: isLoggingOut ? 0.6 : 1
          }}
          aria-label="تسجيل الخروج"
        >
          {isLoggingOut ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'white', borderTopColor: 'transparent' }}
            />
          ) : (
            <LogOut className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Avatar */}
        <div
          className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-3xl font-black mb-3 relative z-10"
          style={{
            background: '#fff',
            color: '#E5A04D',
            border: '3px solid rgba(255,255,255,0.5)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)'
          }}
        >
          {user ? getInitials(user.name) : '؟'}
        </div>

        <p className="text-xl font-black text-white relative z-10">
          {user?.name || 'اسم المستخدم'}
        </p>
        <p className="text-sm text-white/75 mt-1 relative z-10">
          📞 {user?.phone || '+20 XXX XXX XXXX'}
        </p>
      </div>
    </div>
  );
}