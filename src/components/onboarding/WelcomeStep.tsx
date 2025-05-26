
import React from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '../GlassmorphismCard';

interface WelcomeStepProps {
  onComplete: (data: any) => void;
  isActive: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onComplete, isActive }) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Professional Welcome Hero */}
      <GlassmorphismCard 
        className={`mb-12 transform transition-all duration-1000 ${
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        size="large"
        elevated={isActive}
      >
        <div className="text-center">
          {/* Business Illustration Placeholder */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-amber-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-lg backdrop-blur-md flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-400/60 rounded" />
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-amber-400/40 rounded-full animate-float" />
            <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-green-400/40 rounded-full animate-pulse" />
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Benvenuto nel futuro
            </span>
            <br />
            <span className="text-4xl lg:text-5xl bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              professionale
            </span>
          </h1>

          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Learning Bites personalizza la tua esperienza di apprendimento AI 
            <br />per trasformare il tuo team in soli 15 minuti al giorno
          </p>
        </div>
      </GlassmorphismCard>

      {/* Professional CTA */}
      <GlassmorphismCard 
        className={`inline-block transform transition-all duration-1000 delay-300 ${
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
        }`}
        elevated={isActive}
      >
        <Button 
          onClick={() => onComplete({})}
          size="lg"
          className="text-xl px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Inizia personalizzazione
        </Button>
      </GlassmorphismCard>

      {/* Ambient Description */}
      <div className={`mt-12 transform transition-all duration-1000 delay-500 ${
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-70'
      }`}>
        <p className="text-white/60 text-lg">
          ⚡ Setup personalizzato in 3 minuti • 🎯 AI adattiva • 📊 Analytics aziendali
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
