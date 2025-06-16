
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Save, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExitConfirmDialog from './ExitConfirmDialog';

interface Props {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  hasUnsavedChanges: boolean;
  onSave: () => void;
}

const PromptLabHeader: React.FC<Props> = ({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  hasUnsavedChanges,
  onSave 
}) => {
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleExitClick = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleConfirmExit = (shouldSave: boolean) => {
    if (shouldSave) {
      onSave();
    }
    setShowExitDialog(false);
    navigate('/dashboard');
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitClick}
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Esci dal Lab
              </Button>
              
              <div className="h-6 w-px bg-slate-600" />
              
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                <Home className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">/</span>
                <span className="text-slate-300">Prompt Engineering Lab</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-100 font-medium">{stepTitle}</span>
              </nav>
            </div>

            {/* Center - Progress */}
            <div className="flex items-center space-x-3">
              <div className="text-slate-300 text-sm font-medium">
                Passo {currentStep + 1} di {totalSteps}
              </div>
              <div className="w-32 h-2 bg-slate-700/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-slate-500 to-slate-400 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSave}
                  className="text-slate-300 border-slate-600 hover:bg-slate-700/50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salva
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ExitConfirmDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={handleConfirmExit}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </>
  );
};

export default PromptLabHeader;
