
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  elevated?: boolean;
  style?: React.CSSProperties;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = memo(({ 
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

  const minHeights = {
    small: '80px',
    medium: '120px',
    large: '160px'
  };

  return (
    <div
      className={cn(
        // Performance optimized base styles - reduced backdrop-blur
        'relative rounded-2xl border border-white/30',
        'bg-slate-900/90',
        'shadow-xl shadow-black/20',
        'transition-all duration-300 ease-out',
        'stable-card',
        // Optimized hover effects
        'hover:shadow-2xl hover:shadow-black/30',
        'hover:bg-slate-800/95',
        // GPU acceleration hints
        'will-change-transform',
        // Size classes
        sizeClasses[size],
        // Elevated state
        elevated && 'bg-slate-800/95 shadow-2xl',
        className
      )}
      style={{
        minHeight: minHeights[size],
        width: '100%',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)', // Force GPU layer
        ...style
      }}
    >
      {/* Simplified gradient overlay for better performance */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      {/* Content with ensured readability */}
      <div className="relative z-10 h-full text-white">
        {children}
      </div>
    </div>
  );
});

GlassmorphismCard.displayName = 'GlassmorphismCard';

export default GlassmorphismCard;
