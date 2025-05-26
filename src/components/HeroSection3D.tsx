
import React from 'react';
import GlassmorphismCard from './GlassmorphismCard';

const HeroSection3D = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background Depth Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Welcome Text */}
        <div className="mb-12">
          <h1 
            className="text-7xl md:text-8xl font-bold mb-6 text-white"
            style={{
              textShadow: '0 10px 40px rgba(0,0,0,0.5)',
              transform: 'translateZ(30px)'
            }}
          >
            Ciao <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Luca</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed">
            Benvenuto nel tuo ambiente di apprendimento professionale
          </p>
        </div>

        {/* Floating XP Counter */}
        <div className="flex justify-center mb-16">
          <GlassmorphismCard className="transform hover:scale-105 transition-all duration-300" elevated>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">XP</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">1,650</div>
                <div className="text-sm text-white/70">Punti Esperienza</div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Ambient Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/60 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-10 w-6 h-6 bg-amber-400/40 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-5 w-2 h-2 bg-white/50 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default HeroSection3D;
