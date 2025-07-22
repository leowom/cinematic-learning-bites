import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, ChevronRight, Play } from 'lucide-react';

interface LessonContentSectionProps {
  lesson: {
    content?: string;
    slides?: string[];
    examples?: string[];
  };
  onStartQuiz: () => void;
  onCompleteLesson: () => void;
  hasQuiz: boolean;
}

const LessonContentSection: React.FC<LessonContentSectionProps> = ({
  lesson,
  onStartQuiz,
  onCompleteLesson,
  hasQuiz
}) => {
  const [currentStep, setCurrentStep] = useState<'theory' | 'examples' | 'ready'>('theory');

  const hasContent = lesson.content && lesson.content.length > 0;
  const hasSlides = lesson.slides && lesson.slides.length > 0;
  const hasExamples = lesson.examples && lesson.examples.length > 0;

  const getStepProgress = () => {
    if (currentStep === 'theory') return 33;
    if (currentStep === 'examples') return 66;
    return 100;
  };

  const getNextStepLabel = () => {
    if (currentStep === 'theory' && hasExamples) return 'Vedi esempi pratici';
    if (hasQuiz) return 'Inizia il quiz';
    return 'Completa lezione';
  };

  const handleNextStep = () => {
    if (currentStep === 'theory' && hasExamples) {
      setCurrentStep('examples');
    } else if (currentStep === 'examples' || !hasExamples) {
      if (hasQuiz) {
        setCurrentStep('ready');
        onStartQuiz();
      } else {
        // No quiz, complete the lesson
        onCompleteLesson();
      }
    } else {
      onStartQuiz();
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="w-full bg-slate-800/40 rounded-full h-2">
        <div 
          className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${getStepProgress()}%` }}
        ></div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <Badge variant={currentStep === 'theory' ? 'default' : 'secondary'} className="px-3 py-1">
          1. Teoria
        </Badge>
        {hasExamples && (
          <Badge variant={currentStep === 'examples' ? 'default' : 'secondary'} className="px-3 py-1">
            2. Esempi
          </Badge>
        )}
        {hasQuiz && (
          <Badge variant={currentStep === 'ready' ? 'default' : 'secondary'} className="px-3 py-1">
            {hasExamples ? '3.' : '2.'} Quiz
          </Badge>
        )}
      </div>

      {/* Theory Section */}
      {currentStep === 'theory' && (
        <div className="space-y-6">
          {hasContent && (
            <Card className="step-card glassmorphism-base">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  Contenuto della Lezione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {lesson.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {hasSlides && (
            <Card className="step-card glassmorphism-base">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Punti Chiave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {lesson.slides.map((slide: string, index: number) => (
                    <li key={index} className="flex items-start space-x-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-slate-300 text-base leading-relaxed">{slide}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Examples Section */}
      {currentStep === 'examples' && hasExamples && (
        <Card className="step-card glassmorphism-base">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-green-400" />
              Esempi Pratici
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lesson.examples.map((example: string, index: number) => (
                <div key={index} className="p-5 bg-gradient-to-r from-slate-800/40 to-slate-700/20 rounded-lg border border-slate-600/40">
                  <div className="flex items-start space-x-3">
                    <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-900/10">
                      Esempio {index + 1}
                    </Badge>
                  </div>
                  <p className="text-slate-300 mt-3 leading-relaxed">{example}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready for Quiz */}
      {currentStep === 'ready' && (
        <Card className="step-card glassmorphism-base border border-blue-400/30">
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Sei pronto per il quiz!</h3>
              <p className="text-slate-300">
                Hai completato la parte teorica. Ora metti alla prova le tue conoscenze.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {currentStep !== 'ready' && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleNextStep}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8"
          >
            {getNextStepLabel()}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonContentSection;