'use client';

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserProfile } from "../types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSave: (name: string, phone: string) => Promise<void>;
}

export function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user, isOpen]); // ← أضفنا isOpen عشان يـ reset لما يتفتح

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("الاسم ورقم الهاتف مطلوبان");
      return;
    }
    setIsLoading(true);
    try {
      await onSave(name.trim(), phone.trim());
      toast.success("تم تحديث الملف الشخصي بنجاح! 🎉");
      onClose();
    } catch {
      toast.error("فشل في تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '؟؟';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))'
        }}
      >
        {/* Handle bar — موبايل فقط */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>
            تعديل الملف الشخصي
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5">
          {/* Avatar preview */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
              style={{
                background: 'linear-gradient(135deg, #FF6B35, #E5A04D)',
                color: '#fff',
                boxShadow: '0 6px 20px rgba(229,160,77,0.35)'
              }}
            >
              {initials}
            </div>
          </div>

          {/* Name field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              الاسم الكامل
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ادخل اسمك الكامل"
              dir="rtl"
              className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
              style={{
                border: '1.5px solid #e5e7eb',
                color: '#1a1a1a',
                background: '#fafafa'
              }}
              onFocus={e => e.target.style.borderColor = '#E5A04D'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Phone field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="ادخل رقم هاتفك"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all"
              style={{
                border: '1.5px solid #e5e7eb',
                color: '#1a1a1a',
                background: '#fafafa'
              }}
              onFocus={e => e.target.style.borderColor = '#E5A04D'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ border: '1.5px solid #e5e7eb', color: '#6b7280', background: '#fafafa' }}
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
              style={{
                background: isLoading ? '#d4903d' : 'linear-gradient(135deg, #FF6B35, #E5A04D)',
                color: '#fff',
                opacity: isLoading ? 0.75 : 1,
                boxShadow: isLoading ? 'none' : '0 4px 14px rgba(229,160,77,0.4)'
              }}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}