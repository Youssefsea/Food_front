'use client';

import { OrdersStats as StatsType } from '../types';

interface StatCard {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const statCards: StatCard[] = [
  { id: 'all', label: 'جميع الطلبات', icon: '📋', color: '#1A1A1A' },
  { id: 'pending', label: 'قيد الانتظار', icon: '⏳', color: '#F59E0B' },
  { id: 'cooking', label: 'جاري التحضير', icon: '🍳', color: '#8B5CF6' },
  { id: 'delivering', label: 'جاري التوصيل', icon: '🚗', color: '#06B6D4' },
  { id: 'completed', label: 'مكتمل', icon: '✅', color: '#10B981' },
];

interface OrdersStatsProps {
  stats: StatsType;
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
}

export function OrdersStats({ stats, selectedStatus, onStatusSelect }: OrdersStatsProps) {
  return (
    <div className="bg-white rounded-[14px] p-6 shadow-sm mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
        {statCards.map((stat) => {
          const count = stats[stat.id as keyof StatsType] || 0;
          const isSelected = selectedStatus === stat.id;
          
          return (
            <button
              key={stat.id}
              onClick={() => onStatusSelect(isSelected ? null : stat.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'shadow-md'
                  : 'border-transparent hover:border-gray-200'
              }`}
              style={{
                borderColor: isSelected ? stat.color : undefined,
                backgroundColor: isSelected ? `${stat.color}10` : 'transparent',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                {count}
              </div>
              <div className="text-[13px] text-[#6B7280]">{stat.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
