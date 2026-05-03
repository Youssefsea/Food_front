'use client';
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface EmptyStateProps {
  emoji?: string;
  /** @deprecated use emoji */
  icon?: string;
  title: string;
  subtitle?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

const EmptyState = memo(function EmptyState({
  emoji,
  icon,
  title,
  subtitle,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  const symbol = emoji ?? icon ?? '📭';
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-4xl">{symbol}</span>
      </div>
      <h3 className="text-lg font-bold text-dark mb-1">{title}</h3>
      {(subtitle || description) && (
        <p className="text-sm text-muted mb-6 max-w-xs">{subtitle ?? description}</p>
      )}
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        {actionLabel && onAction && (
          <Button variant="primary" size="md" fullWidth onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" size="md" fullWidth onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
});

export default EmptyState;
