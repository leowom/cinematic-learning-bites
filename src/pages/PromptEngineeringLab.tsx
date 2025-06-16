import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FoundationStep from '@/components/prompt-lab/FoundationStep';
import DisasterDemo from '@/components/prompt-lab/DisasterDemo';
import RoleSelectionStep from '@/components/prompt-lab/RoleSelectionStep';
import BusinessContextStep from '@/components/prompt-lab/BusinessContextStep';
import EnhancedTaskDefinitionStep from '@/components/prompt-lab/EnhancedTaskDefinitionStep';
import StyleConstraintsStep from '@/components/prompt-lab/StyleConstraintsStep';
import OutputFormatStep from '@/components/prompt-lab/OutputFormatStep';
import FreeWritingStep from '@/components/prompt-lab/FreeWritingStep';
import AITestingStep from '@/components/prompt-lab/AITestingStep';
import MasteryTest from '@/components/prompt-lab/MasteryTest';
import EnhancedLivePreviewPanel from '@/components/prompt-lab/EnhancedLivePreviewPanel';
import CompletionModal from '@/components/prompt-lab/CompletionModal';
import '../styles/prompt-lab.css';

interface PromptData {
  role: string;
  experience: number;
  businessType: string;
  context: string;
  tasks: string[];
  tone: { formal: number; empathy: number };
  outputFormat: string[];
  qualityScore: number;
  taskComplexity: number;
  aiTestScore: number;
  freeWrittenPrompt: string;
  // Educational fields
  foundationComplete: boolean;
  disasterUnderstood: boolean;
}

const PromptEngineeringLab = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
    taskComplexity: 0,
    aiTestScore: 0,
    freeWrittenPrompt: '',
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
    if (currentStep < 9) { // Now goes to step 9 (0-9 = 10 steps)
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const getStepTitle = () => {
    const titles = [
      "🤔 STEP 0/9: Cos'è un Prompt?",
      "💥 STEP 1/9: Il Prompt Generico (Disaster Demo)",
      "🎭 STEP 2/9: Definisci Ruolo AI",
      "🌍 STEP 3/9: Contesto Business",
      "🎯 STEP 4/9: Task Specifici e Misurabili",
      "⚖️ STEP 5/9: Style & Constraints",
      "📤 STEP 6/9: Output Format",
      "✍️ STEP 7/9: Free Writing Challenge",
      "🧪 STEP 8/9: Test Reale con AI",
      "🎓 STEP 9/9: Mastery Finale"
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

      <div className="prompt-lab-container">
        {/* Header */}
        <div className="text-center element-spacing">
          <h1 className="text-3xl font-bold text-white leading-tight sub-element-spacing">
            🎓 Dalle Fondamenta al Prompt Perfetto
          </h1>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            Un viaggio educativo step-by-step per imparare il prompt engineering partendo da zero. 
            Ogni passo ti porterà dalla confusione alla mastery professionale.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="section-spacing">
          <div className="step-card glassmorphism-base">
            <div className="flex items-center justify-between sub-element-spacing relative z-10">
              <span className="text-white/70 text-sm">{getStepTitle()}</span>
              <span className="text-white font-semibold">{currentStep + 1}/10</span>
            </div>
            <div className="bg-slate-700 rounded-full h-3 relative z-10">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${((currentStep + 1) / 10) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between relative z-10">
              <span className="text-white/60 text-xs">Progress</span>
              {promptData.qualityScore > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-white/60 text-xs">Quality:</span>
                    <span className="text-green-400 font-bold text-sm">{promptData.qualityScore.toFixed(1)}/10</span>
                  </div>
                  {promptData.taskComplexity > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-white/60 text-xs">Complexity:</span>
                      <span className={`font-bold text-sm ${
                        promptData.taskComplexity <= 6 ? 'text-green-400' : 
                        promptData.taskComplexity <= 10 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {promptData.taskComplexity}/15
                      </span>
                    </div>
                  )}
                  {promptData.aiTestScore > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-white/60 text-xs">AI Test:</span>
                      <span className="text-blue-400 font-bold text-sm">{promptData.aiTestScore}/10</span>
                    </div>
                  )}
                </div>
              )}
            </div>
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
              <EnhancedTaskDefinitionStep 
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
              <FreeWritingStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 8 && (
              <AITestingStep 
                promptData={promptData}
                updatePromptData={updatePromptData}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 9 && (
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
              <EnhancedLivePreviewPanel promptData={promptData} />
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
