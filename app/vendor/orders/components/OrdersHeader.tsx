'use client';

import { ClipboardList } from 'lucide-react';

interface OrdersHeaderProps {
  activeOrdersCount: number;
}

export function OrdersHeader({ activeOrdersCount }: OrdersHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB] mb-6">
      <div className="flex items-center gap-4">
        <div className="w-[52px] h-[52px] bg-[#FEF3E2] rounded-full flex items-center justify-center">
          <ClipboardList className="w-6 h-6 text-[#E5A04D]" />
        </div>
        <div className='gap-1 flex flex-col'>
          <h1 className="text-[28px] font-bold text-[#1A1A1A] leading-tight">إدارة الطلبات</h1>
          <p className="text-sm text-[#6B7280]">عرض وإدارة جميع الطلبات الواردة</p>
        </div>
        {activeOrdersCount > 0 && (
          <span className="px-3.5 py-1.5 bg-[#D1FAE5] text-[#10B981] rounded-full text-[13px] font-semibold flex items-center gap-3">
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            {activeOrdersCount} طلب نشط
          </span>
        )}
      </div>
    </div>
  );
}
