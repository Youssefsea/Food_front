'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import api from '../../../../axios';

type OrderStatus = 'pending' | 'paid' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'confirmed' | 'rejected';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  items: Array<{
    dish_name: string;
    quantity: number;
  }>;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  is_reservation?: number;
  reservation_date?: string;
  reservation_time?: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
  onStatusChange: () => void;
}

const orderStatusConfig: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'قيد الانتظار', bg: '#FEF3C7', text: '#F59E0B' },
  paid: { label: 'تم الدفع', bg: '#DBEAFE', text: '#3B82F6' },
  cooking: { label: 'جاري التحضير', bg: '#EDE9FE', text: '#8B5CF6' },
  delivering: { label: 'جاري التوصيل', bg: '#CFFAFE', text: '#06B6D4' },
  completed: { label: 'مكتمل', bg: '#D1FAE5', text: '#10B981' },
  cancelled: { label: 'ملغي', bg: '#FEE2E2', text: '#EF4444' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'في الانتظار', bg: '#FEF3C7', text: '#F59E0B' },
  confirmed: { label: 'تم الدفع', bg: '#D1FAE5', text: '#10B981' },
  rejected: { label: 'مرفوض', bg: '#FEE2E2', text: '#EF4444' },
};

const statusOrder: OrderStatus[] = ['pending', 'cooking', 'delivering', 'completed'];

