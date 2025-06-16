
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';

interface Props {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  isStepComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isLastStep: boolean;
}

const NavigationControls: React.FC<Props> = ({
  currentStep,
  totalSteps,
  canGoBack,
  canGoForward,
  isStepComplete,
  onPrevious,
  onNext,
  onComplete,
  isLastStep
}) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
      {/* Left side - Back button */}
      <div>
        {canGoBack ? (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Center - Step indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-slate-400 text-sm">
          Passo {currentStep + 1} di {totalSteps}
        </span>
        {isStepComplete && (
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        )}
      </div>

      {/* Right side - Next/Complete button */}
      <div>
        {isLastStep ? (
          <Button
            onClick={onComplete}
            disabled={!isStepComplete}
            className="bg-emerald-700 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Award className="w-4 h-4 mr-2" />
            Completa Valutazione
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!isStepComplete}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {canGoForward ? 'Continua' : 'Completa per Continuare'}
            </span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationControls;
