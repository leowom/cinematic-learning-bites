
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MicroLessonContent from '@/components/lessons/MicroLessonContent';
import NotesPopup from '@/components/lessons/NotesPopup';
import { StickyNote, ChevronLeft, ChevronRight, Clock, Target } from 'lucide-react';

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
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/6 rounded-full blur-2xl" />
      </div>

      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Learning Bites</h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-blue-200">AI Email Automation</p>
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">15 minuti</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Livello Intermedio</span>
                </div>
              </div>
            </div>
            
            {/* Notes Popup Trigger */}
            <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-blue-500/20 border-blue-400/30 text-blue-200 hover:bg-blue-500/30"
                >
                  <StickyNote className="w-4 h-4 mr-2" />
                  Note {notes.length > 0 && <span className="ml-1 text-green-300">●</span>}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-slate-900/95 border-white/20 backdrop-blur-sm">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Step {currentStep}: {stepTitles[currentStep - 1]}
              </h2>
              <Badge variant="outline" className="bg-blue-500/20 border-blue-400/30 text-blue-200">
                {currentStep} di {totalSteps}
              </Badge>
            </div>
            
            <Progress 
              value={progress} 
              className="h-2 bg-slate-800/50" 
            />
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                size="sm"
                className="bg-slate-800/40 border-white/30 text-white hover:bg-slate-700/60 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Precedente
              </Button>
              
              {/* Step Indicators */}
              <div className="flex gap-3">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                      step === currentStep
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
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
      <div className="relative z-10 container mx-auto p-6">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 min-h-[75vh]">
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
