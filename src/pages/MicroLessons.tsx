
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MicroLessonContent from '@/components/lessons/MicroLessonContent';
import NotesPopup from '@/components/lessons/NotesPopup';
import { StickyNote, ChevronLeft, ChevronRight } from 'lucide-react';

const MicroLessons = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [notes, setNotes] = useState('');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    'Problema Reale',
    'Prompt Builder Interattivo',
    'Test & Implementazione'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Learning Bites</h1>
              <p className="text-blue-200 text-sm">AI Email Automation - 15 minuti</p>
            </div>
            
            {/* Notes Popup Trigger */}
            <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <StickyNote className="w-4 h-4 mr-2" />
                  Note ({notes.length > 0 ? '●' : '○'})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-slate-900/95 border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Note Personali</DialogTitle>
                </DialogHeader>
                <NotesPopup 
                  notes={notes}
                  onNotesChange={setNotes}
                  currentStep={currentStep}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Progress & Navigation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Step {currentStep}: {stepTitles[currentStep - 1]}
              </h2>
              <Badge variant="outline" className="bg-white/10 border-white/30 text-blue-200">
                {currentStep} di {totalSteps}
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2 bg-white/20" />
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Precedente
              </Button>
              
              {/* Step Indicators */}
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-150 ${
                      step === currentStep
                        ? 'bg-blue-500 text-white shadow-lg'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-blue-200 hover:bg-white/30'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={currentStep === totalSteps}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              >
                Successivo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto p-4">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 min-h-[70vh]">
          <MicroLessonContent 
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>
      </div>
    </div>
  );
};

export default MicroLessons;
