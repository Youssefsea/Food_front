'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import {
  DashboardHeader,
  StatsCards,
  TopSellingDishes,
  RecentOrdersTable,
  QuickActionsPanel,
  NotificationToast,
} from './components';
import { ProtectedRoute } from '@/app/context/AuthContext';

// ─── Types ───────────────────────────────────────────────
interface TopDish {
  id: number;
  name: string;
  price: number;
  image?: string;
  soldCount?: number;
  revenue?: number;
}

interface RecentOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  is_reservation: number;
  reservation_time?: string;
  reservation_date?: string;
  items: Array<{ dish_name: string; quantity: number }>;
  total_amount: number;
  status: 'pending' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
}

interface DashboardData {
  restaurantName: string;
  isOpen: boolean;
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  totalDishes: number;
  topDishes: TopDish[];
  recentOrders: RecentOrder[];
}

const INITIAL_DATA: DashboardData = {
  restaurantName: '',
  isOpen: true,
  todayRevenue: 0,
  todayOrders: 0,
  pendingOrders: 0,
  totalDishes: 0,
  topDishes: [],
  recentOrders: [],
};

// ─── Loading screen ───────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#E5A04D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#6B7280] text-sm">جاري تحميل البيانات...</p>
      </div>
    </div>
  );
}

// ─── Error screen ─────────────────────────────────────────
function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center" dir="rtl">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-sm mx-4">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-[#EF4444] mb-6 text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#E5A04D] text-white rounded-xl hover:bg-[#D4903D] transition-colors text-sm font-semibold"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard content ────────────────────────────────────
function DashboardContent() {
  const [data, setData]       = useState<DashboardData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // controller منفصل — لا يتأثر بـ re-render
  const controllerRef = useRef<AbortController | null>(null);

  // حساب مباشر — مش محتاج useCallback منفصل
  const pendingPaidCount = data.recentOrders.filter(
    (o) => o.status === 'pending' && o.payment_status === 'confirmed',
  ).length;

  const fetchData = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const [dashRes, ordersRes] = await Promise.all([
        api.get('/restaurant/dashboard', { signal: controller.signal }),
        api.get('/restaurant/orders',    { signal: controller.signal }),
      ]);

      const stats  = dashRes.data;
      const orders: RecentOrder[] = ordersRes.data.orders || [];

      setData({
        restaurantName: stats.restaurant?.name || 'مطعمي',
        isOpen:         Boolean(stats.restaurant?.is_open),
        todayRevenue:   Number(stats.stats?.revenue?.today)    || 0,
        todayOrders:    Number(stats.stats?.orders?.today)     || 0,
        pendingOrders:  Number(stats.stats?.orders?.pending)   || 0,
        totalDishes:    Number(stats.stats?.dishes?.total)     || 0,
        topDishes: (stats.topDishes || []).map((d: {
          id: number; name: string; price: string; image?: string;
          total_quantity?: string | null; total_revenue?: string | null;
        }) => ({
          id:        d.id,
          name:      d.name,
          price:     Number(d.price),
          image:     d.image,
          soldCount: Number(d.total_quantity) || 0,
          revenue:   Number(d.total_revenue)  || 0,
        })),
        recentOrders: orders,
      });
    } catch (err: unknown) {
      // تجاهل الـ abort
      if (err instanceof Error && (err.name === 'AbortError' || err.name === 'CanceledError')) return;
      const axErr = err as { response?: { data?: { message?: string } } };
      setError(axErr.response?.data?.message || 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []); // ← dependency array فاضية — fetchData نفسها ثابتة

  useEffect(() => {
    fetchData();
    return () => controllerRef.current?.abort();
  }, [fetchData]);

  // Toggle status — يكلم الـ API وبعدين يحدث الـ state
  const handleToggleStatus = useCallback(async () => {
    const newStatus = !data.isOpen;
    // Optimistic update
    setData(prev => ({ ...prev, isOpen: newStatus }));
    try {
      await api.patch('/restaurant/toggle-status', { is_open: newStatus });
    } catch {
      // Rollback لو فشل
      setData(prev => ({ ...prev, isOpen: !newStatus }));
    }
  }, [data.isOpen]);

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <DashboardHeader
        restaurantName={data.restaurantName}
        isOpen={data.isOpen}
        onToggleStatus={handleToggleStatus}
        notifications={pendingPaidCount}
        onRefresh={fetchData}
      />

      <NotificationToast pendingPaidOrders={pendingPaidCount} />

      <main className="pt-24 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6 pb-10">
        <StatsCards
          todayRevenue={data.todayRevenue}
          todayOrders={data.todayOrders}
          pendingOrders={data.pendingOrders}
          totalDishes={data.totalDishes}
          reservedOrders={data.recentOrders.filter(o => o.is_reservation).length}
        />

        <TopSellingDishes dishes={data.topDishes} />

        <RecentOrdersTable
          orders={data.recentOrders}
          onStatusChange={fetchData}
        />

        <QuickActionsPanel />
      </main>
    </div>
  );
}

// ─── Page export ─────────────────────────────────────────
export default function VendorDashboard() {
  return (
    <ProtectedRoute role="vendor">
      <DashboardContent />
    </ProtectedRoute>
  );
}