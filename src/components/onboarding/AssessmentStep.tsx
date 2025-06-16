
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '../GlassmorphismCard';

interface AssessmentStepProps {
  onComplete: (data: any) => void;
  isActive: boolean;
  userData: any;
}

const AssessmentStep: React.FC<AssessmentStepProps> = ({ onComplete, isActive, userData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 0,
      title: "Approccio Nuovo Apprendimento",
      question: "Quando impari qualcosa di nuovo, preferisci:",
      options: [
        { id: 'practical', label: 'Vedere esempi pratici', style: 'learn-by-doing' },
        { id: 'documentation', label: 'Leggere documentazione dettagliata', style: 'microlearning' },
        { id: 'experiment', label: 'Sperimentare subito', style: 'problem-solution' }
      ]
    },
    {
      id: 1,
      title: "Memorizzazione Concetti",
      question: "Per memorizzare concetti complessi:",
      options: [
        { id: 'visual', label: 'Diagrammi e grafici', style: 'visual' },
        { id: 'audio', label: 'Spiegazioni audio', style: 'auditory' },
        { id: 'hands-on', label: 'Pratica hands-on', style: 'kinesthetic' },
        { id: 'notes', label: 'Prendere note dettagliate', style: 'reading-writing' }
      ]
    },
    {
      id: 2,
      title: "Strategia Apprendimento",
      question: "Il tuo approccio ideale:",
      options: [
        { id: 'step-by-step', label: 'Step-by-step dettagliato', style: 'microlearning' },
        { id: 'overview', label: 'Panoramica generale prima', style: 'problem-solution' },
        { id: 'mixed', label: 'Mix dei due approcci', style: 'adaptive' }
      ]
    },
    {
      id: 3,
      title: "Gestione Feedback",
      question: "Quando ricevi feedback:",
      options: [
        { id: 'reflect', label: 'Ho bisogno di tempo per riflettere', style: 'reflective' },
        { id: 'immediate', label: 'Preferisco correggere immediatamente', style: 'active' }
      ]
    },
    {
      id: 4,
      title: "Ambiente Ideale",
      question: "Il tuo ambiente di apprendimento ideale:",
      options: [
        { id: 'quiet', label: 'Silenzioso e concentrato', style: 'individual' },
        { id: 'background', label: 'Con background audio', style: 'auditory' },
        { id: 'collaborative', label: 'Collaborativo con colleghi', style: 'social' }
      ]
    },
    {
      id: 5,
      title: "Ritmo Preferito",
      question: "Il tuo ritmo di apprendimento preferito:",
      options: [
        { id: 'regular', label: 'Costante e regolare', style: 'sequential' },
        { id: 'intensive', label: 'Intensivo a blocchi concentrati', style: 'global' },
        { id: 'flexible', label: 'Flessibile in base al tempo', style: 'adaptive' }
      ]
    },
    {
      id: 6,
      title: "Motivazione Principale",
      question: "La tua motivazione principale per l'AI:",
      options: [
        { id: 'career', label: 'Avanzamento di carriera', style: 'professional' },
        { id: 'curiosity', label: 'Curiosità personale', style: 'intrinsic' },
        { id: 'business', label: 'Obiettivi aziendali', style: 'extrinsic' },
        { id: 'competition', label: 'Competizione con colleghi', style: 'competitive' }
      ]
    },
    {
      id: 7,
      title: "Tempo Disponibile",
      question: "Tempo realisticamente disponibile ogni giorno:",
      options: [
        { id: 'micro', label: '5-10 minuti', style: 'micro-learning' },
        { id: 'standard', label: '15-20 minuti', style: 'standard' },
        { id: 'deep', label: '30+ minuti', style: 'deep-learning' }
      ]
    }
  ];

  const handleAnswer = (questionId: number, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);
    
    // Reduced delay for better performance
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        // Optimized scroll to next question
        const nextQuestionElement = document.getElementById(`question-${currentQuestion + 1}`);
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 400);
  };

  const handleComplete = () => {
    // Pass answers to next step for AI analysis
    onComplete({ assessmentAnswers: answers });
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Questionario Stili di Apprendimento
        </h2>
        <p className="text-xl text-white/70">
          Claude analizzerà le tue preferenze per creare il workflow ottimale
        </p>
      </div>

      {/* Progress Indicator */}
      <GlassmorphismCard className="mb-8" size="small">
        <div className="flex items-center justify-between text-white/80 mb-2">
          <span>Domanda {currentQuestion + 1} di {questions.length}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </GlassmorphismCard>

      {/* Questions Vertical Stack - Performance optimized */}
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div 
            key={question.id}
            id={`question-${index}`}
            className={`transform transition-all duration-500 ${
              index <= currentQuestion && isActive 
                ? 'translate-y-0 opacity-100' 
                : index > currentQuestion 
                  ? 'translate-y-10 opacity-50' 
                  : 'opacity-70'
            }`}
          >
            <GlassmorphismCard 
              className={`question-card ${index === currentQuestion ? 'question-active' : ''}`}
              size="large"
              elevated={index === currentQuestion}
            >
              <div className="mb-6">
                <div className="text-sm uppercase tracking-wide text-blue-400/80 mb-2">
                  {question.title}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-6">
                  {question.question}
                </h3>
              </div>

              <div className="grid gap-4">
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(question.id, option.id)}
                      disabled={index > currentQuestion}
                      className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 text-left ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400/50 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-blue-500/10 hover:border-blue-400/30'
                      } ${index > currentQuestion ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-amber-400 border-amber-400' 
                            : 'border-white/30'
                        }`} />
                        <div className="text-white font-medium">{option.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassmorphismCard>
          </div>
        ))}
      </div>

      {/* Complete Button */}
      {Object.keys(answers).length === questions.length && (
        <div className="text-center mt-12">
          <GlassmorphismCard className="inline-block">
            <Button 
              onClick={handleComplete}
              size="lg"
              className="text-xl px-12 py-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 shadow-xl transition-colors duration-200"
            >
              Analizza con AI →
            </Button>
          </GlassmorphismCard>
        </div>
      )}
    </div>
  );
};

export default AssessmentStep;
