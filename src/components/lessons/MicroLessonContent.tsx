
import React from 'react';
import ProblemScenario from './ProblemScenario';
import InteractivePromptBuilder from './InteractivePromptBuilder';
import TestImplementation from './TestImplementation';

interface MicroLessonContentProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const MicroLessonContent: React.FC<MicroLessonContentProps> = ({ 
  currentStep, 
  onStepChange 
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProblemScenario />;
      case 2:
        return <InteractivePromptBuilder />;
      case 3:
        return <TestImplementation />;
      default:
        return <ProblemScenario />;
    }
  };

  return (
    <div className="h-full">
      {renderStepContent()}
    </div>
  );
};

export default MicroLessonContent;
