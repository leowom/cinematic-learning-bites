
import React from 'react';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from './GlassmorphismCard';

const CTAFloating = () => {
  return (
    <div className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Floating CTA Strip */}
        <GlassmorphismCard 
          className="text-center p-16 relative overflow-hidden"
          size="large"
          elevated
          style={{
            background: 'linear-gradient(135deg, rgba(30,64,175,0.15), rgba(217,119,6,0.15))',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Pronto per il <span className="text-blue-400">Futuro</span>?
            </h2>
            
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Unisciti alle aziende leader che stanno trasformando i loro team con Learning Bites. 
              Inizia oggi stesso il tuo percorso verso l'eccellenza formativa.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <GlassmorphismCard className="inline-block" size="medium" elevated>
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Richiedi Demo Aziendale
                </Button>
              </GlassmorphismCard>

              <GlassmorphismCard className="inline-block" size="medium">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="text-lg px-10 py-6 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Scopri Prezzi Enterprise
                </Button>
              </GlassmorphismCard>
            </div>

            {/* Professional Urgency */}
            <div className="mt-8 text-amber-400 font-medium text-lg">
              📈 ROI garantito entro 90 giorni • 🎯 Setup personalizzato incluso
            </div>
          </div>
        </GlassmorphismCard>

        {/* Trust Indicators */}
        <div className="flex justify-center gap-8 mt-16">
          <GlassmorphismCard className="px-6 py-3" size="small">
            <span className="text-white/70 text-sm">✓ Sicurezza Enterprise</span>
          </GlassmorphismCard>
          <GlassmorphismCard className="px-6 py-3" size="small">
            <span className="text-white/70 text-sm">✓ Supporto 24/7</span>
          </GlassmorphismCard>
          <GlassmorphismCard className="px-6 py-3" size="small">
            <span className="text-white/70 text-sm">✓ ROI Garantito</span>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
};

export default CTAFloating;
