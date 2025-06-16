
import { useEffect } from 'react';

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

interface Props {
  currentStep: number;
  promptData: PromptData;
  completedSteps: boolean[];
  onDataRestore: (data: PromptData, step: number, completed: boolean[]) => void;
}

const STORAGE_KEY = 'prompt-lab-progress';

const ProgressManager: React.FC<Props> = ({
  currentStep,
  promptData,
  completedSteps,
  onDataRestore
}) => {
  // Save progress whenever data changes
  useEffect(() => {
    const progressData = {
      currentStep,
      promptData,
      completedSteps,
      timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
  }, [currentStep, promptData, completedSteps]);

  // Restore progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Only restore if it's recent (within 24 hours)
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent && parsed.currentStep !== undefined) {
          onDataRestore(parsed.promptData, parsed.currentStep, parsed.completedSteps || []);
        }
      } catch (error) {
        console.error('Error restoring progress:', error);
      }
    }
  }, []); // Only run on mount

  return null; // This is a data management component, no UI
};

export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasStoredProgress = (): boolean => {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (!savedProgress) return false;
  
  try {
    const parsed = JSON.parse(savedProgress);
    const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
    return isRecent && parsed.currentStep !== undefined;
  } catch {
    return false;
  }
};

export default ProgressManager;
