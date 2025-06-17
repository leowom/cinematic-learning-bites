
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  currentStep: number;
  totalSteps: number;
  onPreviousStep: () => void;
  canGoBack: boolean;
}

const PromptLabHeader: React.FC<Props> = ({ 
  currentStep, 
  totalSteps, 
  onPreviousStep, 
  canGoBack 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
        >
          <Home className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        
        {canGoBack && (
          <Button
            onClick={onPreviousStep}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
        )}
      </div>

      <div className="text-center">
        <div className="text-slate-200 font-medium">
          Prompt Engineering Lab
        </div>
        <div className="text-slate-400 text-sm">
          Passo {currentStep + 1} di {totalSteps}
        </div>
      </div>

      <div className="text-right">
        <div className="text-slate-300 text-sm">
          Progresso: {Math.round(((currentStep + 1) / totalSteps) * 100)}%
        </div>
        <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
          <div 
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptLabHeader;
