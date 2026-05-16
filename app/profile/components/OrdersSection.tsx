'use client';

import { useState } from "react";
import { OrderCard } from "./OrderCard";
import { EmptyState } from "./EmptyState";
import { OrderCardSkeleton } from "./OrderCardSkeleton";
import { Order } from "../types";

const tabs = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'معلقة' },
  { id: 'cooking', label: 'جاري التحضير' },
  { id: 'delivering', label: 'جاري التوصيل' },
  { id: 'completed', label: 'تم التوصيل' },
  { id: 'cancelled', label: 'ملغية' }
];

interface OrdersSectionProps {
  orders: Order[];
  isLoading?: boolean;

}

export function OrdersSection({ orders, isLoading }: OrdersSectionProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'cooking') return order.status === 'cooking';
    if (activeTab === 'delivering') return order.status === 'delivering';
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  return (
    <div className="mt-6">
      <div className="px-4 mb-4 ">
        <h2 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A' }}>
          طلباتي 
          <span 
            className="ml-1 px-2 py-1 rounded-full "
            style={{ 
              fontSize: '0.875rem',
              backgroundColor: '#FEF3E2',
              color: '#E5A04D',
              fontWeight: 900
            }}
          >
            {orders.length}
          </span>
        </h2>
      </div>
      <div className="h-4"/>


      <div className="overflow-x-auto px-4 mb-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full transition-all whitespace-nowrap min-h-[44px]"
              style={{
                backgroundColor: activeTab === tab.id ? '#E5A04D' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6B7280',
                fontWeight: 500,
                borderWidth: '1px',
                borderColor: activeTab === tab.id ? '#E5A04D' : '#E5E7EB'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-4"/>


      <div className="pb-24">
        {isLoading ? (
          <>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <>
            <OrderCard 
              key={order.id} 
              order={order} 
            />
            <div className="h-4"/>
            </>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
