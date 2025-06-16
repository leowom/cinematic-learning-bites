
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FoundationStep from '@/components/prompt-lab/FoundationStep';
import DisasterDemo from '@/components/prompt-lab/DisasterDemo';
import RoleSelectionStep from '@/components/prompt-lab/RoleSelectionStep';
import BusinessContextStep from '@/components/prompt-lab/BusinessContextStep';
import TaskDefinitionStep from '@/components/prompt-lab/TaskDefinitionStep';
import StyleConstraintsStep from '@/components/prompt-lab/StyleConstraintsStep';
import OutputFormatStep from '@/components/prompt-lab/OutputFormatStep';
import MasteryTest from '@/components/prompt-lab/MasteryTest';
import LivePreviewPanel from '@/components/prompt-lab/LivePreviewPanel';
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
  // New educational fields
  foundationComplete: boolean;
  disasterUnderstood: boolean;
}

const PromptEngineeringLab = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start from 0 now
  const [isCompleted, setIsCompleted] = useState(false);
  const [promptData, setPromptData] = useState<PromptData>({
    role: '',
    experience: 5,
    businessType: '',
    context: '',
    tasks: [],
    tone: { formal: 60, empathy: 40 },
    outputFormat: [],
    qualityScore: 0,
    foundationComplete: false,
    disasterUnderstood: false
  });

  const updatePromptData = (field: keyof PromptData, value: any) => {
    setPromptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepComplete = () => {
    if (currentStep < 7) { // Now goes to step 7
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const getStepTitle = () => {
    const titles = [
      "🤔 STEP 0/7: Cos'è un Prompt?",
      "💥 STEP 1/7: Il Prompt Generico (Disaster Demo)",
      "🎭 STEP 2/7: Definisci Ruolo AI",
      "🌍 STEP 3/7: Contesto Business",
      "🎯 STEP 4/7: Task Specifici",
      "⚖️ STEP 5/7: Style & Constraints",
      "📤 STEP 6/7: Output Format",
      "🎓 STEP 7/7: Test di Mastery"
    ];
    return titles[currentStep] || "Prompt Engineering Lab";
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
            🎓 Dalle Fondamenta al Prompt Perfetto
          </h1>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            Un viaggio educativo step-by-step per imparare il prompt engineering partendo da zero. 
            Ogni passo ti porterà dalla confusione alla mastery professionale.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-4 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">{getStepTitle()}</span>
              <span className="text-white font-semibold">{currentStep + 1}/8</span>
            </div>
            <div className="bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${((currentStep + 1) / 8) * 100}%` }}
              />
            </div>
            {promptData.qualityScore > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-white/60 text-xs">Quality Score:</span>
                <span className="text-green-400 font-bold">{promptData.qualityScore}/10</span>
              </div>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 0 && (
              <FoundationStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 1 && (
              <DisasterDemo 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 2 && (
              <RoleSelectionStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 3 && (
              <BusinessContextStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 4 && (
              <TaskDefinitionStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 5 && (
              <StyleConstraintsStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 6 && (
              <OutputFormatStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 7 && (
              <MasteryTest 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
          </div>

          {/* Right column - Live Preview (only show from step 2 onwards) */}
          {currentStep >= 2 && (
            <div className="lg:col-span-1">
              <LivePreviewPanel promptData={promptData} />
            </div>
          )}
        </div>
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
