
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

  useEffect(() => {
    if (isActive) {
      // Simulate AI processing
      const timer1 = setTimeout(() => {
        setProcessing(false);
        setShowResults(true);
      }, 3000);

      return () => clearTimeout(timer1);
    }
  }, [isActive]);

  const handleComplete = () => {
    onComplete({ completed: true });
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
              Claude analizza le tue preferenze professionali...
            </h2>
            
            <div className="space-y-2 text-white/70">
              <p className="animate-pulse">🧠 Elaborazione profilo professionale</p>
              <p className="animate-pulse delay-500">⚡ Calibrazione algoritmi AI</p>
              <p className="animate-pulse delay-1000">🎯 Personalizzazione percorso formativo</p>
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Results Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Il tuo profilo AI è pronto! 🎉
        </h2>
        <p className="text-xl text-white/70">
          Esperienza personalizzata per {userData.role} nel settore {userData.industry}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Learning Path */}
        <GlassmorphismCard 
          className={`transform transition-all duration-1000 ${
            showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="medium"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Percorso Ottimizzato</h3>
            <p className="text-white/70">
              15 moduli AI calibrati sul tuo livello {userData.experience} anni
            </p>
          </div>
        </GlassmorphismCard>

        {/* Daily Schedule */}
        <GlassmorphismCard 
          className={`transform transition-all duration-1000 delay-200 ${
            showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="medium"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/40 to-green-600/40 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Schedule Intelligente</h3>
            <p className="text-white/70">
              Sessioni da 15 min calibrate sui tuoi ritmi professionali
            </p>
          </div>
        </GlassmorphismCard>

        {/* Analytics */}
        <GlassmorphismCard 
          className={`transform transition-all duration-1000 delay-400 ${
            showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
          }`}
          size="medium"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500/40 to-amber-600/40 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analytics Aziendali</h3>
            <p className="text-white/70">
              Dashboard ROI e metriche performance team
            </p>
          </div>
        </GlassmorphismCard>
      </div>

      {/* Profile Summary */}
      <GlassmorphismCard 
        className={`mb-12 transform transition-all duration-1000 delay-600 ${
          showResults ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="large"
        elevated={showResults}
      >
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-6">Il tuo profilo professionale</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80">
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
