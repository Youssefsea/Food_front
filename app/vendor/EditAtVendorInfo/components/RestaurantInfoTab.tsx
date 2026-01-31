'use client';

import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

interface RestaurantData {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  open_time?: string;
  close_time?: string;
 
}

interface RestaurantInfoTabProps {
  data: RestaurantData;
  onChange: (data: Partial<RestaurantData>) => void;
}

export function RestaurantInfoTab({ data, onChange }: RestaurantInfoTabProps) {


    


  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Section 1: Branding - Visual Only (Not saved to backend) */}
      <div className="p-7 border-b border-[#E5E7EB]">
        {/* <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">الهوية البصرية</h3>
          <p className="text-sm text-[#6B7280]">شعار المطعم وصورة الغلاف</p>
          <p className="text-xs text-[#F59E0B] mt-1">⚠️ هذه الخاصية غير متاحة حالياً في الخادم</p>
        </div> */}

        <div className="flex gap-8 flex-wrap">
          {/* Logo Upload */}
          {/* <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-[120px] h-[120px] rounded-full border-4 border-[#E5E7EB] overflow-hidden bg-[#F3F4F6] flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-[#9CA3AF]">🍽️</span>
                )}
              </div>
              <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <Upload className="w-7 h-7 text-white" />
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
            <button
              onClick={() => document.getElementById('logo-upload')?.click()}
              className="text-sm text-[#E5A04D] hover:underline font-medium"
            >
              تغيير الشعار
            </button>
            <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <div className="text-center">
              <p className="text-xs text-[#9CA3AF]">PNG, JPG حتى 2MB</p>
              <p className="text-xs text-[#9CA3AF]">200×200 بكسل موصى به</p>
            </div>
          </div> */}

          {/* Cover Upload */}
          {/* <div className="flex-1 min-w-[300px]">
            <div className="relative group">
              <div className="w-full h-[180px] rounded-xl overflow-hidden bg-[#F3F4F6] border-2 border-dashed border-[#E5E7EB]">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-[#9CA3AF] mb-2" />
                    <span className="text-sm text-[#6B7280]">صورة الغلاف</span>
                  </div>
                )}
              </div>
              <label className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-white mb-2" />
                <span className="text-sm text-white">تغيير الغلاف</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-2">1200×400 بكسل للحصول على أفضل عرض</p>
          </div> */}
        </div>
      </div> 

      {/* Section 2: Basic Information - Synced with Backend */}
      <div className="p-7 border-b border-[#E5E7EB]">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">المعلومات الأساسية</h3>
          <p className="text-sm text-[#6B7280]">المعلومات التي تظهر للعملاء في التطبيق</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Restaurant Name - Read Only from Backend */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              اسم المطعم
            </label>
            <input
              type="text"
              value={data.name || ''}
  onChange={(e) => {
                if (e.target.value.length <= 500) {
                  onChange({ ...data, name: e.target.value });
                }
              }}
              className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] text-sm text-[#6B7280] "
            />

          </div>

          {/* Phone Number  */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              رقم الهاتف
            </label>
            <div className="flex">
              <div className="flex items-center px-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-r-[10px] border-l-0">
                <span className="text-sm text-[#6B7280]">+20</span>
              </div>
              <input
                type="tel"
                value={data.phone || ''}
                  onChange={(e) => {
                if (e.target.value.length <= 500) {
                  onChange({ ...data, phone: e.target.value });
                }
              }}
                className="flex-1 h-12 px-4 bg-[#F3F4F6] border border-[#E5E7EB] rounded-l-[10px] text-sm text-[#6B7280] "
              />
            </div>
          </div>

          {/* Email  */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={data.email || ''}
                  onChange={(e) => {
                if (e.target.value.length <= 500) {
                  onChange({ ...data, email: e.target.value });
                }
              }}
                className="w-full h-12 px-4 pr-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] text-sm text-[#6B7280] "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">✉️</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#D1FAE5] text-[#10B981] rounded-xl text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                موثق
              </span>
            </div>
          </div>

          {/* Description - Editable ✓ */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              وصف المطعم <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  onChange({ ...data, description: e.target.value });
                }
              }}
              placeholder="اكتب وصفاً جذاباً لمطعمك يجذب العملاء..."
              rows={4}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D] resize-vertical transition-all"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-[#9CA3AF]">وصف جيد يساعد العملاء على اختيار مطعمك</p>
              <p className="text-xs text-[#9CA3AF]">{(data.description || '').length}/500</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Working Hours - Synced with Backend */}
      <div className="p-7">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">أوقات العمل</h3>
          <p className="text-sm text-[#6B7280]">حدد أوقات الفتح والإغلاق</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Open Time */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              وقت الفتح <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
            </label>
            <input
              type="time"
              value={data.open_time || ''}
              onChange={(e) => onChange({ ...data, open_time: e.target.value })}
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D] transition-all"
            />
          </div>

          {/* Close Time */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              وقت الإغلاق <span className="text-[#10B981] text-xs">(قابل للتعديل)</span>
            </label>
            <input
              type="time"
              value={data.close_time || ''}
              onChange={(e) => onChange({ ...data, close_time: e.target.value })}
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D] transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
