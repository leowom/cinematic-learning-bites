
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
    <div className="h-full bg-white/95 backdrop-blur-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Step {currentStep}: {stepTitles[currentStep - 1]}
          </h2>
          <div className="text-sm text-gray-600">
            {currentStep} di {totalSteps}
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3 min</span>
          <span>7 min</span>
          <span>5 min</span>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {renderStepContent()}
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50/80">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
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
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          <Button
            onClick={() => onStepChange(Math.min(totalSteps, currentStep + 1))}
            disabled={currentStep === totalSteps}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Successivo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MicroLessonContent;
