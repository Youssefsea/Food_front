'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const VendorDashboard = lazy(() => import('@/app/vendor/dashboard/page'));

export default function RestaurantDashboardPage() {
  return (
    <ProtectedRoute role="vendor">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <VendorDashboard />
      </Suspense>
    </ProtectedRoute>
  );
}
