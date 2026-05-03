'use client';

import { memo } from 'react';
import { Wallet, ShoppingBag, Clock, Utensils } from 'lucide-react';

interface StatsCardsProps {
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  totalDishes: number;
  reservedOrders: number;
}

export const StatsCards = memo(function StatsCards({ todayRevenue, todayOrders, pendingOrders, totalDishes, reservedOrders }: StatsCardsProps) {
  const stats = [
    {
      id: 1,
      title: 'إيرادات اليوم',
      value: `${todayRevenue.toLocaleString('ar-EG')} ج.م`,
      icon: Wallet,
      iconBg: '#E5A04D',
      valueColor: '#E5A04D',
    },
    {
      id: 2,
      title: 'طلبات اليوم',
      value: todayOrders.toLocaleString('ar-EG'),
      icon: ShoppingBag,
      iconBg: '#3B82F6',
      valueColor: '#1A1A1A',
    },
    {
      id: 3,
      title: 'الطلبات المعلقة',
      value: pendingOrders.toLocaleString('ar-EG'),
      icon: Clock,
      iconBg: '#F59E0B',
      valueColor: '#F59E0B',
      badge: pendingOrders > 0 ? 'تحتاج مراجعة' : undefined,
    },
    {
      id: 4,
      title: 'إجمالي الأطباق',
      value: totalDishes.toLocaleString('ar-EG'),
      icon: Utensils,
      iconBg: '#8B5CF6',
      valueColor: '#8B5CF6',
    },
    {
      id: 5,
      title:'الطلبات المحجزوة',
      value: reservedOrders.toLocaleString('ar-EG'),
      icon: Clock,
      iconBg: '#10B981',
      valueColor: '#10B981',
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-transparent hover:border-[#E5A04D]"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: stat.iconBg }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div
              className="text-[32px] font-bold mb-1"
              style={{ color: stat.valueColor }}
            >
              {stat.value}
            </div>

            <div className="text-sm text-[#6B7280] mb-3">{stat.title}</div>

            {stat.badge && (
              <div className="inline-block px-3 py-1 bg-[#FEF3C7] text-[#F59E0B] text-xs rounded-full font-medium">
                {stat.badge}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
