'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  className?: string;
}

export function BackButton({
  label = 'رجوع',
  fallbackHref,
  className = '',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors ${className}`}
    >
      <ArrowRight className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

export default BackButton;
