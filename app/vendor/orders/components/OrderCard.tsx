'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, MapPin, Phone, MoreVertical, Eye, X, ChevronDown, MessageCircle } from 'lucide-react';
import { Order, OrderStatus, statusConfig } from '../types'
import Link from "next/link";
interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
  onCancel: (orderId: number) => void;
 
}

export function OrderCard({ order, onStatusChange, onViewDetails, onCancel }: OrderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const showChatButton = order.is_reservation && order.payment_status === 'confirmed';
  const statusInfo = statusConfig[order.status];
  const timeAgo = getTimeAgo(order.created_at);
  const visibleItems = order.items.slice(0, 3);
  const hiddenCount = order.items.length - 3;
  const subtotal = order.total_amount - (order.delivery_fee || 0);

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 relative mx-3 my-3 overflow-hidden border border-gray-100 flex flex-col"
      style={{ borderRight: order.payment_status ? '4px solid #3B82F6' : 'none' }}
    >
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          <span className="text-base font-bold text-gray-900 font-mono">
            #{order.id}
          </span>

          {order.is_reservation && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
              📅 حجز
            </span>
          )}
          {order.is_reservation==false && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
              🛍️ طلب فوري
            </span>
          )}


          <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{timeAgo}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
          >
            <span>{statusInfo.label}</span>
            <span>{statusInfo.icon}</span>
            <span className="hidden xs:inline">{statusInfo.label}</span>
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                  <button
                    onClick={() => { onViewDetails(order); setShowMenu(false); }}
                    className="w-full px-4 py-2.5 text-right text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span>عرض التفاصيل</span>
                  </button>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => { onCancel(order.id); setShowMenu(false); }}
                      className="w-full px-4 py-2.5 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                      <span>إلغاء الطلب</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col gap-5 p-4 sm:p-5">
        
        {/* Customer Card */}
        <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {order.customer_name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate">
                {order.customer_name || 'عميل غير مسجل'}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{order.customer_phone || 'غير متوفر'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-xs text-gray-600 mb-3 bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-2 leading-relaxed">{order.location || 'العنوان غير محدد'}</span>
          </div>

          {order.payment_status === 'confirmed' && order.is_reservation === true && (
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold text-center">
              ✓ تم الدفع بنجاح
            </div>
          ) }

          {order.payment_status !== 'confirmed' && order.is_reservation === true && (
            <div className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <span className="animate-pulse">⏳</span> في انتظار الدفع
            </div>
          )}
        </div>

        {/* Order Details */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">تفاصيل الأصناف</h4>
          <div className="space-y-3 mb-4">
            {visibleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.dish_image ? (
                    <Image
                      src={item.dish_image}
                      alt={item.dish_name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover shadow-sm border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg border border-gray-200 shadow-sm">
                      🍽️
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.dish_name}</p>
                    <span className="text-xs font-bold text-orange-500">
                      الكمية: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  {item.price * item.quantity} ج.م
                </span>
              </div>
            ))}
            {hiddenCount > 0 && (
              <button onClick={() => onViewDetails(order)} className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors mt-1 w-full text-right">
                + عرض {hiddenCount} صنف آخر
              </button>
            )}
          </div>

          {/* Receipt / Totals */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 border border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">المجموع الفرعي</span>
              <span className="text-gray-900 font-semibold">{subtotal} ج.م</span>
            </div>
            {order.delivery_fee > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">رسوم التوصيل</span>
                <span className="text-gray-900 font-semibold">{order.delivery_fee} ج.م</span>
              </div>
            )}
            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">الإجمالي النهائي</span>
              <span className="text-lg font-black text-orange-500">{order.total_amount} ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Banner */}
      {order.is_reservation && order.reservation_date && (
        <div className="bg-purple-50 border-y border-purple-100 px-4 py-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span className="text-sm font-bold text-purple-800">
            {new Date(order.reservation_date).toLocaleDateString('ar-EG', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Footer / Actions Container */}
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Status Dropdown Button */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full md:w-48 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-bold text-sm hover:shadow-md hover:from-orange-600 hover:to-orange-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-between shadow-sm"
            >
              <span>تحديث الحالة</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showStatusDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)} />
                <div className="absolute right-0 md:left-0 bottom-full mb-2 w-full md:w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 max-h-64 overflow-y-auto">
                  {(Object.entries(statusConfig) as [OrderStatus, typeof statusConfig[OrderStatus]][]).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => { onStatusChange(order.id, key); setShowStatusDropdown(false); }}
                      className="w-full px-4 py-3 md:py-2.5 text-right text-sm hover:bg-gray-50 flex items-center justify-between gap-2 transition-colors"
                      style={{ backgroundColor: order.status === key ? config.bg : 'transparent' }}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="flex-shrink-0 text-base">{config.icon}</span>
                        <span className="font-semibold" style={{ color: order.status === key ? config.color : '#374151' }}>
                          {config.label}
                        </span>
                      </span>
                      {order.status === key && <span className="text-emerald-500 flex-shrink-0 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons (Unified responsive layout) */}
          <div className="grid grid-cols-2 md:flex items-center gap-2">
            {showChatButton && 
<Link href={`/vendor/chat/${order.chat_room_id}`} passHref>
  <button className="py-2.5 px-3 bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm">
    <MessageCircle className="w-4 h-4" />
    <span>محادثة</span>
  </button>
</Link>
}
            <button
              onClick={() => onViewDetails(order)}
              className="py-2.5 px-3 bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>التفاصيل</span>
            </button>
            {order.status === 'pending' && (
              <button
                onClick={() => onCancel(order.id)}
                className="col-span-2 md:col-span-1 py-2.5 px-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>إلغاء الطلب</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} د`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `منذ ${diffHours} س`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `منذ ${diffDays} يوم`;

  return then.toLocaleDateString('ar-EG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}