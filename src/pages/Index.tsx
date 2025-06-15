
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '@/components/GlassmorphismCard';

const Index = () => {
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Compact Welcome */}
        <h1 className="text-5xl font-bold text-white mb-4">
          Ciao <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Luca</span>
        </h1>
        
        <p className="text-xl text-white/80 mb-8">
          Benvenuto nel tuo ambiente di apprendimento professionale
        </p>

        {/* Compact XP Display */}
        <div className="flex justify-center mb-8">
          <GlassmorphismCard className="inline-block">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">XP</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1,650</div>
                <div className="text-sm text-white/70">Punti Esperienza</div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Single Click to Enter */}
        <Button 
          onClick={handleEnterDashboard}
          size="lg"
          className="text-xl px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
        >
          Entra nella Dashboard
        </Button>

        <p className="text-white/60 text-sm mt-6">
          Clicca per accedere ai tuoi corsi e progressi
        </p>
      </div>
    </div>
  );
};

export default Index;
