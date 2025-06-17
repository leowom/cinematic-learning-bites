
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

export const useAutoSave = (promptData: PromptData, currentStep: number) => {
  useEffect(() => {
    const saveData = {
      ...promptData,
      currentStep,
      timestamp: Date.now()
    };
    
    localStorage.setItem('prompt-lab-progress', JSON.stringify(saveData));
  }, [promptData, currentStep]);

  const loadSavedData = (): { data: PromptData; step: number } | null => {
    try {
      const saved = localStorage.getItem('prompt-lab-progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        const { currentStep, timestamp, ...data } = parsed;
        
        // Check if data is less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return { data, step: currentStep };
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    return null;
  };

  const clearSavedData = () => {
    localStorage.removeItem('prompt-lab-progress');
  };

  return { loadSavedData, clearSavedData };
};
