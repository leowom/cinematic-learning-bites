
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Target, Users, Building, Settings, FileText, Edit3, TestTube, Award, Zap } from 'lucide-react';
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
import PromptLabHeader from '@/components/prompt-lab/PromptLabHeader';
import StepNavigator from '@/components/prompt-lab/StepNavigator';
import NavigationControls from '@/components/prompt-lab/NavigationControls';
import ProgressManager from '@/components/prompt-lab/ProgressManager';
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
  foundationComplete: boolean;
  disasterUnderstood: boolean;
}

const PromptEngineeringLab = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(10).fill(false));
  
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
    setHasUnsavedChanges(true);
  };

  const handleStepComplete = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);
    setHasUnsavedChanges(false);
    
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleStepNavigation = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps[stepIndex]) {
      setCurrentStep(stepIndex);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 9 && completedSteps[currentStep]) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    // Progress is automatically saved by ProgressManager
  };

  const handleDataRestore = (data: PromptData, step: number, completed: boolean[]) => {
    setPromptData(data);
    setCurrentStep(step);
    setCompletedSteps(completed);
    setHasUnsavedChanges(false);
  };

  const getStepInfo = () => {
    const steps = [
      { icon: Brain, title: "Concetti Fondamentali", subtitle: "Comprensione dei fondamenti del prompt engineering" },
      { icon: Zap, title: "Demo Errori Comuni", subtitle: "Apprendimento dagli esempi inefficaci" },
      { icon: Users, title: "Definizione Ruolo", subtitle: "Stabilire identità e competenza dell'AI" },
      { icon: Building, title: "Contesto Aziendale", subtitle: "Impostare il framework operativo" },
      { icon: Target, title: "Specifiche Task", subtitle: "Definire obiettivi misurabili" },
      { icon: Settings, title: "Stile e Vincoli", subtitle: "Stabilire parametri di comunicazione" },
      { icon: FileText, title: "Formato Output", subtitle: "Strutturare template di risposta" },
      { icon: Edit3, title: "Sfida Scrittura Libera", subtitle: "Costruzione autonoma del prompt" },
      { icon: TestTube, title: "Test AI", subtitle: "Validazione e ottimizzazione" },
      { icon: Award, title: "Valutazione Finale", subtitle: "Valutazione finale e certificazione" }
    ];
    return steps[currentStep] || { icon: Brain, title: "Prompt Engineering Lab", subtitle: "Sviluppo professionale di prompt" };
  };

  const stepInfo = getStepInfo();
  const isStepComplete = completedSteps[currentStep] || false;
  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < 9 && completedSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter">
      <ProgressManager
        currentStep={currentStep}
        promptData={promptData}
        completedSteps={completedSteps}
        onDataRestore={handleDataRestore}
      />
      
      {/* Header Navigation */}
      <PromptLabHeader
        currentStep={currentStep}
        totalSteps={10}
        stepTitle={stepInfo.title}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Step Navigator Sidebar */}
        {showSidebar && (
          <StepNavigator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepNavigation}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Content Container */}
          <div className={`flex-1 ${currentStep < 2 ? '' : 'lg:flex'}`}>
            {/* Steps Content */}
            <div className={`${currentStep < 2 ? 'max-w-4xl mx-auto p-6' : 'flex-1 p-6'}`}>
              {/* Step Content */}
              <div className="space-y-6">
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

                {/* Navigation Controls */}
                <NavigationControls
                  currentStep={currentStep}
                  totalSteps={10}
                  canGoBack={canGoBack}
                  canGoForward={canGoForward}
                  isStepComplete={isStepComplete}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onComplete={handleStepComplete}
                  isLastStep={currentStep === 9}
                />
              </div>
            </div>

            {/* Live Preview Panel - Only for steps 2+ */}
            {currentStep >= 2 && (
              <div className="w-80 border-l border-slate-700/50 bg-slate-900/30">
                <EnhancedLivePreviewPanel promptData={promptData} />
              </div>
            )}
          </div>
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
