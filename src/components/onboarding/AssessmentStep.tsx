
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
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      question: "Qual è la tua priorità principale nell'apprendimento AI?",
      options: [
        { id: 'efficiency', label: 'Aumentare efficienza operativa', value: 'efficiency' },
        { id: 'innovation', label: 'Guidare innovazione aziendale', value: 'innovation' },
        { id: 'automation', label: 'Automatizzare processi ripetitivi', value: 'automation' },
        { id: 'analysis', label: 'Migliorare analisi dati', value: 'analysis' }
      ]
    },
    {
      question: "Come preferisci apprendere nuove competenze professionali?",
      options: [
        { id: 'hands-on', label: 'Progetti pratici e case study', value: 'hands-on' },
        { id: 'theory', label: 'Approfondimenti teorici', value: 'theory' },
        { id: 'collaboration', label: 'Sessioni collaborative', value: 'collaboration' },
        { id: 'self-paced', label: 'Apprendimento autonomo', value: 'self-paced' }
      ]
    },
    {
      question: "Quanto tempo puoi dedicare all'apprendimento quotidiano?",
      options: [
        { id: '5min', label: '5 minuti - Quick insights', value: '5min' },
        { id: '15min', label: '15 minuti - Sessione completa', value: '15min' },
        { id: '30min', label: '30 minuti - Approfondimento', value: '30min' },
        { id: '60min', label: '1 ora - Studio intensivo', value: '60min' }
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        onComplete({ preferences: newAnswers });
      }, 500);
    }
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Assessment personalizzato
        </h2>
        <p className="text-xl text-white/70">
          3 domande per calibrare la tua esperienza AI
        </p>
        
        {/* Progress Bar */}
        <div className="mt-8 w-full max-w-md mx-auto">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">
            Domanda {currentQuestion + 1} di {questions.length}
          </p>
        </div>
      </div>

      {/* Question Card */}
      <GlassmorphismCard 
        className={`mb-12 transform transition-all duration-1000 ${
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="large"
        elevated={isActive}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl lg:text-3xl font-semibold text-white leading-relaxed">
            {questions[currentQuestion]?.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.value)}
              className={`p-6 rounded-xl border backdrop-blur-sm text-left transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group ${
                answers[currentQuestion] === option.value
                  ? 'bg-blue-500/20 border-blue-400/50 shadow-xl translate-z-10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: isActive ? 1 : 0.7
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-3 h-3 rounded-full mt-2 transition-all duration-300 ${
                  answers[currentQuestion] === option.value
                    ? 'bg-blue-400'
                    : 'bg-white/20 group-hover:bg-white/40'
                }`} />
                <div>
                  <div className="text-white font-medium text-lg mb-1">
                    {option.label}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Navigation Info */}
      <div className="text-center">
        <p className="text-white/50 text-sm">
          Seleziona una risposta per continuare
        </p>
      </div>
    </div>
  );
};

export default AssessmentStep;
