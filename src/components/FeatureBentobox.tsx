
import React from 'react';
import { CircleCheck, Clock, User } from 'lucide-react';
import GlassmorphismCard from './GlassmorphismCard';

const FeatureBentobox = () => {
  return (
    <div className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Learning Bites <span className="text-blue-400">Features</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Tecnologia all'avanguardia per trasformare la formazione aziendale
          </p>
        </div>

        {/* Asymmetric Bentobox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">
          
          {/* Feature Card 1 - Large */}
          <div className="lg:col-span-2 lg:row-span-2">
            <GlassmorphismCard 
              className="h-full p-12 group cursor-pointer feature-bentobox"
              size="large"
              style={{
                background: 'linear-gradient(135deg, rgba(30,64,175,0.1), rgba(217,119,6,0.1))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-4xl font-bold text-white mb-6">
                    Personalizzazione AI
                  </h3>
                  
                  <p className="text-xl text-white/80 leading-relaxed mb-8">
                    Algoritmi avanzati di machine learning che si adattano al profilo e alle competenze di ogni dipendente, creando percorsi formativi unici e altamente efficaci.
                  </p>
                </div>
                
                <div className="flex items-center text-blue-400 font-semibold text-lg">
                  <span>Scopri di più</span>
                  <div className="ml-3 w-2 h-2 bg-blue-400 rounded-full group-hover:w-8 transition-all duration-300" />
                </div>
              </div>
            </GlassmorphismCard>
          </div>

          {/* Feature Card 2 - Medium */}
          <div className="lg:row-span-1">
            <GlassmorphismCard 
              className="h-full p-8 group cursor-pointer feature-bentobox"
              size="medium"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(15px)'
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    15 Min/Giorno
                  </h3>
                  
                  <p className="text-white/80 leading-relaxed">
                    Micro-learning ottimizzato per l'agenda dei manager. Massimo impatto formativo nel minimo tempo investito.
                  </p>
                </div>
              </div>
            </GlassmorphismCard>
          </div>

          {/* Feature Card 3 - Compact */}
          <div className="lg:row-span-1">
            <GlassmorphismCard 
              className="h-full p-8 group cursor-pointer feature-bentobox"
              size="medium"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(15px)'
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <CircleCheck className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Analytics Aziendali
                  </h3>
                  
                  <p className="text-white/80 leading-relaxed">
                    Dashboard executive con KPI formativi, ROI measurable e insights per decisioni strategiche data-driven.
                  </p>
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureBentobox;
