
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

  const minHeights = {
    small: '120px',
    medium: '180px',
    large: '240px'
  };

  return (
    <div
      className={cn(
        // Performance optimized base styles with better contrast
        'relative rounded-2xl border border-white/30',
        // Semi-transparent dark background for better text readability
        'bg-slate-900/85',
        'shadow-2xl shadow-black/20',
        'transition-all duration-100 ease-out',
        'stable-card',
        // Fast hover effects - box-shadow only
        'hover:shadow-3xl hover:shadow-black/30',
        'hover:bg-slate-900/90',
        // Size classes
        sizeClasses[size],
        // Elevated state
        elevated && 'bg-slate-800/90',
        className
      )}
      style={{
        minHeight: minHeights[size],
        width: '100%',
        contain: 'layout style paint',
        willChange: 'auto',
        ...style
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content with ensured readability */}
      <div className="relative z-10 h-full text-white">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphismCard;