export function RecentOrdersTable({ orders, onStatusChange }: RecentOrdersTableProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'cooking' | 'completed'>('all');
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<number, PaymentStatus>>({});
  const [loadingPayments, setLoadingPayments] = useState(true);

  const filters = [
    { id: 'all', label: 'الكل' },
    { id: 'pending', label: 'قيد الانتظار' },
    { id: 'cooking', label: 'جاري التحضير' },
    { id: 'completed', label: 'مكتمل' },
  ];

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      setLoadingPayments(true);
      const statuses: Record<string, PaymentStatus> = {};
      
      await Promise.all(
        orders.map(async (order) => {
          try {
            const res = await api.post('/restaurant/payment-status', { orderId: order.id });
            statuses[order.id] = res.data.paymentStatus as PaymentStatus;
          } catch {
            statuses[order.id] = 'pending';
          }
        })
      );
      
      setPaymentStatuses(statuses);
      setLoadingPayments(false);
    };

    if (orders.length > 0) {
      fetchPaymentStatuses();
    }
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const handleStatusChange = async (orderId: number, currentStatus: OrderStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= statusOrder.length - 1) return;
    
    const newStatus = statusOrder[currentIndex + 1];
    setUpdatingOrder(orderId);
    
    try {
      await api.post('/restaurant/order-status', {
        orderId,
        status: newStatus,
      });
      onStatusChange();
    } catch {
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${Math.floor(diffHours / 24)} يوم`;
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#E5A04D', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const isHighPriority = (orderId: number, orderStatus: OrderStatus) => {
    return paymentStatuses[orderId] === 'confirmed' && orderStatus === 'pending';
  };

  const hasPriorityOrders = filteredOrders.some((order) => isHighPriority(order.id, order.status));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-[#1A1A1A]">آخر الطلبات</h2>
        
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#E5A04D] text-white shadow-md'
                  : 'bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-[#6B7280]">
            لا توجد طلبات
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    {[
                      'رقم الطلب',
                      'العميل',
                      'الطلب',
                      'المبلغ',
                      'حالة الدفع',
                      'حالة الطلب',
                      'الوقت',
                    ].map((title) => (
                      <th
                        key={title}
                        className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase whitespace-nowrap"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.slice(0, 10).map((order, index) => {
                    const orderStatusInfo = orderStatusConfig[order.status];
                    const paymentStatus = paymentStatuses[order.id] || 'pending';
                    const paymentStatusInfo = paymentStatusConfig[paymentStatus];
                    const isPriority = isHighPriority(order.id, order.status);

                    return (
                      <tr
                        key={order.id}
                        className={`border-t transition-colors ${
                          isPriority
                            ? 'bg-[#FEF3E2] hover:bg-[#FED7AA]'
                            : index % 2 === 0
                            ? 'bg-white hover:bg-[#F9FAFB]'
                            : 'bg-[#FAFAFA] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#6B7280] whitespace-nowrap">
                          #{order.id}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: getAvatarColor(order.customer_name || 'U') }}
                            >
                              {order.customer_name?.[0] || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[#1A1A1A]">
                                {order.customer_name || 'عميل'}
                              </div>
                              <div className="text-xs text-[#9CA3AF]">
                                {order.customer_phone || '-'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#6B7280] max-w-[260px] truncate">
                          {order.items?.map((item, i) => (
                            <span key={i}>
                              {item.dish_name} × {item.quantity}
                              {i < order.items.length - 1 ? ', ' : ''}
                            </span>
                          )) || '-'}
                        </td>

                        <td className="px-6 py-4 text-base font-bold text-[#E5A04D] whitespace-nowrap">
                          {order.total_amount?.toLocaleString('ar-EG')} ج.م
                        </td>

                        <td className="px-6 py-4">
                          {loadingPayments ? (
                            <div className="inline-flex px-3 py-1 rounded-full bg-gray-100 animate-pulse">
                              <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            </div>
                          ) : (
                            <span
                              className="inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                              style={{ backgroundColor: paymentStatusInfo.bg, color: paymentStatusInfo.text }}
                            >
                              {paymentStatusInfo.label}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleStatusChange(order.id, order.status)}
                            disabled={
                              updatingOrder === order.id ||
                              order.status === 'completed' ||
                              order.status === 'cancelled'
                            }
                            className="min-w-[140px] flex items-center justify-between px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
                            style={{ backgroundColor: orderStatusInfo.bg, color: orderStatusInfo.text }}
                          >
                            <span>{orderStatusInfo.label}</span>
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <ChevronDown className="w-4 h-4 opacity-70" />
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#9CA3AF] whitespace-nowrap">
                          {getTimeAgo(order.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="block lg:hidden space-y-4 p-4">
              {filteredOrders.slice(0, 10).map((order) => {
                const orderStatusInfo = orderStatusConfig[order.status];
                const paymentStatus = paymentStatuses[order.id] || 'pending';
                const paymentStatusInfo = paymentStatusConfig[paymentStatus];
                const isPriority = isHighPriority(order.id, order.status);

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl p-4 border shadow-sm ${
                      isPriority ? 'bg-[#FEF3E2] border-[#F59E0B]' : 'bg-white border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm text-[#1A1A1A]">طلب #{order.id}</span>
                      <span className="text-xs text-[#9CA3AF]">
                        {getTimeAgo(order.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: getAvatarColor(order.customer_name || 'U') }}
                      >
                        {order.customer_name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1A1A1A]">
                          {order.customer_name || 'عميل'}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {order.customer_phone || '-'}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-[#6B7280] mb-3">
                      {order.items?.map((item, i) => (
                        <span key={i}>
                          {item.dish_name} × {item.quantity}
                          {i < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span>{order.is_reservation === 0 ? ' توصيل فوري ' : 'حجز مسبق '}</span>
                    </div>
                    {order.is_reservation === 1 && (
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-[#6B7280]">تاريخ الحجز</span>
                        <span className="font-bold text-[#E5A04D]">
                          {order.reservation_date ? (
                            (new Date(order.reservation_date).getHours()) +
                            ':' +
                            new Date(order.reservation_date).getMinutes() +
                            ' ' +
                            new Date(order.reservation_date).toLocaleDateString('ar-EG')
                          ) : '—'}

                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-[#6B7280]">الإجمالي</span>
                      <span className="font-bold text-[#E5A04D]">
                        {order.total_amount?.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280]">حالة الدفع:</span>
                        {loadingPayments ? (
                          <div className="inline-flex px-3 py-1 rounded-full bg-gray-100 animate-pulse">
                            <div className="w-16 h-4 bg-gray-200 rounded"></div>
                          </div>
                        ) : (
                          <span
                            className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: paymentStatusInfo.bg, color: paymentStatusInfo.text }}
                          >
                            {paymentStatusInfo.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280]">حالة الطلب:</span>
                        <span
                          className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: orderStatusInfo.bg, color: orderStatusInfo.text }}
                        >
                          {orderStatusInfo.label}
                        </span>
                      </div>

                      <button
                        onClick={() => handleStatusChange(order.id, order.status)}
                        disabled={
                          updatingOrder === order.id ||
                          order.status === 'completed' ||
                          order.status === 'cancelled'
                        }
                        className="w-full py-2 rounded-xl text-sm font-semibold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: orderStatusInfo.text, color: orderStatusInfo.text }}
                      >
                        {updatingOrder === order.id ? 'جاري التحديث...' : 'تحديث حالة الطلب'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasPriorityOrders && (
          <div className="px-6 py-4 bg-[#FEF3E2] border-t border-[#F59E0B]">
            <p className="text-sm text-[#F59E0B] font-medium">
              ⚠️ لديك طلبات مدفوعة في انتظار البدء - ابدأ التحضير الآن
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
