
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import ProblemScenario from './ProblemScenario';
import PromptBuilder from './PromptBuilder';
import SolutionSummary from './SolutionSummary';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MicroLessonContentProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const MicroLessonContent: React.FC<MicroLessonContentProps> = ({ 
  currentStep, 
  onStepChange 
}) => {
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProblemScenario />;
      case 2:
        return <PromptBuilder />;
      case 3:
        return <SolutionSummary />;
      default:
        return <ProblemScenario />;
    }
  };

  const stepTitles = [
    'Problema Reale',
    'Soluzione AI - Prompt Engineering',
    'Implementazione Pratica'
  ];

  return (
    <div className="h-full">
      <GlassmorphismCard className="h-full" size="large">
        <div className="border-b border-white/20 pb-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Step {currentStep}: {stepTitles[currentStep - 1]}
            </h2>
            <div className="text-sm text-blue-200">
              {currentStep} di {totalSteps}
            </div>
          </div>
          
          <Progress value={progress} className="h-2 bg-white/20" />
          
          <div className="flex justify-between text-xs text-blue-200 mt-1">
            <span>3 min</span>
            <span>7 min</span>
            <span>5 min</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-6" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {renderStepContent()}
        </div>

        <div className="border-t border-white/20 pt-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => onStepChange(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
              Precedente
            </Button>
            
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  onClick={() => onStepChange(step)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors duration-100 ${
                    step === currentStep
                      ? 'bg-blue-400 text-white'
                      : step < currentStep
                      ? 'bg-green-400 text-white'
                      : 'bg-white/20 text-blue-200'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            <Button
              onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
              disabled={currentStep === totalSteps}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Successivo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};

export default MicroLessonContent;
