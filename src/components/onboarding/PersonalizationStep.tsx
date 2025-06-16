import React, { useState, useEffect, useMemo } from 'react';
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

  // Memoized workflow details to prevent recalculation
  const getWorkflowDetails = useMemo(() => (workflow: string) => {
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
  }, []);

  useEffect(() => {
    if (isActive && userData.assessmentAnswers) {
      // Use Web Worker for heavy AI processing to prevent main thread blocking
      const worker = new Worker(new URL('../../workers/assessmentWorker.ts', import.meta.url), {
        type: 'module'
      });

      worker.postMessage({ answers: userData.assessmentAnswers });
      
      worker.onmessage = (e) => {
        const analysis = e.data;
        setAssignedWorkflow(analysis.workflow);
        setLearningProfile(analysis.profile);
        setProcessing(false);
        setShowResults(true);
        worker.terminate();
      };

      // Fallback timeout
      const fallbackTimer = setTimeout(() => {
        setAssignedWorkflow('learn-by-doing');
        setLearningProfile({ dominantStyle: 'learn-by-doing', adaptability: 'moderate' });
        setProcessing(false);
        setShowResults(true);
        worker.terminate();
      }, 3000);

      return () => {
        clearTimeout(fallbackTimer);
        worker.terminate();
      };
    }
  }, [isActive, userData]);

  const handleComplete = () => {
    onComplete({ 
      completed: true,
      assignedWorkflow,
      learningProfile
    });
  };

  if (processing) {
    return (
      <div className="max-w-4xl mx-auto text-center pt-20 lg:pt-32">
        <GlassmorphismCard 
          className={`transform transition-all duration-500 ${
            isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="large"
          elevated={isActive}
        >
          {/* Optimized AI Processing Animation - Single pulse instead of multiple */}
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
              <p>🧠 Elaborazione stili di apprendimento</p>
              <p>⚡ Calibrazione workflow AI</p>
              <p>🎯 Personalizzazione percorso ottimale</p>
            </div>
          </div>

          {/* Simplified Neural Network Visualization - Reduced complexity */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="h-3 bg-gradient-to-r from-blue-500/40 to-amber-500/40 rounded-full"
                style={{ 
                  animation: `pulse 2s ease-in-out infinite`,
                  animationDelay: `${i * 300}ms` 
                }}
              />
            ))}
          </div>
        </GlassmorphismCard>
      </div>
    );
  }

  const workflowDetails = getWorkflowDetails(assignedWorkflow);

  return (
    <div className="max-w-5xl mx-auto pt-20 lg:pt-32">
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
        className={`mb-12 transform transition-all duration-500 ${
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
        className={`mb-12 transform transition-all duration-500 delay-150 ${
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
        className={`mb-12 transform transition-all duration-500 delay-300 ${
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
