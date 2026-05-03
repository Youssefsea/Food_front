'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
  Sidebar,
  DashboardHeader,
  StatsCards,
  TopSellingDishes,
  RecentOrdersTable,
  QuickActionsPanel,
  NotificationToast,
} from './components';
import { ProtectedRoute } from '@/app/context/AuthContext';
import VendorSidebar from '@/components/layout/VendorSidebar';

interface DashboardData {
  restaurantName: string;
  isOpen: boolean;
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  totalDishes: number;
  topDishes: Array<{
    id: number;
    name: string;
    price: number;
    image?: string;
    soldCount?: number;
    revenue?: number;
  }>;
  recentOrders: Array<{
    id: number;
    customer_name: string;
    customer_phone: string;
    is_reservation: number;
    reservation_time?: string;
    reservation_date?: string;
    items: Array<{
      dish_name: string;
      quantity: number;
    }>;
    total_amount: number;
    status: 'pending' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
    created_at: string;
  }>;
}

export default function VendorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    restaurantName: '',
    isOpen: true,
    todayRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    totalDishes: 0,
    topDishes: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [pendingPaidOrders, setPendingPaidOrders] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const fetchPendingPaidOrdersCount = useCallback(async (orders: DashboardData['recentOrders']) => {
    if (orders.length === 0) {
      setPendingPaidOrders(0);
      return;
    }
    const paidButPendingWork = orders.filter(order => order.status === 'pending').length;
    setPendingPaidOrders(paidButPendingWork);
  }, []);

  const fetchDashboardData = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, ordersRes] = await Promise.all([
        api.get('/restaurant/dashboard', { signal }),
        api.get('/restaurant/orders', { signal }),
      ]);

      const stats = dashboardRes.data;
      const orders = ordersRes.data.orders || [];

      setDashboardData({
        restaurantName: stats.restaurant.name || 'مطعمي',
        isOpen: stats.restaurant.is_open,
        todayRevenue: stats.stats.revenue.today || 0,
        todayOrders: Number(stats.stats.orders.today) || 0,
        pendingOrders: Number(stats.stats.orders.pending) || 0,
        totalDishes: Number(stats.stats.dishes.total) || 0,
        topDishes: stats.topDishes.map((dish: {
          id: number;
          name: string;
          price: string;
          image?: string;
          order_count?: string;
          total_quantity?: string | null;
          total_revenue?: string | null;
        }) => ({
          id: dish.id,
          name: dish.name,
          price: Number(dish.price),
          image: dish.image,
          soldCount: Number(dish.total_quantity) || 0,
          revenue: Number(dish.total_revenue) || 0,
        })),
        recentOrders: orders,
      });

      await fetchPendingPaidOrdersCount(orders);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [fetchPendingPaidOrdersCount, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    return () => controller.abort();
  }, [fetchDashboardData, mounted]);

  const handleToggleStatus = () => {
    setDashboardData(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E5A04D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <p className="text-[#EF4444] mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-6 py-2 bg-[#E5A04D] text-white rounded-xl hover:bg-[#D4903D] transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute role="vendor">
      <div className="min-h-screen bg-[#F8FAFC] lg:flex" dir="rtl">
        <VendorSidebar restaurantName={dashboardData.restaurantName || 'مطعمي'} />

        <div className="flex-1">
          <Sidebar
            pendingOrders={dashboardData.pendingOrders}
            unreadMessages={0}
            todayReservations={0}
            isVisible={isSidebarVisible}
            onClose={toggleSidebar}
          />

          <DashboardHeader
            restaurantName={dashboardData.restaurantName}
            isOpen={dashboardData.isOpen}
            onToggleStatus={handleToggleStatus}
            unreadMessages={0}
            notifications={pendingPaidOrders}
            onRefresh={fetchDashboardData}
            onToggleSidebar={toggleSidebar}
          />

          <NotificationToast pendingPaidOrders={pendingPaidOrders} />

          <main className="pt-24 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
            <StatsCards
              todayRevenue={dashboardData.todayRevenue}
              todayOrders={dashboardData.todayOrders}
              pendingOrders={dashboardData.pendingOrders}
              totalDishes={dashboardData.totalDishes}
              reservedOrders={dashboardData.recentOrders.filter(order => order.is_reservation).length}
            />

            <TopSellingDishes dishes={dashboardData.topDishes} />

            <RecentOrdersTable
              orders={dashboardData.recentOrders}
              onStatusChange={fetchDashboardData}
            />

            <QuickActionsPanel />
          </main>

          <div className="h-6" />
        </div>
      </div>
    </ProtectedRoute>
  );
}