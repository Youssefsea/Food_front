'use client';
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'open' | 'closed' | 'pending' | 'confirmed' | 'preparing' | 'ready'
  | 'delivered' | 'cancelled' | 'nearby' | 'delivery' | 'reservation' | 'new'
  | 'paid' | 'completed' | 'cooking' | 'delivering'
  | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const styles: Record<BadgeVariant, { badge: string; dot: string }> = {
  open:        { badge: 'bg-accent/10 text-accent border-accent/20',         dot: 'bg-accent' },
  closed:      { badge: 'bg-secondary/10 text-secondary border-secondary/20', dot: 'bg-secondary' },
  pending:     { badge: 'bg-orange-100 text-orange-600 border-orange-200',    dot: 'bg-orange-500' },
  confirmed:   { badge: 'bg-blue-100 text-blue-600 border-blue-200',          dot: 'bg-blue-500' },
  preparing:   { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',    dot: 'bg-yellow-500' },
  ready:       { badge: 'bg-accent/10 text-accent border-accent/20',          dot: 'bg-accent' },
  delivered:   { badge: 'bg-accent/10 text-accent border-accent/20',          dot: 'bg-accent' },
  cancelled:   { badge: 'bg-gray-100 text-gray-500 border-gray-200',          dot: 'bg-gray-400' },
  nearby:      { badge: 'bg-purple-100 text-purple-600 border-purple-200',    dot: 'bg-purple-500' },
  delivery:    { badge: 'bg-blue-100 text-blue-600 border-blue-200',          dot: 'bg-blue-500' },
  reservation: { badge: 'bg-indigo-100 text-indigo-600 border-indigo-200',    dot: 'bg-indigo-500' },
  new:         { badge: 'bg-primary/10 text-primary border-primary/20',       dot: 'bg-primary' },
  paid:        { badge: 'bg-accent/10 text-accent border-accent/20',          dot: 'bg-accent' },
  completed:   { badge: 'bg-accent/10 text-accent border-accent/20',          dot: 'bg-accent' },
  cooking:     { badge: 'bg-blue-100 text-blue-600 border-blue-200',          dot: 'bg-blue-500' },
  delivering:  { badge: 'bg-purple-100 text-purple-600 border-purple-200',    dot: 'bg-purple-500' },
  neutral:     { badge: 'bg-gray-100 text-gray-600 border-gray-200',          dot: 'bg-gray-400' },
  success:     { badge: 'bg-accent/10 text-accent border-accent/20',          dot: 'bg-accent' },
  warning:     { badge: 'bg-orange-100 text-orange-600 border-orange-200',    dot: 'bg-orange-500' },
  danger:      { badge: 'bg-secondary/10 text-secondary border-secondary/20', dot: 'bg-secondary' },
  info:        { badge: 'bg-blue-100 text-blue-600 border-blue-200',          dot: 'bg-blue-500' },
  default:     { badge: 'bg-gray-100 text-gray-600 border-gray-200',          dot: 'bg-gray-400' },
};

const Badge = memo(function Badge({
  children, variant = 'default', size = 'sm', dot = false, pulse = false, className,
}: BadgeProps) {
  const s = styles[variant];
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-badge font-semibold border',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      s.badge, className
    )}>
      {(dot || pulse) && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', s.dot, pulse && 'animate-pulse')} />
      )}
      {children}
    </span>
  );
});

export default Badge;
