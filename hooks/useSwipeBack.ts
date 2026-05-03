'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function useSwipeBack(fallbackHref?: string) {
  const router = useRouter();
  const touchStartX = useRef(0);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      // Swipe right (in RTL = swipe left physically) triggers back
      if (deltaX > 80) {
        if (window.history.length > 1) {
          router.back();
        } else if (fallbackHref) {
          router.push(fallbackHref);
        }
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [router, fallbackHref]);
}
