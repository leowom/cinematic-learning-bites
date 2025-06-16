
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        // Velocità variabile per un caricamento più realistico
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50 transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo Learning Bites */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-bold text-white">LB</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Learning Bites</h1>
        </div>

        {/* Testo di caricamento */}
        <div className="space-y-4">
          <p className="text-lg text-white/80">Caricamento</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="w-full h-3 bg-white/20"
            />
            <p className="text-sm text-white/60">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Animazione pulsante */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
