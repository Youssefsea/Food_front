'use client';

import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, CheckCircle } from 'lucide-react';

interface AccountData {
  email?: string;
  phone?: string;
}

interface AccountSecurityTabProps {
  data: AccountData;
  onChange?: (data: Partial<AccountData>) => void;
}

export function AccountSecurityTab({ data }: AccountSecurityTabProps) {
  const [showPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);

  // Note: Password functionality is disabled - keeping for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _passwordStrengthUtils = {
    calculate: (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[!@#$%^&*]/.test(password)) strength++;
      return strength;
    },
    labels: ['', 'ضعيفة', 'متوسطة', 'قوية', 'ممتازة'],
    colors: ['#E5E7EB', '#EF4444', '#F59E0B', '#10B981', '#10B981'],
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Section 1: Account Information - Read Only */}
      <div className="p-7 border-b border-[#E5E7EB]">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">معلومات الحساب</h3>
          <p className="text-sm text-[#6B7280]">بيانات تسجيل الدخول</p>
          <p className="text-xs text-[#F59E0B] mt-1">⚠️ تغيير هذه البيانات غير متاح حالياً - تواصل مع الدعم</p>
        </div>

        <div className="space-y-4">
          {/* Email Card */}
          <div className="bg-[#F8FAFC] rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                ✉️
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">البريد الإلكتروني</p>
                <p className="text-sm font-medium text-[#1A1A1A] flex items-center gap-2">
                  {data.email || 'owner@restaurant.com'}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#D1FAE5] text-[#10B981] rounded-lg text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    موثق
                  </span>
                </p>
              </div>
            </div>
            <button 
              disabled
              className="text-sm text-[#9CA3AF] font-medium cursor-not-allowed"
            >
              غير متاح
            </button>
          </div>

          {/* Phone Card */}
          <div className="bg-[#F8FAFC] rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                📞
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">رقم الهاتف</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {data.phone || '+20 101 234 5678'}
                </p>
              </div>
            </div>
            <button 
              disabled
              className="text-sm text-[#9CA3AF] font-medium cursor-not-allowed"
            >
              غير متاح
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Change Password - Not Available */}
      <div className="border-b border-[#E5E7EB]">
        <button
          onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
          className="w-full p-7 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔑</span>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">تغيير كلمة المرور</h3>
              <p className="text-xs text-[#F59E0B]">غير متاح حالياً</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#6B7280] transition-transform ${
              isPasswordSectionOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isPasswordSectionOpen && (
          <div className="px-7 pb-7 animate-fade-in">
            <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-[10px] p-4 flex gap-3 mb-5">
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-[#92400E]">
                تغيير كلمة المرور غير متاح حالياً من خلال لوحة التحكم. يرجى التواصل مع الدعم الفني.
              </p>
            </div>

            <div className="max-w-md space-y-5 opacity-50 pointer-events-none">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  كلمة المرور الحالية <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.current}
                    disabled
                    className="w-full h-12 px-4 pr-12 border border-[#E5E7EB] rounded-[10px] text-sm bg-[#F3F4F6]"
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  >
                    {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  كلمة المرور الجديدة <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.new}
                    disabled
                    className="w-full h-12 px-4 pr-12 border border-[#E5E7EB] rounded-[10px] text-sm bg-[#F3F4F6]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled
                className="w-full h-12 bg-[#E5E7EB] text-[#9CA3AF] rounded-xl font-semibold cursor-not-allowed"
              >
                تحديث كلمة المرور
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Danger Zone - Not Available */}
      <div className="p-7">
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[14px] p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-xl font-semibold text-[#EF4444]">منطقة الخطر</h3>
              <p className="text-xs text-[#9CA3AF]">غير متاح حالياً</p>
            </div>
          </div>

          {/* Deactivate Account */}
          <div className="flex items-center justify-between py-4 border-b border-[#FECACA] opacity-50">
            <div>
              <h4 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">
                تعطيل الحساب مؤقتاً
              </h4>
              <p className="text-[13px] text-[#6B7280]">
                سيتم إخفاء مطعمك من التطبيق ولكن يمكنك إعادة تفعيله لاحقاً
              </p>
            </div>
            <button 
              disabled
              className="px-5 py-2.5 border-2 border-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-sm font-medium cursor-not-allowed"
            >
              غير متاح
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between pt-4 opacity-50">
            <div>
              <h4 className="text-[15px] font-semibold text-[#EF4444] mb-1">
                حذف الحساب نهائياً
              </h4>
              <p className="text-[13px] text-[#6B7280]">
                سيتم حذف جميع بياناتك بشكل نهائي ولا يمكن استرجاعها أبداً
              </p>
            </div>
            <button
              disabled
              className="px-5 py-2.5 bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-sm font-medium cursor-not-allowed"
            >
              غير متاح
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
