"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/api";
import { Badge, EmptyState, Button } from "@/components/ui";
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ORDER_STATUS, type OrderStatusKey } from "@/lib/constants";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { ProtectedRoute } from "../context/AuthContext";
import { toast } from "sonner";

interface Order {
  id: number;
  total_amount: number;
  delivery_fee: number;
  status: OrderStatusKey;
  is_reservation: boolean;
  location: string;
  created_at: string;
  restaurant_name?: string;
  restaurant_id?: number;
  // payment_status جاي مباشرة من API — بيكون: 'pending' | 'confirmed' | 'approved' | 'rejected' | null
  payment_status?: string | null;
  items: { dish_name: string; quantity: number; price: number }[];
}

const statusBadgeVariant: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'neutral'> = {
  pending: 'warning',
  paid: 'info',
  cooking: 'warning',
  delivering: 'info',
  completed: 'success',
  cancelled: 'danger',
};

// الباك ممكن يرجع 'approved' أو 'confirmed' — نتعامل مع الاتنين
const isChatAvailable = (order: Order): boolean => {
  if (!order.is_reservation) return false;
  const status = order.payment_status;
  return status === 'approved' || status === 'confirmed';
};

export default function OrdersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Mount guard
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  const fetchOrders = useCallback(async () => {
    if (!mounted) return;
    try {
      setIsLoading(true);
      const res = await api.get('/customer/orders');
      // payment_status جاي مباشرة في كل order — مش محتاجين call تاني
      setOrders(res.data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      fetchOrders();
    }
  }, [fetchOrders, mounted]);

  // فتح الشات — بيجيب الـ roomId من الـ endpoint الصح
  const handleOpenChat = useCallback(async (orderId: number) => {
    try {
      const res = await api.get(`/customer/chat-room/order/${orderId}`);
      const roomId = res.data?.room?.id;
      if (roomId) {
        router.push(`/customer/chat/${roomId}`);
      } else {
        toast.error('لا يمكن فتح المحادثة الآن');
      }
    } catch {
      toast.error('غرفة المحادثة غير متاحة');
    }
  }, [router]);

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));
  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <ProtectedRoute role="customer">
      <div className="min-h-screen bg-[#FAFAFA] pb-24" dir="rtl">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5 text-[#1A1A2E] rotate-180" />
            </button>
            <h1 className="text-base font-bold text-[#1A1A2E]">طلباتي</h1>
            <div className="w-9" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                "flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all",
                activeTab === 'active' ? 'text-[#FF6B35] border-[#FF6B35]' : 'text-[#9CA3AF] border-transparent'
              )}
            >
              نشطة ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={cn(
                "flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all",
                activeTab === 'completed' ? 'text-[#FF6B35] border-[#FF6B35]' : 'text-[#9CA3AF] border-transparent'
              )}
            >
              مكتملة ({completedOrders.length})
            </button>
          </div>
        </div>

        {/* Orders */}
        <main className="max-w-2xl mx-auto px-4 py-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-32" />
              ))}
            </div>
          ) : displayOrders.length === 0 ? (
            <EmptyState
              icon={activeTab === 'active' ? '📦' : '📋'}
              title={activeTab === 'active' ? 'لا توجد طلبات نشطة' : 'لا توجد طلبات مكتملة'}
              description={activeTab === 'active' ? 'اطلب من مطعمك المفضل الآن!' : 'ستظهر هنا الطلبات المكتملة'}
              actionLabel={activeTab === 'active' ? 'استكشف المطاعم' : undefined}
              onAction={activeTab === 'active' ? () => router.push('/customer/home') : undefined}
            />
          ) : (
            <div className="space-y-3">
              {displayOrders.map((order) => {
                const statusInfo = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                const showChatButton = isChatAvailable(order);

                return (
                  <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                    {/* Order Header */}
                    <div className="p-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-bold text-[#1A1A2E]">طلب #{order.id}</span>
                          <Badge variant={statusBadgeVariant[order.status] || 'neutral'} size="sm" dot>
                            {statusInfo.label}
                          </Badge>
                          {order.is_reservation && (
                            <Badge variant="info" size="sm">
                              حجز
                            </Badge>
                          )}
                        </div>
                        {order.restaurant_name && (
                          <p className="text-xs text-[#6B7280] mb-1">{order.restaurant_name}</p>
                        )}
                        <p className="text-[10px] text-[#C4C4C4]">{formatRelativeTime(order.created_at)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-[#FF6B35]">{formatCurrency(order.total_amount)}</p>
                        {order.delivery_fee > 0 && (
                          <p className="text-[10px] text-[#C4C4C4]">+ {formatCurrency(order.delivery_fee)} توصيل</p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                        {order.items.slice(0, 3).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#FFF8F0] text-[#FF6B35] text-[10px] font-medium rounded-full">
                            {item.dish_name} × {item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-50 text-[#9CA3AF] text-[10px] rounded-full">
                            +{order.items.length - 3} أخرى
                          </span>
                        )}
                      </div>
                    )}

                    {/* Status Progress (for active orders only) */}
                    {!['completed', 'cancelled'].includes(order.status) && (
                      <div className="px-4 pb-4">
                        <div className="flex items-center gap-1">
                          {['pending', 'paid', 'cooking', 'delivering', 'completed'].map((step, i) => {
                            const steps = ['pending', 'paid', 'cooking', 'delivering', 'completed'];
                            const currentIdx = steps.indexOf(order.status);
                            const isActive = i <= currentIdx;
                            return (
                              <div key={step} className="flex-1 flex items-center gap-1">
                                <div className={cn(
                                  'h-1 flex-1 rounded-full transition-colors',
                                  isActive ? 'bg-[#FF6B35]' : 'bg-gray-200'
                                )} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Chat Button — فقط للحجوزات اللي اتأكد دفعها */}
                    {showChatButton && (
                      <div className="px-4 pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenChat(order.id)}
                          className="w-full flex items-center justify-center gap-2 border-[#E5A04D] text-[#E5A04D] hover:bg-[#FFF8F0]"
                        >
                          <MessageCircle className="w-4 h-4" />
                          تواصل مع المطعم
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}