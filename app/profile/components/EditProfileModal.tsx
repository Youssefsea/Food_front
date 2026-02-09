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
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("الاسم ورقم الهاتف مطلوبان");
      return;
    }

    setIsLoading(true);
    try {
      await onSave(name, phone);
      toast.success("تم تحديث الملف الشخصي بنجاح! 🎉");
      onClose();
    } catch {
      toast.error("فشل في تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-90 flex items-end sm:items-center    justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white w-full sm:max-w-md sm:rounded-[24px] rounded-t-[24px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom))'
        }}
      >
        <div 
          className="flex items-center justify-between p-5 sticky top-0 bg-white z-10"
          style={{ borderBottom: '1px solid #E5E7EB' }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A' }}>
            تعديل الملف الشخصي
          </h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] -mr-2 rounded-full transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" style={{ color: '#6B7280' }} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: '#F9FAFB', border: '2px solid #E5E7EB' }}
            >
              <span style={{ fontSize: '2rem', color: '#9CA3AF' }}>
                {name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??'}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label 
              htmlFor="name"
              className="block mb-2"
              style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              الاسم الكامل
            </label>
      <div className="h-2"/>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg min-h-[48px]"
              style={{
                border: '1px solid #E5E7EB',
                fontSize: '1rem',
                color: '#1A1A1A'
              }}
              placeholder="ادخل اسمك الكامل"
              dir="rtl"
            />
          </div>
      <div className="h-2"/>


          <div className="mb-6">
            <label 
              htmlFor="phone"
              className="block mb-2"
              style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              رقم الهاتف
            </label>
      <div className="h-2"/>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg min-h-[48px]"
              style={{
                border: '1px solid #E5E7EB',
                fontSize: '1rem',
                color: '#1A1A1A'
              }}
              placeholder="ادخل رقم هاتفك"
              dir="ltr"
            />
      <div className="h-2"/>

          </div>
      <div className="h-2"/>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg min-h-[48px] transition-colors"
              style={{ 
                borderColor: '#E5E7EB',
                borderWidth: '1px',
                color: '#6B7280',
                fontWeight: 500
              }}
            >
              إلغاء
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg min-h-[48px] transition-all active:scale-[0.98]"
              style={{ 
                backgroundColor: isLoading ? '#D4903D' : '#E5A04D',
                color: 'white',
                fontWeight: 500,
                opacity: isLoading ? 0.7 : 1
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
