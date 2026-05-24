'use client';

import { ShoppingCart, ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FloatingCartBarProps {
  itemCount: number;
  totalPrice: number;
  onViewCart: () => void;
}

export function FloatingCartBar({ itemCount, totalPrice, onViewCart }: FloatingCartBarProps) {
  const prevCountRef = useRef(itemCount);
  const visible = itemCount > 0;

  // Bump animation when quantity changes
  const [bump, setBump] = useState(false);
  useEffect(() => {
    let enterT: ReturnType<typeof setTimeout> | undefined;
    let exitT: ReturnType<typeof setTimeout> | undefined;

    if (itemCount > 0 && itemCount !== prevCountRef.current) {
      // defer to avoid synchronous setState in the effect body
      enterT = setTimeout(() => setBump(true), 0);
      exitT = setTimeout(() => setBump(false), 350);
    }

    prevCountRef.current = itemCount;

    return () => {
      if (enterT) clearTimeout(enterT);
      if (exitT) clearTimeout(exitT);
    };
  }, [itemCount]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <>
      {/* Spacer so content isn't hidden behind the bar */}
      <div className="h-24 md:h-0 pointer-events-none" aria-hidden="true" />

      <div
        className="
          fixed left-0 right-0 z-[100]
          px-3 sm:px-4 md:px-5
          /* sit above bottom-nav on mobile (bottom-nav = ~56-64px) */
          bottom-[72px] md:bottom-6
          animate-slideUpBounce
        "
      >
        <div
          className={`
            max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl
            shadow-[0_8px_32px_rgba(229,160,77,0.18)] border border-[#F3D9B0]
            overflow-hidden transition-transform duration-200
            ${bump ? 'scale-[1.03]' : 'scale-100'}
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5">
            {/* Left: icon + count + price */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[#FEF3E2] rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#E5A04D]" strokeWidth={2.5} />
                </div>
                {/* Badge */}
                <span
                  className="
                    absolute -top-1.5 -right-1.5
                    min-w-[18px] h-[18px] px-1
                    bg-[#E5A04D] text-white text-[10px] font-bold
                    rounded-full flex items-center justify-center
                    shadow-sm
                  "
                >
                  {itemCount}
                </span>
              </div>

              <div>
                <p className="text-[11px] text-[#9CA3AF] leading-none mb-0.5">
                  {itemCount === 1 ? 'صنف واحد' : `${itemCount} أصناف`}
                </p>
                <p className="text-lg font-bold text-[#1A1A1A] leading-none">
                  {typeof totalPrice === 'number'
                    ? Number.isInteger(totalPrice)
                      ? totalPrice
                      : totalPrice.toFixed(2)
                    : totalPrice}{' '}
                  <span className="text-sm font-semibold text-[#E5A04D]">ج.م</span>
                </p>
              </div>
            </div>

            {/* Right: CTA button */}
            <button
              onClick={onViewCart}
              className="
                flex items-center gap-1.5
                px-5 h-10
                bg-gradient-to-l from-[#E5A04D] to-[#D4903D]
                hover:from-[#D4903D] hover:to-[#C07D2D]
                text-white rounded-xl font-bold text-sm
                shadow-md shadow-[#E5A04D]/30
                active:scale-95 transition-all duration-150
                whitespace-nowrap
              "
            >
              <span>عرض السلة</span>
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpBounce {
          0%   { transform: translateY(110%); opacity: 0; }
          55%  { transform: translateY(-8px);  opacity: 1; }
          75%  { transform: translateY(4px); }
          90%  { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        .animate-slideUpBounce {
          animation: slideUpBounce 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
    </>
  );
}