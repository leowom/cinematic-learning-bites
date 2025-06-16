
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Lock, Brain, Zap, Users, Building, Target, Settings, FileText, Edit3, TestTube, Award } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  current: boolean;
  locked: boolean;
}

interface Props {
  currentStep: number;
  completedSteps: boolean[];
  onStepClick: (stepIndex: number) => void;
}

const StepNavigator: React.FC<Props> = ({ currentStep, completedSteps, onStepClick }) => {
  const stepIcons = [Brain, Zap, Users, Building, Target, Settings, FileText, Edit3, TestTube, Award];
  
  const stepTitles = [
    { title: "Fondamenti", subtitle: "Concetti base" },
    { title: "Esempi Negativi", subtitle: "Cosa evitare" },
    { title: "Definizione Ruolo", subtitle: "Identità AI" },
    { title: "Contesto Aziendale", subtitle: "Framework operativo" },
    { title: "Specifiche Task", subtitle: "Obiettivi misurabili" },
    { title: "Stile e Vincoli", subtitle: "Parametri comunicazione" },
    { title: "Formato Output", subtitle: "Template risposte" },
    { title: "Scrittura Libera", subtitle: "Costruzione autonoma" },
    { title: "Test AI", subtitle: "Validazione" },
    { title: "Valutazione", subtitle: "Certificazione finale" }
  ];

  const steps: Step[] = stepTitles.map((step, index) => ({
    id: index,
    title: step.title,
    subtitle: step.subtitle,
    icon: stepIcons[index],
    completed: completedSteps[index] || false,
    current: currentStep === index,
    locked: index > currentStep + 1 || (index > 0 && !completedSteps[index - 1] && index !== currentStep)
  }));

  const handleStepClick = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step.locked && (step.completed || stepIndex <= currentStep)) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div className="w-80 bg-slate-900/60 backdrop-blur-sm border-r border-slate-700/50 h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="text-slate-200 font-medium text-lg">Navigazione Passi</h3>
        <p className="text-slate-400 text-sm mt-1">Clicca per navigare tra i passi completati</p>
      </div>
      
      <div className="p-4 space-y-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isClickable = !step.locked && (step.completed || step.id <= currentStep);
          
          return (
            <Button
              key={step.id}
              variant="ghost"
              onClick={() => handleStepClick(step.id)}
              disabled={!isClickable}
              className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
                step.current
                  ? 'bg-slate-700/60 border border-slate-600/50 text-slate-100'
                  : step.completed
                  ? 'hover:bg-slate-700/40 text-slate-200 border border-transparent'
                  : step.locked
                  ? 'opacity-50 cursor-not-allowed text-slate-500'
                  : 'hover:bg-slate-700/40 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className={`flex-shrink-0 p-1.5 rounded-lg ${
                  step.current 
                    ? 'bg-slate-600/60 border border-slate-500/50'
                    : step.completed
                    ? 'bg-emerald-900/40 border border-emerald-700/50'
                    : step.locked
                    ? 'bg-slate-800/60 border border-slate-700/50'
                    : 'bg-slate-800/60 border border-slate-700/50'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                  ) : step.locked ? (
                    <Lock className="w-4 h-4 text-slate-500" />
                  ) : step.current ? (
                    <Circle className="w-4 h-4 text-slate-300 fill-slate-300" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{step.subtitle}</div>
                </div>
                
                <div className="flex-shrink-0 text-xs text-slate-500 font-medium">
                  {step.id + 1}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-700/50 mt-4">
        <div className="text-xs text-slate-400 space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-emerald-300" />
            <span>Completato</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-3 h-3 text-slate-300 fill-slate-300" />
            <span>Corrente</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Bloccato</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepNavigator;
