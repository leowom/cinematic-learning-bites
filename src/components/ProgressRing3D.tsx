
import React from 'react';

interface ProgressRing3DProps {
  progress: number;
  size?: number;
}

const ProgressRing3D: React.FC<ProgressRing3DProps> = ({ progress, size = 240 }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className="relative transform-gpu"
      style={{ 
        width: size, 
        height: size,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Background ring shadow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-black/20 to-transparent blur-sm" />
      
      {/* Main progress ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content - simplified */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-1 drop-shadow-lg">{progress}%</div>
          <div className="text-sm text-white/80 font-medium drop-shadow-sm">Completato</div>
        </div>
      </div>
      
      {/* Floating accent */}
      <div className="absolute top-6 right-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
    </div>
  );
};

export default ProgressRing3D;
