import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const buttonClasses = {
    sm: 'w-7 h-full',
    md: 'w-9 h-full',
    lg: 'w-11 h-full',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center border border-border-medium rounded-xl bg-white shadow-sm overflow-hidden select-none',
        sizeClasses[size],
        className
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= min}
        className={cn(
          'flex items-center justify-center hover:bg-background-tertiary transition-colors text-text-secondary disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer',
          buttonClasses[size]
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="px-3 font-semibold text-text-primary text-center min-w-[2.25rem]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= max}
        className={cn(
          'flex items-center justify-center hover:bg-background-tertiary transition-colors text-text-secondary disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer',
          buttonClasses[size]
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantityStepper;
