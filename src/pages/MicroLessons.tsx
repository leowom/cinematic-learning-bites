
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import MicroLessonContent from '@/components/lessons/MicroLessonContent';
import NotesPanel from '@/components/lessons/NotesPanel';

const MicroLessons = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [notes, setNotes] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Learning Bites</h1>
          <p className="text-blue-200">AI Email Automation - 15 minuti</p>
        </header>

        <ResizablePanelGroup direction="horizontal" className="min-h-[80vh] rounded-lg overflow-hidden">
          <ResizablePanel defaultSize={70} minSize={60}>
            <MicroLessonContent 
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-slate-700/50" />
          
          <ResizablePanel defaultSize={30} minSize={25}>
            <NotesPanel 
              notes={notes}
              onNotesChange={setNotes}
              currentStep={currentStep}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MicroLessons;
