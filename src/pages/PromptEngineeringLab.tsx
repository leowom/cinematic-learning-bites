
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Target, Users, Building, Settings, FileText, Edit3, TestTube, Award, Zap, Eye } from 'lucide-react';
import FoundationStep from '@/components/prompt-lab/FoundationStep';
import DisasterDemo from '@/components/prompt-lab/DisasterDemo';
import RoleSelectionStep from '@/components/prompt-lab/RoleSelectionStep';
import BusinessContextStep from '@/components/prompt-lab/BusinessContextStep';
import EnhancedTaskDefinitionStep from '@/components/prompt-lab/EnhancedTaskDefinitionStep';
import StyleConstraintsStep from '@/components/prompt-lab/StyleConstraintsStep';
import OutputFormatStep from '@/components/prompt-lab/OutputFormatStep';
import HandsOnWritingStep from '@/components/prompt-lab/HandsOnWritingStep';
import AITestingStep from '@/components/prompt-lab/AITestingStep';
import EnhancedLivePreviewPanel from '@/components/prompt-lab/EnhancedLivePreviewPanel';
import FinalScoring from '@/components/prompt-lab/FinalScoring';
import PromptLabHeader from '@/components/prompt-lab/PromptLabHeader';
import { useAutoSave } from '@/hooks/useAutoSave';
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
  // User written fields
  userWrittenRole: string;
  userWrittenContext: string;
  userWrittenTasks: string;
  userWrittenTone: string;
  userWrittenFormat: string;
}

const PromptEngineeringLab = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [exerciseScores, setExerciseScores] = useState<number[]>([]);
  const [showFinalScoring, setShowFinalScoring] = useState(false);
  
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
    disasterUnderstood: false,
    userWrittenRole: '',
    userWrittenContext: '',
    userWrittenTasks: '',
    userWrittenTone: '',
    userWrittenFormat: ''
  });

  // Auto-save functionality
  const { loadSavedData, clearSavedData } = useAutoSave(promptData, currentStep);

  // Load saved data on component mount
  useEffect(() => {
    const saved = loadSavedData();
    if (saved) {
      // Aggiungi i campi mancanti se non presenti
      const completeData = {
        ...saved.data,
        userWrittenRole: saved.data.userWrittenRole || '',
        userWrittenContext: saved.data.userWrittenContext || '',
        userWrittenTasks: saved.data.userWrittenTasks || '',
        userWrittenTone: saved.data.userWrittenTone || '',
        userWrittenFormat: saved.data.userWrittenFormat || ''
      };
      setPromptData(completeData);
      setCurrentStep(saved.step);
    }
  }, []);

  const updatePromptData = (field: keyof PromptData, value: any) => {
    setPromptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const recordExerciseScore = (score: number) => {
    setExerciseScores(prev => [...prev, score]);
  };

  const handleStepComplete = () => {
    // Scroll to top when changing lesson
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowFinalScoring(true);
      clearSavedData();
    }
  };

  const handleFinalComplete = (finalData: { score: number; xp: number; completionTime: number }) => {
    setShowFinalScoring(false);
    setIsCompleted(true);
  };

  const handlePreviousStep = () => {
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepInfo = () => {
    const steps = [
      { icon: Brain, title: "Foundation Concepts", subtitle: "Understanding prompt fundamentals" },
      { icon: Zap, title: "Common Pitfalls Demo", subtitle: "Learning from ineffective examples" },
      { icon: Users, title: "Role Definition", subtitle: "Establishing AI identity and expertise" },
      { icon: Building, title: "Business Context", subtitle: "Setting operational framework" },
      { icon: Target, title: "Task Specification", subtitle: "Defining measurable objectives" },
      { icon: Settings, title: "Communication Style", subtitle: "Establishing tone and constraints" },
      { icon: FileText, title: "Output Format", subtitle: "Structuring response templates" },
      { icon: Edit3, title: "Hands-On Writing", subtitle: "Complete prompt composition practice" },
      { icon: TestTube, title: "Final AI Testing", subtitle: "Real GPT-4o validation and mastery" }
    ];
    return steps[currentStep] || { icon: Brain, title: "Prompt Engineering Lab", subtitle: "Professional prompt development" };
  };

  const stepInfo = getStepInfo();
  const StepIcon = stepInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter">
      {/* Subtle atmospheric overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      
      {/* Minimal ambient elements */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-slate-700/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-slate-600/5 rounded-full blur-3xl" />

      <div className="prompt-lab-container">
        {/* New Navigation Header */}
        <PromptLabHeader 
          currentStep={currentStep}
          totalSteps={9}
          onPreviousStep={handlePreviousStep}
          canGoBack={currentStep > 0}
        />

        {/* Main content - centered layout for early steps, grid for later steps */}
        {currentStep < 2 ? (
          /* Centered layout for steps 0-1 */
          <div className="max-w-4xl mx-auto">
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
          </div>
        ) : currentStep === 7 ? (
          /* Centered layout for hands-on writing step */
          <div className="max-w-5xl mx-auto">
            <HandsOnWritingStep 
              promptData={promptData}
              updatePromptData={updatePromptData}
              onComplete={handleStepComplete}
            />
          </div>
        ) : (
          /* Grid layout for steps 2-6 and 8 with preview panel */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Steps */}
            <div className="lg:col-span-2">
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
              {currentStep === 8 && (
                <AITestingStep 
                  promptData={promptData}
                  updatePromptData={updatePromptData}
                  onComplete={handleStepComplete}
                />
              )}
            </div>

            {/* Right column - Live Preview */}
            <div className="lg:col-span-1">
              <EnhancedLivePreviewPanel promptData={promptData} />
            </div>
          </div>
        )}
      </div>

      {/* Final Scoring */}
      {showFinalScoring && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl p-8 max-w-4xl mx-4 shadow-2xl shadow-black/40">
            <FinalScoring 
              startTime={startTime}
              totalScore={promptData.qualityScore}
              exerciseScores={exerciseScores}
              onComplete={handleFinalComplete}
            />
          </div>
        </div>
      )}

      {/* Simple completion message after final scoring */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl p-8 max-w-md mx-4 shadow-2xl shadow-black/40 text-center">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Congratulazioni!</h2>
            <p className="text-slate-300 mb-6">Hai completato con successo il Prompt Engineering Lab.</p>
            <Button
              onClick={() => setIsCompleted(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Chiudi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptEngineeringLab;
