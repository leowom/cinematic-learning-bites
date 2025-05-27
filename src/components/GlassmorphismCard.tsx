
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  elevated?: boolean;
  style?: React.CSSProperties;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({ 
  children, 
  className, 
  size = 'medium',
  elevated = false,
  style
}) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  return (
    <div
      className={cn(
        // Optimized base styles without backdrop-filter
        'relative rounded-2xl border border-white/20',
        'bg-white/5',
        'shadow-2xl shadow-black/20',
        'transition-all duration-150 ease-out',
        'transform-gpu',
        // Fast hover effects
        'hover:bg-white/8 hover:border-white/30',
        'hover:shadow-3xl hover:shadow-black/30',
        'hover:-translate-y-1',
        // Size classes
        sizeClasses[size],
        // Elevated state
        elevated && 'bg-white/8',
        className
      )}
      style={{
        minHeight: size === 'small' ? '100px' : size === 'medium' ? '150px' : '200px',
        willChange: elevated ? 'transform' : 'auto',
        ...style
      }}
    >
      {/* Subtle gradient overlay instead of backdrop blur */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphismCard;
