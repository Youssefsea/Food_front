'use client';

import { Wallet } from "lucide-react";

interface WalletCardProps {
  balance: number;
  isLoading?: boolean;
}

export function WalletCard({ balance, isLoading }: WalletCardProps) {
  if (isLoading) {
    return (
      <div 
        className="rounded-[16px] p-5 mx-4 mt-4 shadow-sm"
        style={{ 
          background: 'linear-gradient(135deg, #FEF3E2 0%, #FFF5E7 100%)',
          borderColor: '#E5A04D',
          borderWidth: '1px'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div>
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-8 w-28 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-[16px] p-5 mx-4 mt-4 shadow-sm"
      style={{ 
        background: 'linear-gradient(135deg, #FEF3E2 0%, #FFF5E7 100%)',
        borderColor: '#E5A04D',
        borderWidth: '1px'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E5A04D' }}
          >
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>محفظتي</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E5A04D' }}>
             {Number(balance || 0)} ج.م

            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
