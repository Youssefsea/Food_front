'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const AdminPayments = lazy(() => import('@/app/admin/page'));

export default function AdminPaymentsPage() {
  return (
    <ProtectedRoute role="admin">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <AdminPayments />
      </Suspense>
    </ProtectedRoute>
  );
}
