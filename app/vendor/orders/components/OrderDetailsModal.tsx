'use client';

import { X, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Order, statusConfig } from '../types';
import Image from 'next/image';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const statusInfo = statusConfig[order.status];
  const subtotal = order.total_amount - (order.delivery_fee || 0);

  return (
    <div className='left-5 right-5 top-5 bottom-5'>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-7">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-[#E5A04D] to-[#D4903D] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">تفاصيل الطلب #{order.id}</h2>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              >
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Customer Info */}
            <div className="bg-[#F9FAFB] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <span className="text-xl">👤</span>
                معلومات العميل
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5A04D] to-[#D4903D] flex items-center justify-center text-white font-semibold text-lg">
                    {order.customer_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{order.customer_name || 'عميل'}</p>
                    <p className="text-sm text-[#6B7280]">العميل</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">{order.customer_phone || 'غير متوفر'}</span>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Mail className="w-4 h-4" />
                      <span>{order.customer_email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm text-[#6B7280]">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{order.location || 'غير محدد'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Time */}
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Clock className="w-4 h-4" />
              <span>تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>

            {/* Reservation Info */}
            {order.is_reservation && order.reservation_date && (
              <div className="bg-[#EDE9FE] rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="font-semibold text-[#5B21B6]">حجز مسبق</p>
                  <p className="text-sm text-[#7C3AED]">
                    {new Date(order.reservation_date).toLocaleDateString('ar-EG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <span className="text-xl">🍽️</span>
                الأصناف المطلوبة
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {item.dish_image ? (
                        <Image
                          src={item.dish_image}
                          alt={item.dish_name}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[#E5E7EB] flex items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{item.dish_name}</p>
                        <p className="text-sm text-[#6B7280]">{item.price} ج.م للواحدة</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-[#E5A04D] block">×{item.quantity}</span>
                      <span className="text-base font-bold text-[#1A1A1A]">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-[#E5E7EB] pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">المجموع الفرعي</span>
                <span className="text-[#1A1A1A]">{subtotal} ج.م</span>
              </div>
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">رسوم التوصيل</span>
                  <span className="text-[#1A1A1A]">{order.delivery_fee} ج.م</span>
                </div>
              )}
              <div className="bg-[#FEF3E2] px-4 py-3 rounded-xl flex justify-between items-center">
                <span className="text-lg font-semibold text-[#1A1A1A]">الإجمالي</span>
                <span className="text-2xl font-bold text-[#E5A04D]">{order.total_amount} ج.م</span>
              </div>
            </div>
          </div>
          <div className='h-2' />
          {/* Footer */}
          <div className="border-t border-[#E5E7EB] px-6 py-4 bg-[#F9FAFB]">
            <button
              onClick={onClose}
              className="w-full py-3  bg-[#E5A04D] text-white rounded-xl font-semibold hover:bg-[#D4903D] transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
