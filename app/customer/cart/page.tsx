'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const CartPage = lazy(() => import('@/app/cart/page'));

export default function CustomerCartPage() {
  return (
    <ProtectedRoute role="customer">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <CartPage />
      </Suspense>
    </ProtectedRoute>
  );
}
