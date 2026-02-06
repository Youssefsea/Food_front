'use client';

import { Info } from "lucide-react";

export function NoticeBanner() {
  return (
    <div className="mx-5 mt-4 bg-[#DBEAFE] border border-[#93C5FD] rounded-xl p-3.5 flex gap-3">
      <Info className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
      <div>
        <div className="text-[14px] font-semibold text-[#1E40AF] mb-1">ملاحظة هامة</div>
        <div className="text-[13px] text-[#3B82F6] leading-relaxed">
          سلتك تحتوي على أصناف من مطاعم مختلفة. سيتم إنشاء طلب منفصل لكل مطعم برسوم توصيل مستقلة.
        </div>
      </div>
    </div>
  );
}
