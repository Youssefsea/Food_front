'use client';

interface EmptyOrdersStateProps {
  searchQuery?: string;
  selectedStatus?: string | null;
}

export function EmptyOrdersState({ searchQuery, selectedStatus }: EmptyOrdersStateProps) {
  let message = 'لا توجد طلبات حالياً';
  
  if (searchQuery) {
    message = 'لم يتم العثور على نتائج للبحث';
  } else if (selectedStatus && selectedStatus !== 'all') {
    const statusLabels: Record<string, string> = {
      pending: 'قيد الانتظار',
      paid: 'تم الدفع',
      cooking: 'جاري التحضير',
      delivering: 'جاري التوصيل',
      completed: 'مكتملة',
      cancelled: 'ملغية',
    };
    message = `لا توجد طلبات ${statusLabels[selectedStatus] || ''}`;
  }

  return (
    <div className="bg-white rounded-2xl p-20 text-center">
      <div className="text-8xl mb-4">📋</div>
      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">لا توجد طلبات</h3>
      <p className="text-sm text-[#6B7280]">{message}</p>
    </div>
  );
}
