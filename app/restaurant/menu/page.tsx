'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const VendorMenu = lazy(() => import('@/app/vendor/dishes/page'));

export default function RestaurantMenuPage() {
  return (
    <ProtectedRoute role="vendor">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <VendorMenu />
      </Suspense>
    </ProtectedRoute>
  );
}
