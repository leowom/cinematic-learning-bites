
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '../GlassmorphismCard';

interface WelcomeStepProps {
  onComplete: (data: any) => void;
  isActive: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = memo(({ onComplete, isActive }) => {
  const handleComplete = () => {
    onComplete({});
  };

  return (
    <div className="text-center max-w-4xl mx-auto px-4 pt-16 lg:pt-24 xl:pt-32">
      {/* Simplified Welcome Hero */}
      <GlassmorphismCard 
        className={`mb-8 lg:mb-12 transform transition-all duration-500 ${
          isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'
        }`}
        size="large"
        elevated={isActive}
      >
        <div className="text-center">
          {/* Simplified Illustration */}
          <div className="mb-10 lg:mb-12 xl:mb-16 relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500/15 to-amber-500/15 border border-white/15 flex items-center justify-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-400/50 rounded" />
              </div>
            </div>
            {/* Simplified floating elements */}
            <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-4 h-4 lg:w-6 lg:h-6 bg-amber-400/30 rounded-full opacity-60" />
            <div className="absolute -bottom-1 -left-3 lg:-bottom-2 lg:-left-6 w-3 h-3 lg:w-4 lg:h-4 bg-green-400/30 rounded-full opacity-50" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Benvenuto nel futuro
            </span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              professionale
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-white/80 mb-6 lg:mb-8 leading-relaxed px-4">
            Learning Bites personalizza la tua esperienza di apprendimento AI 
            <br className="hidden sm:block" />per trasformare il tuo team in soli 15 minuti al giorno
          </p>
        </div>
      </GlassmorphismCard>

      {/* Simplified CTA */}
      <div className={`transform transition-all duration-500 delay-100 ${
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'
      }`}>
        <GlassmorphismCard 
          className="inline-block w-full max-w-sm mx-auto"
          size="small"
          elevated={isActive}
        >
          <Button 
            onClick={handleComplete}
            size="lg"
            className="w-full text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-xl transition-all duration-200 hover:scale-[1.01]"
          >
            Inizia personalizzazione
          </Button>
        </GlassmorphismCard>
      </div>

      {/* Simplified Description */}
      <div className={`mt-8 lg:mt-12 transform transition-all duration-500 delay-200 ${
        isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'
      }`}>
        <div className="hidden sm:block">
          <p className="text-white/60 text-base lg:text-lg px-4">
            <span className="inline-flex items-center gap-2">
              <span>⚡</span>
              <span>Setup personalizzato in 3 minuti</span>
            </span>
            <span className="mx-2">•</span>
            <span className="inline-flex items-center gap-2">
              <span>🎯</span>
              <span>AI adattiva</span>
            </span>
            <span className="mx-2">•</span>
            <span className="inline-flex items-center gap-2">
              <span>📊</span>
              <span>Analytics aziendali</span>
            </span>
          </p>
        </div>
        
        <div className="block sm:hidden">
          <div className="space-y-2 text-white/60 text-sm px-4">
            <div className="flex items-center justify-center gap-2">
              <span>⚡</span>
              <span>Setup personalizzato in 3 minuti</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>🎯</span>
              <span>AI adattiva</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span>Analytics aziendali</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

WelcomeStep.displayName = 'WelcomeStep';

export default WelcomeStep;
