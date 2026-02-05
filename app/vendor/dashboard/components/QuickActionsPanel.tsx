'use client';

import { PlusCircle, Settings, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActionsPanel() {
  const router = useRouter();

  const actions = [
    {
      id: 1,
      icon: PlusCircle,
      iconColor: '#E5A04D',
      title: 'الاطباق',
      description: 'اجراءات السريعة لإدارة الأطباق',
      buttonText: ' الى الأطباق',
      buttonStyle: 'solid' as const,
      onClick: () => router.push('/vendor/dishes'),
    },
    {
      id: 2,
      icon: Settings,
      iconColor: '#6B7280',
      title: 'تعديل معلومات المطعم',
      description: 'تحديث البيانات والمواعيد',
      buttonText: 'تعديل',
      buttonStyle: 'outlined' as const,
      onClick: () => router.push('/vendor/EditAtVendorInfo'),
    },
    {
      id: 3,
      icon: FileText,
      iconColor: '#3B82F6',
      title: 'عرض كل الطلبات',
      description: 'تصفح وإدارة جميع الطلبات',
      buttonText: 'عرض',
      buttonStyle: 'outlined-primary' as const,
      onClick: () => router.push('/vendor/orders'),
    },
  ];

  return (
    <section className="space-y-6 ">
      <h2 className="text-xl font-bold text-[#1A1A1A]">إجراءات سريعة</h2>
        <div className="h-5" />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#E5E7EB] hover:border-[#E5A04D]"
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <Icon
                  className="w-12 h-12"
                  style={{ color: action.iconColor }}
                />
              </div>

              {/* Title */}
              <h3 className="font-bold text-[#1A1A1A] mb-2">{action.title}</h3>

              {/* Description */}
              <p className="text-sm text-[#6B7280] mb-4">
                {action.description}
              </p>

              {/* Button */}
              <button
                onClick={action.onClick}
                className={`w-full py-2.5 rounded-xl transition-all font-medium text-sm ${
                  action.buttonStyle === 'solid'
                    ? 'bg-[#E5A04D] text-white hover:bg-[#D4903D] shadow-sm'
                    : action.buttonStyle === 'outlined'
                    ? 'border-2 border-[#6B7280] text-[#6B7280] hover:bg-[#F3F4F6]'
                    : 'border-2 border-[#E5A04D] text-[#E5A04D] hover:bg-[#FEF3E2]'
                }`}
              >
                {action.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
