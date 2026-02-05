'use client';

import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, CheckCircle, Loader2, Lock, AlertCircle } from 'lucide-react';
import api from '../../../../axios';

interface AccountData {
  email?: string;
  phone?: string;
}

interface AccountSecurityTabProps {
  data: AccountData;
  onChange?: (data: Partial<AccountData>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AccountSecurityTab({ data: _data }: AccountSecurityTabProps) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // حساب قوة كلمة المرور
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const strengthLabels = ['', 'ضعيفة', 'متوسطة', 'قوية', 'ممتازة'];
  const strengthColors = ['#E5E7EB', '#EF4444', '#F59E0B', '#10B981', '#10B981'];
  const passwordStrength = calculatePasswordStrength(passwordData.new);

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle input change
  const handlePasswordChange = (field: 'current' | 'new' | 'confirm', value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  // Validation
  const validatePasswords = (): string | null => {
    if (!passwordData.current) {
      return 'يرجى إدخال كلمة المرور الحالية';
    }
    if (!passwordData.new) {
      return 'يرجى إدخال كلمة المرور الجديدة';
    }
    if (passwordData.new.length < 8) {
      return 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل';
    }
    if (!passwordData.confirm) {
      return 'يرجى تأكيد كلمة المرور الجديدة';
    }
    if (passwordData.new !== passwordData.confirm) {
      return 'كلمة المرور الجديدة وتأكيدها غير متطابقتين';
    }
    if (passwordData.current === passwordData.new) {
      return 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية';
    }
    return null;
  };

  // Submit password change
  const handleChangePassword = async () => {
    const validationError = validatePasswords();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await api.put('/restaurant/change-password', {
        oldPassword: passwordData.current,
        newPassword: passwordData.new,
      });

      setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح ✓' });
      // Clear form
      setPasswordData({ current: '', new: '', confirm: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      
      const err = error as { response?: { data?: { error?: string } } };
      if (err.response?.data?.error === 'Old password is incorrect') {
        setMessage({ type: 'error', text: 'كلمة المرور الحالية غير صحيحة' });
      } else {
        setMessage({ type: 'error', text: 'حدث خطأ أثناء تغيير كلمة المرور' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = passwordData.current && passwordData.new && passwordData.confirm && 
                      passwordData.new === passwordData.confirm && passwordData.new.length >= 8;

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="h-7" />

      {/* Section: Change Password */}
      <div className="border-b border-[#E5E7EB]">
        <button
          onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
          className="w-full p-7 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">تغيير كلمة المرور</h3>
              <p className="text-xs text-[#6B7280]">تحديث كلمة المرور لحسابك</p>
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
            {/* Status Message */}
            {message && (
              <div className={`mb-5 p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.type === 'success' 
                  ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                }
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <div className="max-w-md space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  كلمة المرور الحالية <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                    placeholder="أدخل كلمة المرور الحالية"
                    className="w-full h-12 px-4 pr-4 pl-12 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E5A04D] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
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
                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
                    className="w-full h-12 px-4 pr-4 pl-12 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E5A04D] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.new && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: level <= passwordStrength ? strengthColors[passwordStrength] : '#E5E7EB'
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColors[passwordStrength] }}>
                      قوة كلمة المرور: {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  تأكيد كلمة المرور الجديدة <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirm}
                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    className={`w-full h-12 px-4 pr-4 pl-12 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E5A04D] focus:border-transparent transition-all ${
                      passwordData.confirm && passwordData.new !== passwordData.confirm 
                        ? 'border-red-300 bg-red-50' 
                        : passwordData.confirm && passwordData.new === passwordData.confirm
                        ? 'border-green-300 bg-green-50'
                        : 'border-[#E5E7EB]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordData.confirm && passwordData.new !== passwordData.confirm && (
                  <p className="text-xs text-red-500 mt-2">كلمتا المرور غير متطابقتين</p>
                )}
                {passwordData.confirm && passwordData.new === passwordData.confirm && (
                  <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> كلمتا المرور متطابقتين
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleChangePassword}
                disabled={!isFormValid || isLoading}
                className={`w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  isFormValid && !isLoading
                    ? 'bg-[#E5A04D] text-white hover:bg-[#D4903C] cursor-pointer'
                    : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  'تحديث كلمة المرور'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />

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
