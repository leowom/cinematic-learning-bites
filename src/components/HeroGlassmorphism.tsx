
import React from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from './GlassmorphismCard';

const HeroGlassmorphism = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Depth Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl animate-float" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Dramatic Typography */}
        <h1 className="text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Trasforma il tuo team
          </span>
          <br />
          <span className="text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            con l'AI
          </span>
        </h1>

        {/* Subtitle with Glassmorphism */}
        <GlassmorphismCard className="inline-block mb-12 mx-auto" size="medium">
          <p className="text-2xl lg:text-3xl text-white/90 font-light">
            in soli <span className="font-semibold text-amber-400">15 minuti al giorno</span>
          </p>
        </GlassmorphismCard>

        {/* CTA Bentobox */}
        <GlassmorphismCard className="inline-block" size="large" elevated>
          <Button 
            size="lg" 
            className="text-xl px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Inizia la tua avventura AI
          </Button>
        </GlassmorphismCard>

        {/* Floating Abstract Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl animate-float" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-full blur-lg animate-pulse" />
      </div>
    </div>
  );
};

export default HeroGlassmorphism;
