'use client';
import { Toaster } from 'sonner';

export function Toast() {
  return (
    <Toaster
      position="top-center"
      dir="rtl"
      toastOptions={{
        style: { fontFamily: 'var(--font-arabic)', direction: 'rtl' },
      }}
    />
  );
}
