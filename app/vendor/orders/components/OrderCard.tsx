'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, MoreVertical, Eye, X, ChevronDown, MessageCircle } from 'lucide-react';
import { Order, OrderStatus, statusConfig } from '../types';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
  onCancel: (orderId: number) => void;
  onChatClick?: (orderId: number, customerName: string) => void;
}

export function OrderCard({ order, onStatusChange, onViewDetails, onCancel, onChatClick }: OrderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const showChatButton = order.is_reservation && order.payment_status === 'confirmed';

  const statusInfo = statusConfig[order.status];
  const timeAgo = getTimeAgo(order.created_at);
  const visibleItems = order.items.slice(0, 3);
  const hiddenCount = order.items.length - 3;

  const subtotal = order.total_amount - (order.delivery_fee || 0);

  const [paystatued, setPayStatued] = useState();

  useEffect(() => {
    setPayStatued(order.payment_status);
  }, [order.payment_status]);

  return (
    <div
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 relative mx-2 sm:mx-4 my-2 sm:my-3 overflow-hidden"
      style={{
        borderRight: paystatued ? '3px solid #3B82F6' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-[#F3F4F6] gap-2 sm:gap-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1 ">
          <span className="text-sm sm:text-base font-semibold text-[#1A1A1A] font-mono whitespace-nowrap">
            #{order.id}
          </span>

          {order.is_reservation != 0 && (
            <span className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-semibold bg-[#EDE9FE] text-[#8B5CF6] whitespace-nowrap">
              📅 حجز
            </span>
          )}

          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[#9CA3AF] whitespace-nowrap">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{timeAgo}</span>
          </span>
        </div>
              <div className="h-2"/>


        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <span
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-[13px] font-semibold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
            style={{
              backgroundColor: statusInfo.bg,
              color: statusInfo.color,
            }}
          >
            <span className="text-xs sm:text-sm">{statusInfo.icon}</span>
            <span className="hidden xs:inline">{statusInfo.label}</span>
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-[#F3F4F6] rounded-lg transition-colors flex-shrink-0"
            >
              <MoreVertical className="w-4 sm:w-4 md:w-5 h-4 sm:h-4 md:h-5 text-[#6B7280]" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute left-0 top-full mt-1 w-44 sm:w-48 bg-white rounded-xl shadow-lg border border-[#E5E7EB] z-20 py-1">
                  <button
                    onClick={() => {
                      onViewDetails(order);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-right text-xs sm:text-sm text-[#1A1A1A] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"
                  >
                    <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                    <span>عرض التفاصيل</span>
                  </button>
                  {(order.status === 'pending') && (
                    <button
                      onClick={() => {
                        onCancel(order.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-right text-xs sm:text-sm text-[#EF4444] hover:bg-[#FEE2E2] flex items-center gap-2 transition-colors"
                    >
                      <X className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                      <span>إلغاء الطلب</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-5">
        <div className="bg-[#F9FAFB] rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E5A04D] to-[#D4903D] flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
              {order.customer_name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-semibold text-[#1A1A1A] truncate">
                {order.customer_name || 'عميل'}
              </h4>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B7280]">
              <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
              <span dir="ltr" className="truncate text-xs sm:text-sm">{order.customer_phone || 'غير متوفر'}</span>
            </div>
            <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#6B7280]">
              <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2 break-words text-xs sm:text-sm">{order.location || 'غير محدد'}</span>
            </div>
          </div>

          {paystatued === 'confirmed' ? (
            <div className="bg-[#D1FAE5] text-[#10B981] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
              ✓ تم الدفع
            </div>
          ) : paystatued === 'pending' ? (
            <div className="bg-[#FEF3C7] text-[#F59E0B] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
              ⏳ في انتظار الدفع
            </div>
          ) : (
            <div className="bg-[#FEF3C7] text-[#F59E0B] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-center">
              ⏳ في انتظار الدفع
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-[#6B7280] mb-2 sm:mb-3">تفاصيل الطلب</h4>

          <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 sm:gap-3 pb-2 sm:pb-2.5 border-b border-dashed border-[#E5E7EB] last:border-0"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {item.dish_image ? (
                    <img
                      src={item.dish_image}
                      alt={item.dish_name}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                      🍽️
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-[#1A1A1A] truncate">{item.dish_name}</p>
                    <span className="text-xs sm:text-sm font-semibold text-[#E5A04D] whitespace-nowrap">
                      ×{item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1A1A1A] whitespace-nowrap flex-shrink-0">
                  {item.price * item.quantity} ج.م
                </span>
              </div>
            ))}
            {hiddenCount > 0 && (
              <button
                onClick={() => onViewDetails(order)}
                className="text-xs sm:text-sm text-[#E5A04D] hover:underline"
              >
                +{hiddenCount} صنف آخر
              </button>
            )}
          </div>

          <div className="border-t border-[#E5E7EB] pt-2.5 sm:pt-3 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-[#6B7280] flex-shrink-0">المجموع الفرعي</span>
              <span className="text-[#1A1A1A] whitespace-nowrap font-semibold">{subtotal} ج.م</span>
            </div>

            {order.delivery_fee > 0 && (
              <div className="flex justify-between items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="text-[#6B7280] flex-shrink-0">رسوم التوصيل</span>
                <span className="text-[#1A1A1A] whitespace-nowrap font-semibold">{order.delivery_fee} ج.م</span>
              </div>
            )}

            <div className="bg-[#FEF3E2] px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-between gap-2 sm:gap-3 mt-2 sm:mt-3">
              <span className="text-xs sm:text-sm md:text-base font-semibold text-[#1A1A1A] flex-shrink-0">
                الإجمالي:
              </span>
              <span className="text-sm sm:text-base md:text-lg font-bold text-[#E5A04D] whitespace-nowrap">
                {order.total_amount} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>

      {order.is_reservation==true && order.reservation_date!=null && (
        <div className="bg-[#EDE9FE] px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 flex items-center gap-2 sm:gap-4 md:gap-8 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#8B5CF6] flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#5B21B6] break-words">
              {new Date(order.reservation_date).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#E5E7EB] rounded-b-xl sm:rounded-b-2xl border-t border-[#E5E7EB]">
        <div className="p-3 sm:p-4 md:p-5">
          <div className="hidden lg:flex items-center justify-between gap-4">
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#E5A04D] to-[#D4903D] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-w-[160px] flex items-center justify-center gap-2 shadow-md"
              >
                <span>تحديث الحالة</span>
                <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-[#E5E7EB] z-50 py-2 overflow-hidden">
                    {(Object.entries(statusConfig) as [OrderStatus, typeof statusConfig[OrderStatus]][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onStatusChange(order.id, key);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-right text-sm hover:bg-[#F8FAFC] flex items-center justify-between gap-2 transition-colors"
                        style={{
                          backgroundColor: order.status === key ? config.bg : 'transparent',
                        }}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0 text-base">{config.icon}</span>
                          <span className="truncate font-medium" style={{ color: order.status === key ? config.color : '#374151' }}>
                            {config.label}
                          </span>
                        </span>
                        {order.status === key && <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 xl:gap-3 flex-wrap justify-end">
              {showChatButton === true && onChatClick && (
                <button
                  onClick={() => onChatClick(order.id, order.customer_name || 'عميل')}
                  className="px-4 py-2.5 bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#EDE9FE] hover:border-[#7C3AED] rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>محادثة العميل</span>
                </button>
              )}
              <button
                onClick={() => onViewDetails(order)}
                className="px-4 py-2.5 bg-white border-2 border-[#E5E7EB] text-[#374151] hover:border-[#E5A04D] hover:bg-[#FEF3E2] hover:text-[#E5A04D] rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>عرض التفاصيل</span>
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={() => onCancel(order.id)}
                  className="px-4 py-2.5 bg-white border-2 border-[#FECACA] text-[#EF4444] hover:bg-[#FEE2E2] hover:border-[#EF4444] rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>إلغاء الطلب</span>
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:flex lg:hidden flex-col gap-3">
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#E5A04D] to-[#D4903D] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <span>تحديث الحالة</span>
                <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-full bg-white rounded-xl shadow-xl border border-[#E5E7EB] z-50 py-2">
                    {(Object.entries(statusConfig) as [OrderStatus, typeof statusConfig[OrderStatus]][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onStatusChange(order.id, key);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-right text-sm hover:bg-[#F8FAFC] flex items-center justify-between gap-2 transition-colors"
                        style={{
                          backgroundColor: order.status === key ? config.bg : 'transparent',
                        }}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0 text-base">{config.icon}</span>
                          <span className="truncate font-medium" style={{ color: order.status === key ? config.color : '#374151' }}>
                            {config.label}
                          </span>
                        </span>
                        {order.status === key && <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {showChatButton === true && onChatClick && (
                <button
                  onClick={() => onChatClick(order.id, order.customer_name || 'عميل')}
                  className="flex-1 min-w-[120px] px-3 py-2.5 bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#EDE9FE] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>محادثة</span>
                </button>
              )}
              <button
                onClick={() => onViewDetails(order)}
                className="flex-1 min-w-[120px] px-3 py-2.5 bg-white border-2 border-[#E5E7EB] text-[#374151] hover:border-[#E5A04D] hover:bg-[#FEF3E2] hover:text-[#E5A04D] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>التفاصيل</span>
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={() => onCancel(order.id)}
                  className="flex-1 min-w-[120px] px-3 py-2.5 bg-white border-2 border-[#FECACA] text-[#EF4444] hover:bg-[#FEE2E2] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                >
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>إلغاء</span>
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-2.5">
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#E5A04D] to-[#D4903D] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                <span>تحديث الحالة</span>
                <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div className="absolute right-0 bottom-full mb-2 w-full bg-white rounded-xl shadow-xl border border-[#E5E7EB] z-50 py-2 max-h-64 overflow-y-auto">
                    {(Object.entries(statusConfig) as [OrderStatus, typeof statusConfig[OrderStatus]][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onStatusChange(order.id, key);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-right text-sm hover:bg-[#F8FAFC] flex items-center justify-between gap-2 transition-colors"
                        style={{
                          backgroundColor: order.status === key ? config.bg : 'transparent',
                        }}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0 text-base">{config.icon}</span>
                          <span className="truncate font-medium" style={{ color: order.status === key ? config.color : '#374151' }}>
                            {config.label}
                          </span>
                        </span>
                        {order.status === key && <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {showChatButton === true && onChatClick && (
                <button
                  onClick={() => onChatClick(order.id, order.customer_name || 'عميل')}
                  className="px-3 py-2.5 bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#EDE9FE] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>محادثة</span>
                </button>
              )}
              <button
                onClick={() => onViewDetails(order)}
                className="px-3 py-2.5 bg-white border-2 border-[#E5E7EB] text-[#374151] hover:border-[#E5A04D] hover:bg-[#FEF3E2] hover:text-[#E5A04D] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-[0.98]"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>التفاصيل</span>
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={() => onCancel(order.id)}
                  className="col-span-2 px-3 py-2.5 bg-white border-2 border-[#FECACA] text-[#EF4444] hover:bg-[#FEE2E2] hover:border-[#EF4444] rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm active:scale-[0.98]"
                >
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>إلغاء الطلب</span>
                </button>
              )}
            </div>
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