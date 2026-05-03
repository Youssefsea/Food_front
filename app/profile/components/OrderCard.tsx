'use client';

import { MessageCircle, Truck, Calendar, CheckCircle, XCircle, Clock, ChefHat } from "lucide-react";
import { Order, OrderStatus } from "../types";

interface OrderCardProps {
  order: Order;
  onChatClick: (orderId: number, restaurantName: string) => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  pending: {
    label: 'في انتظار تأكيد المطعم',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: Clock
  },
  cooking: {
    label: 'جاري التحضير',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    icon: ChefHat
  },
  delivering: {
    label: 'جاري التوصيل',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    icon: Truck
  },
  completed: {
    label: 'تم التوصيل',
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: CheckCircle
  },
  cancelled: {
    label: 'ملغي',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    icon: XCircle
  }
};

const StatusConfigPay: Record<'pending' | 'confirmed' | 'rejected', { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  pending: {
    label: 'الدفع معلق',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: Clock
  },
  confirmed: {
    label: 'تم الدفع',
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: CheckCircle
  },
  rejected: {
    label: 'فشل الدفع',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    icon: XCircle
  }
};

export function OrderCard({ order, onChatClick }: OrderCardProps) {
  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const payStatus = StatusConfigPay[order.payment_status || 'pending'] || StatusConfigPay.pending;
  const PayStatusIcon = payStatus.icon;

  const showChatButton =
    ['pending', 'cooking', 'delivering'].includes(order.status) &&
    order.payment_status === 'confirmed';

  const displayName = order.restaurant_name || `مطعم #${order.restaurant_id}`;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return d;
    }
  };

  return (
    <div
      className="mx-4 mb-3 rounded-2xl overflow-hidden"
      style={{ background: '#fff', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}
    >
      {/* Top: restaurant + order id */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'linear-gradient(135deg,#fff3e0,#ffe0b2)' }}
        >
          🍽️
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm truncate" style={{ color: '#1a1a1a' }}>{displayName}</h3>
            <span
              className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-lg"
              style={{ background: '#fff3e0', color: '#e5a04d' }}
            >
              #{order.id}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
            {formatDate(order.order_date)}
          </p>
        </div>
      </div>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <>
          <div style={{ height: '1px', background: '#f3f4f6', margin: '0 16px' }} />
          <div className="px-4 py-3 space-y-1.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#4b5563' }}>
                  🍴 {item.name}
                  <span className="ml-1 text-xs" style={{ color: '#9ca3af' }}>x{item.quantity}</span>
                </span>
                <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>
                  {(item.price * item.quantity).toFixed(2)} ج.م
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ height: '1px', background: '#f3f4f6', margin: '0 16px' }} />
      <div className="px-4 py-3">
        {/* Total */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold" style={{ color: '#6b7280' }}>الإجمالي</span>
          <span className="text-lg font-black" style={{ color: '#FF6B35' }}>{order.total_amount} ج.م</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: statusInfo.bgColor }}
          >
            <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
            <span className="text-xs font-bold" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: payStatus.bgColor }}
          >
            <PayStatusIcon className="w-3 h-3" style={{ color: payStatus.color }} />
            <span className="text-xs font-bold" style={{ color: payStatus.color }}>{payStatus.label}</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: '#f3f4f6' }}
          >
            {order.is_reservation
              ? <><Calendar className="w-3 h-3 text-gray-500" /><span className="text-xs font-bold text-gray-500">حجز</span></>
              : <><Truck className="w-3 h-3 text-gray-500" /><span className="text-xs font-bold text-gray-500">توصيل</span></>
            }
          </div>
        </div>

        {/* Reservation date */}
        {order.is_reservation && order.reservation_date && (
          <div
            className="mt-3 p-3 rounded-xl flex items-center gap-2"
            style={{ background: '#fff3e0' }}
          >
            <Calendar className="w-4 h-4 shrink-0" style={{ color: '#E5A04D' }} />
            <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
              موعد الحجز: {formatDate(order.reservation_date)}
            </span>
          </div>
        )}

        {/* Chat button */}
        {showChatButton && order.is_reservation && (
          <button
            onClick={() => onChatClick(order.id, displayName)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform"
            style={{ background: '#fff3e0', color: '#E5A04D', border: '1.5px solid #e5a04d' }}
          >
            <MessageCircle className="w-4 h-4" />
            محادثة المطعم
          </button>
        )}
      </div>
    </div>
  );
}