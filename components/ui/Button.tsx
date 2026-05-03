'use client';
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  rounded?: 'default' | 'full';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** @deprecated use leftIcon/rightIcon */
  icon?: React.ReactNode;
}

const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  rounded = 'default',
  leftIcon,
  rightIcon,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white hover:brightness-110',
    secondary: 'bg-secondary text-white hover:brightness-110',
    outline: 'border border-primary text-primary bg-transparent hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-base',
  };

  const spinner = (
    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        rounded === 'full' ? 'rounded-full' : 'rounded-button',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? spinner : (rightIcon ?? icon ?? null)}
      {children}
      {!isLoading && leftIcon}
    </button>
  );
});

export default Button;
