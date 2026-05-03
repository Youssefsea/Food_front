'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/app/context/AuthContext';

export default function CustomerPaymentPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/cart');
  }, [router]);

  return (
    <ProtectedRoute role="customer">
      <div className="min-h-screen bg-[var(--bg-primary)]" />
    </ProtectedRoute>
  );
}
