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
    label: 'جاري التحضير ',
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
  const payStatues=StatusConfigPay[order.payment_status || 'pending'] || StatusConfigPay.pending;
  const PayStatusIcon = payStatues.icon;
  
  const showChatButton = ['pending', 'cooking', 'delivering'].includes(order.status);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const displayName = order.restaurant_name || `مطعم #${order.restaurant_id}`;

  return (
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden mx-4 mb-4 transition-all"
      style={{ borderColor: '#E5E7EB', borderWidth: '1px' }}
    >
      <div className="p-4 pb-3 flex items-start gap-2">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderWidth: '1px' }}
        >
          <span style={{ fontSize: '1.25rem' }}>🍽️</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            className="truncate mb-1"
            style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A1A' }}
          >
            {displayName}
          </h3>
          <div className="flex items-center  gap-10">
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>
              تاريخ الطلب: {formatDate(order.order_date)}
            </p>
            <p 
              className="shrink-0"
              style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6B7280' }}
            >
              #{order.id}
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '0 16px' }} />

      {order.items && order.items.length > 0 && (
        <div className="p-4 py-3">
          {order.items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between mb-2 last:mb-0"
            >
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                🍴 {item.name} <span style={{ color: '#9CA3AF' }}>x{item.quantity}</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                {(item.price * item.quantity).toFixed(2)} ج.م
              </span>
            </div>
          ))}

          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '12px 0 8px' }} />
        </div>
      )}

      <div className="p-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>الإجمالي:</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#E5A04D' }}>
            {order.total_amount} ج.م
          </span>
        </div>
      <div className="h-2"/>


        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            {order.is_reservation ? (
              <>
                <Calendar className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>حجز</span>
                
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>توصيل</span>
              </>
            )}
          </div>
    

          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <StatusIcon className="w-3.5 h-3.5" style={{ color: statusInfo.color }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusInfo.color }}>
              {statusInfo.label}
            </span>
          </div>
          
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: payStatues.bgColor }}
          >
            <PayStatusIcon className="w-3.5 h-3.5" style={{ color: payStatues.color }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: payStatues.color }}>
              {payStatues.label}
            </span>
          </div>
        
          
        </div>

        {order.is_reservation!=false && order.reservation_date!=null && (
          <div 
            className="p-3 rounded-lg mb-3"
            style={{ backgroundColor: '#FEF3E2' }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#E5A04D' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>
                موعد الحجز: {formatDate(order.reservation_date)}
              </span>
            </div>
          </div>
        )}

        {showChatButton && order.is_reservation==true && (
          <div className="flex gap-2">
            <button 
              onClick={() => onChatClick(order.id, displayName)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all active:scale-[0.98] min-h-11 relative"
              style={{ 
                borderColor: '#E5A04D',
                borderWidth: '1px',
                color: '#E5A04D',
                fontWeight: 500
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة المطعم</span>
          
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
