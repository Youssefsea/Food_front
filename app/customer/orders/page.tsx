'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const OrdersPage = lazy(() => import('@/app/orders/page'));

export default function CustomerOrdersPage() {
  return (
    <ProtectedRoute role="customer">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <OrdersPage />
      </Suspense>
    </ProtectedRoute>
  );
}
