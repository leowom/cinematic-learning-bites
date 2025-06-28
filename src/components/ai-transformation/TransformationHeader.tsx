
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
      <div className="step-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-semibold text-white">AI Transformation - Giorno 1</h1>
          </div>
          
          {currentStep > 0 && currentStep <= totalSteps && (
            <div className="flex items-center space-x-4">
              <div className="text-slate-300">
                <span className="text-white font-medium">Step {currentStep}</span>
                <span className="text-slate-400">/{totalSteps}</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-400">
                <Timer className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Progresso Complessivo</span>
            <span className={cn("font-medium", getQualityColor())}>
              {Math.round(getProgressValue())}%
            </span>
          </div>
          <Progress 
            value={getProgressValue()} 
            className="w-full h-2 bg-slate-800"
          />
        </div>
      </div>
    </div>
  );
};

export default TransformationHeader;
