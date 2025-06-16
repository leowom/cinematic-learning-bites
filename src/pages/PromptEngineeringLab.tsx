
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import RoleSelectionStep from '@/components/prompt-lab/RoleSelectionStep';
import BusinessContextStep from '@/components/prompt-lab/BusinessContextStep';
import TaskDefinitionStep from '@/components/prompt-lab/TaskDefinitionStep';
import StyleConstraintsStep from '@/components/prompt-lab/StyleConstraintsStep';
import OutputFormatStep from '@/components/prompt-lab/OutputFormatStep';
import LivePreviewPanel from '@/components/prompt-lab/LivePreviewPanel';
import TestingSection from '@/components/prompt-lab/TestingSection';
import CompletionModal from '@/components/prompt-lab/CompletionModal';

interface PromptData {
  role: string;
  experience: number;
  businessType: string;
  context: string;
  tasks: string[];
  tone: { formal: number; empathy: number };
  outputFormat: string[];
  qualityScore: number;
}

const PromptEngineeringLab = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [promptData, setPromptData] = useState<PromptData>({
    role: '',
    experience: 5,
    businessType: '',
    context: '',
    tasks: [],
    tone: { formal: 60, empathy: 40 },
    outputFormat: [],
    qualityScore: 0
  });

  const updatePromptData = (field: keyof PromptData, value: any) => {
    setPromptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepComplete = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      
      {/* Ambient elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl" />
      <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            🧠 Prompt Engineering Lab
          </h1>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            Impara a costruire prompt efficaci step-by-step. Trasforma prompt generici in istruzioni precise che ottengono risultati professionali.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-4 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Progress</span>
              <span className="text-white font-semibold">{currentStep}/5</span>
            </div>
            <div className="bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <RoleSelectionStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 2 && (
              <BusinessContextStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 3 && (
              <TaskDefinitionStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 4 && (
              <StyleConstraintsStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 5 && (
              <OutputFormatStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
          </div>

          {/* Right column - Live Preview */}
          <div className="lg:col-span-1">
            <LivePreviewPanel promptData={promptData} />
          </div>
        </div>

        {/* Testing section */}
        {currentStep === 5 && (
          <div className="mt-12">
            <TestingSection promptData={promptData} />
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <CompletionModal 
          onClose={() => setIsCompleted(false)}
          finalScore={promptData.qualityScore}
        />
      )}
    </div>
  );
};

export default PromptEngineeringLab;
