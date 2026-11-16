import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
    accent: 'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-lg active:scale-[0.98]',
    ghost: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20',
    outline: 'border border-border-medium text-text-primary hover:border-primary hover:text-primary bg-white',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
