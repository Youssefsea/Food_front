'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const ExplorePage = lazy(() => import('@/app/explore/page'));

export default function CustomerHomePage() {
  return (
    <ProtectedRoute role="customer">
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] animate-pulse" />}>
        <ExplorePage />
      </Suspense>
    </ProtectedRoute>
  );
}
