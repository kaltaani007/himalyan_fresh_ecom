import React from 'react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl lg:text-4xl font-bold',
  };

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <div className={cn('inline-flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-heading text-primary-dark', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className="text-sm text-text-light line-through font-normal">
            {formatPrice(originalPrice)}
          </span>
          {discountPercent && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent-dark">
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
