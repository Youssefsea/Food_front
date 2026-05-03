'use client';
import React, { forwardRef, useState, memo } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Check } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** @deprecated use rightIcon */
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'bordered' | 'filled' | 'underline';
  showValidCheck?: boolean;
  isValid?: boolean;
}

const Input = memo(forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label, error, hint,
    leftIcon, rightIcon, icon,
    size = 'md', variant = 'bordered',
    showValidCheck, isValid,
    className, type, ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const resolvedRightIcon = rightIcon ?? icon;

  const sizes = { sm: 'text-xs h-10', md: 'text-sm h-12', lg: 'text-base h-14' };

  const variantStyles = {
    bordered: cn(
      'rounded-input border bg-white',
      error ? 'border-red-500' : isValid ? 'border-accent' : 'border-gray-300',
      'focus:ring-2 focus:ring-primary/30 focus:border-primary'
    ),
    filled: cn(
      'rounded-input border-0 bg-gray-100',
      error ? 'ring-2 ring-red-500' : isValid ? 'ring-2 ring-accent' : '',
      'focus:ring-2 focus:ring-primary/30 focus:bg-white'
    ),
    underline: cn(
      'rounded-none border-0 border-b bg-transparent px-0',
      error ? 'border-red-500' : isValid ? 'border-accent' : 'border-gray-300',
      'focus:border-primary focus:ring-0'
    ),
  };

  // RTL: icon on the right side (visual-right = logical start in RTL)
  const hasPaddingRight = !!resolvedRightIcon;
  // valid check on visual-left (logical end in RTL) = same side as password toggle
  const hasPaddingLeft = isPassword || (showValidCheck && isValid);

  return (
    <div className="w-full" dir="rtl">
      {label && (
        <label className="block text-xs font-semibold text-muted mb-2 text-right">
          {label}
        </label>
      )}
      <div className="relative">
        {resolvedRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            {resolvedRightIcon}
          </div>
        )}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          dir="rtl"
          className={cn(
            'w-full outline-none transition-all duration-200 text-dark placeholder:text-muted',
            variant !== 'underline' && 'px-4',
            hasPaddingRight && 'pr-10',
            hasPaddingLeft && 'pl-10',
            sizes[size],
            variantStyles[variant],
            className
          )}
          {...props}
        />
        {/* visual-left slot: password toggle OR valid check */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : showValidCheck && isValid ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none">
            <Check className="w-4 h-4" />
          </div>
        ) : null}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 text-right">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-muted text-right">{hint}</p>}
    </div>
  );
}));

export default Input;
