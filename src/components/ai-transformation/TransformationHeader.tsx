
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransformationHeaderProps {
  currentStep: number;
  totalSteps: number;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  className?: string;
}

const TransformationHeader: React.FC<TransformationHeaderProps> = ({ 
  currentStep, 
  totalSteps, 
  timeLeft, 
  formatTime,
  className 
}) => {
  const getProgressValue = () => {
    if (currentStep === 0) return 0;
    if (currentStep > totalSteps) return 100;
    return (currentStep / totalSteps) * 100;
  };

  const getQualityColor = () => {
    const progress = getProgressValue();
    if (progress >= 80) return 'text-emerald-400';
    if (progress >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className={cn("prompt-lab-container", className)}>
      <div className="glassmorphism-base step-card bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-white/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              AI Transformation - Giorno 1
            </h1>
          </div>
          
          {currentStep > 0 && currentStep <= totalSteps && (
            <div className="flex items-center space-x-4">
              <div className="glass rounded-lg px-3 py-2 bg-white/5 border border-white/10">
                <span className="text-white font-medium">Step {currentStep}</span>
                <span className="text-slate-400">/{totalSteps}</span>
              </div>
              <div className="flex items-center space-x-2 glass rounded-lg px-3 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30">
                <Timer className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-sm text-orange-300">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300 font-medium">Progresso Complessivo</span>
            <span className={cn("font-bold text-lg", getQualityColor())}>
              {Math.round(getProgressValue())}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={getProgressValue()} 
              className="w-full h-3 bg-slate-800/50 border border-white/10 rounded-full overflow-hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationHeader;
