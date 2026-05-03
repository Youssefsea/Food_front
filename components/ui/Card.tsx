'use client';
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'floating' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'default' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const Card = memo(function Card({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'default',
  className,
  onClick,
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-card border border-gray-100',
    elevated: 'bg-white shadow-elevated',
    floating: 'bg-white shadow-floating',
    flat: 'bg-white border border-gray-200',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const roundeds = {
    default: 'rounded-card',
    lg: 'rounded-[20px]',
    xl: 'rounded-modal',
  };

  return (
    <div
      className={cn(variants[variant], paddings[padding], roundeds[rounded], onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

export default Card;
