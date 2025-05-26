
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
        // Base glassmorphism styles
        'relative rounded-2xl border border-white/20',
        'bg-white/10 backdrop-blur-xl',
        'shadow-2xl shadow-black/20',
        'transition-all duration-500 ease-out',
        'transform-gpu',
        // Hover effects
        'hover:bg-white/15 hover:border-white/30',
        'hover:shadow-3xl hover:shadow-black/30',
        'hover:-translate-y-2 hover:scale-[1.02]',
        // Size classes
        sizeClasses[size],
        // Elevated state
        elevated && 'translate-z-10 bg-white/15',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphismCard;
