'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const VendorOrders = lazy(() => import('@/app/vendor/orders/page'));

export default function RestaurantOrdersPage() {
  return (
    <ProtectedRoute role="vendor">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <VendorOrders />
      </Suspense>
    </ProtectedRoute>
  );
}
