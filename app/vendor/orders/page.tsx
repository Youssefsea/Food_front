'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../../axios';
import Cookies from 'js-cookie';
import { Order, OrderStatus, OrdersStats as StatsType } from './types';
import {
  OrderCard,
  OrderDetailsModal,
  OrdersHeader,
  OrdersStats,
  EmptyOrdersState,
  VendorChatModal,
} from './components';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOrderIdForChat, setSelectedOrderIdForChat] = useState<number | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  
  useEffect(() => {
    const syncVendorToken = async () => {
      const vendorToken = localStorage.getItem('vendorToken');
      if (!vendorToken) {
        const cookieToken = Cookies.get('token');
        if (cookieToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('customerToken');
          localStorage.setItem('vendorToken', cookieToken);
        }
      }
    };
    syncVendorToken();
  }, []);

  const fetchOrders = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);
      
      setError(null);

      const params: { limit?: number } = { limit: 100 };

      const response = await api.get('/restaurant/orders', { params });
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('فشل في تحميل الطلبات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const stats: StatsType = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      cooking: orders.filter((o) => o.status === 'cooking').length,
      delivering: orders.filter((o) => o.status === 'delivering').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  const activeOrdersCount = stats.cooking + stats.delivering;

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    const activeFilter = selectedStatus || statusFilter;
    
    if (activeFilter && activeFilter !== 'all') {
      result = result.filter((o) => o.status === activeFilter);
    }

    return result;
  }, [orders, selectedStatus, statusFilter]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await api.post('/restaurant/order-status', {
        orderId,
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showToast('success', 'تم تحديث حالة الطلب بنجاح');
    } catch (err) {
      showToast('error', 'فشل في تحديث حالة الطلب');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;

    try {
      await api.post('/restaurant/order-status', {
        orderId,
        status: 'cancelled',
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' as OrderStatus } : order
        )
      );

      showToast('success', 'تم إلغاء الطلب');
    } catch (err) {
      showToast('error', 'فشل في إلغاء الطلب');
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleChatClick = (orderId: number, customerName: string) => {
    setSelectedOrderIdForChat(orderId);
    setSelectedCustomerName(customerName);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedOrderIdForChat(null);
    setSelectedCustomerName("");
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatsStatusSelect = (status: string | null) => {
    setSelectedStatus(status);
    setStatusFilter(status || 'all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E5A04D] animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8" dir="rtl">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3">
          <OrdersHeader activeOrdersCount={activeOrdersCount} />
          
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">تحديث</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="mr-auto text-sm text-red-600 hover:text-red-700 underline"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
        <div className='h-3'/>
        <div className="h-2"/>
        <OrdersStats
          stats={stats}
          selectedStatus={selectedStatus}
          onStatusSelect={handleStatsStatusSelect}
        />
        <div className="h-4"/>

        <div className="h-4"/>

        {filteredOrders.length === 0 ? (
          <EmptyOrdersState selectedStatus={selectedStatus} />
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <><OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
                onCancel={handleCancelOrder}
                onChatClick={handleChatClick}
              />
              <div className="h-5"/>
              </>
            ))}
          </div>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
      />

      {selectedOrderIdForChat && (
        <VendorChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          orderId={selectedOrderIdForChat}
          customerName={selectedCustomerName}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Cairo', sans-serif;
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
