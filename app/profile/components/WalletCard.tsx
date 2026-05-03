'use client';

import { Wallet, TrendingUp } from "lucide-react";

interface WalletCardProps {
  balance: number;
  isLoading?: boolean;
}

export function WalletCard({ balance, isLoading }: WalletCardProps) {
  if (isLoading) {
    return (
      <div className="mx-4 mb-4 rounded-2xl p-5 bg-white shadow-md animate-pulse h-24" />
    );
  }

  return (
    <div
      className="mx-4 mb-4 rounded-2xl p-5 flex items-center justify-between"
      style={{
        background: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        border: '1px solid #f3f4f6'
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #E5A04D)' }}
        >
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>رصيد محفظتي</p>
          <p className="text-2xl font-black leading-tight" style={{ color: '#1a1a1a' }}>
            {Number(balance || 0).toFixed(2)}
            <span className="text-sm font-semibold mr-1" style={{ color: '#E5A04D' }}>ج.م</span>
          </p>
          <p className="text-xs" style={{ color: '#e5a04d' }}>متاح للاستخدام</p>
        </div>
      </div>
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-full"
        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
      >
        <TrendingUp className="w-3 h-3" style={{ color: '#16a34a' }} />
        <span className="text-xs font-bold" style={{ color: '#16a34a' }}>نشط</span>
      </div>
    </div>
  );
}