
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '../GlassmorphismCard';

interface PersonalizationStepProps {
  onComplete: (data: any) => void;
  isActive: boolean;
  userData: any;
}

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({ onComplete, isActive, userData }) => {
  const [processing, setProcessing] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [assignedWorkflow, setAssignedWorkflow] = useState('');
  const [learningProfile, setLearningProfile] = useState<any>({});

  // AI Logic for Workflow Assignment
  const analyzeAnswers = (answers: Record<number, string>) => {
    const scores = {
      'learn-by-doing': 0,
      'microlearning': 0,
      'problem-solution': 0
    };

    // Analyze each answer and assign scores
    Object.entries(answers).forEach(([questionIndex, answerId]) => {
      const qIndex = parseInt(questionIndex);
      
      switch (qIndex) {
        case 0: // Approach to new learning
          if (answerId === 'practical') scores['learn-by-doing'] += 3;
          if (answerId === 'documentation') scores['microlearning'] += 3;
          if (answerId === 'experiment') scores['problem-solution'] += 3;
          break;
        case 1: // Memory concepts
          if (answerId === 'hands-on') scores['learn-by-doing'] += 2;
          if (answerId === 'visual' || answerId === 'notes') scores['microlearning'] += 2;
          if (answerId === 'audio') scores['problem-solution'] += 1;
          break;
        case 2: // Learning strategy
          if (answerId === 'step-by-step') scores['microlearning'] += 3;
          if (answerId === 'overview') scores['problem-solution'] += 3;
          if (answerId === 'mixed') {
            scores['learn-by-doing'] += 1;
            scores['microlearning'] += 1;
            scores['problem-solution'] += 1;
          }
          break;
        case 3: // Feedback management
          if (answerId === 'reflect') scores['microlearning'] += 2;
          if (answerId === 'immediate') scores['learn-by-doing'] += 2;
          break;
        case 4: // Environment
          if (answerId === 'quiet') scores['microlearning'] += 2;
          if (answerId === 'collaborative') scores['problem-solution'] += 2;
          if (answerId === 'background') scores['learn-by-doing'] += 1;
          break;
        case 5: // Pace
          if (answerId === 'regular') scores['microlearning'] += 2;
          if (answerId === 'intensive') scores['problem-solution'] += 2;
          if (answerId === 'flexible') scores['learn-by-doing'] += 2;
          break;
        case 6: // Motivation
          if (answerId === 'competition') scores['problem-solution'] += 2;
          if (answerId === 'curiosity') scores['learn-by-doing'] += 2;
          if (answerId === 'career' || answerId === 'business') scores['microlearning'] += 1;
          break;
        case 7: // Time available
          if (answerId === 'micro') scores['microlearning'] += 3;
          if (answerId === 'standard') scores['learn-by-doing'] += 2;
          if (answerId === 'deep') scores['problem-solution'] += 2;
          break;
      }
    });

    // Determine winning workflow
    const maxScore = Math.max(...Object.values(scores));
    const winningWorkflow = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);
    
    return {
      workflow: winningWorkflow,
      scores,
      profile: {
        dominantStyle: winningWorkflow,
        adaptability: scores['learn-by-doing'] > 0 && scores['microlearning'] > 0 && scores['problem-solution'] > 0 ? 'high' : 'moderate'
      }
    };
  };

  useEffect(() => {
    if (isActive && userData.assessmentAnswers) {
      // Simulate AI processing
      const timer1 = setTimeout(() => {
        const analysis = analyzeAnswers(userData.assessmentAnswers);
        setAssignedWorkflow(analysis.workflow || 'learn-by-doing');
        setLearningProfile(analysis.profile);
        setProcessing(false);
        setShowResults(true);
      }, 3000);

      return () => clearTimeout(timer1);
    }
  }, [isActive, userData]);

  const getWorkflowDetails = (workflow: string) => {
    const details = {
      'learn-by-doing': {
        title: 'Learn-by-Doing',
        description: 'Apprendimento pratico con progetti reali',
        icon: '🛠️',
        color: 'from-green-500/40 to-green-600/40',
        features: ['Progetti hands-on', 'Feedback immediato', 'Sperimentazione diretta']
      },
      'microlearning': {
        title: 'Microlearning Spirale',
        description: 'Apprendimento graduale e strutturato',
        icon: '📚',
        color: 'from-blue-500/40 to-blue-600/40',
        features: ['Sessioni brevi', 'Progressione strutturata', 'Consolidamento continuo']
      },
      'problem-solution': {
        title: 'Problem-Solution-Practice',
        description: 'Risoluzione di problemi business reali',
        icon: '🎯',
        color: 'from-amber-500/40 to-amber-600/40',
        features: ['Scenari business', 'Soluzioni competitive', 'Risultati misurabili']
      }
    };
    return details[workflow as keyof typeof details] || details['learn-by-doing'];
  };

  const handleComplete = () => {
    onComplete({ 
      completed: true,
      assignedWorkflow,
      learningProfile
    });
  };

  if (processing) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <GlassmorphismCard 
          className={`transform transition-all duration-1000 ${
            isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="large"
          elevated={isActive}
        >
          {/* AI Processing Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500/40 to-amber-500/40 backdrop-blur-sm flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-400/80 rounded animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              LearningBites AI analizza le tue preferenze professionali...
            </h2>
            
            <div className="space-y-2 text-white/70">
              <p className="animate-pulse">🧠 Elaborazione stili di apprendimento</p>
              <p className="animate-pulse delay-500">⚡ Calibrazione workflow AI</p>
              <p className="animate-pulse delay-1000">🎯 Personalizzazione percorso ottimale</p>
            </div>
          </div>

          {/* Neural Network Visualization */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i}
                className="h-3 bg-gradient-to-r from-blue-500/40 to-amber-500/40 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </GlassmorphismCard>
      </div>
    );
  }

  const workflowDetails = getWorkflowDetails(assignedWorkflow);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Results Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Il tuo workflow AI è pronto! 🎉
        </h2>
        <p className="text-xl text-white/70">
          Personalizzato per {userData.role} nel settore {userData.industry}
        </p>
      </div>

      {/* Assigned Workflow */}
      <GlassmorphismCard 
        className={`mb-12 transform transition-all duration-1000 ${
          showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="large"
        elevated={showResults}
      >
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${workflowDetails.color} rounded-2xl backdrop-blur-sm flex items-center justify-center`}>
            <span className="text-4xl">{workflowDetails.icon}</span>
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-4">{workflowDetails.title}</h3>
          <p className="text-xl text-white/80 mb-6">{workflowDetails.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowDetails.features.map((feature, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-white/90">{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassmorphismCard>

      {/* AI Logic Reveal */}
      <GlassmorphismCard 
        className={`mb-12 transform transition-all duration-1000 delay-300 ${
          showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="medium"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">Come LearningBites AI ha scelto il tuo workflow</h3>
        <div className="space-y-4 text-white/80">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Analizzate 8 dimensioni dell'apprendimento professionale</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Calibrato su {userData.experience} anni di esperienza</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Ottimizzato per contesto {userData.industry}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Adattabilità: {learningProfile.adaptability === 'high' ? 'Alta' : 'Moderata'}</span>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Profile Summary */}
      <GlassmorphismCard 
        className={`mb-12 transform transition-all duration-1000 delay-600 ${
          showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="large"
      >
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-6">Il tuo profilo professionale completo</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white/80">
            <div>
              <div className="text-sm uppercase tracking-wide text-white/50 mb-2">Ruolo</div>
              <div className="text-lg font-medium capitalize">{userData.role}</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-white/50 mb-2">Settore</div>
              <div className="text-lg font-medium capitalize">{userData.industry}</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-white/50 mb-2">Esperienza</div>
              <div className="text-lg font-medium">{userData.experience} anni</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-white/50 mb-2">Workflow</div>
              <div className="text-lg font-medium">{workflowDetails.title}</div>
            </div>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Complete Button */}
      <div className="text-center">
        <Button 
          onClick={handleComplete}
          size="lg"
          className="text-xl px-12 py-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Entra nella Dashboard →
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationStep;
