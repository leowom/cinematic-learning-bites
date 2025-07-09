
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GlassmorphismCard from '@/components/GlassmorphismCard';
import { BookOpen, BarChart3, Zap, Award, LogIn } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  const handleExplorePromptLab = () => {
    navigate('/prompt-lab');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-6">
            Ciao <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Luca</span>
          </h1>
          
          <p className="text-2xl text-white/90 mb-4">
            Benvenuto nella tua piattaforma di apprendimento professionale
          </p>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Sviluppa le tue competenze digitali con corsi avanzati di Prompt Engineering, 
            Analytics e strumenti di apprendimento personalizzati
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassmorphismCard>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1,650</div>
                <div className="text-sm text-white/70">Punti Esperienza</div>
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-sm text-white/70">Corsi Completati</div>
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">92%</div>
                <div className="text-sm text-white/70">Tasso di Successo</div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            onClick={handleEnterDashboard}
            size="lg"
            className="text-xl px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            Dashboard Principale
          </Button>

          <Button 
            onClick={handleExplorePromptLab}
            size="lg"
            variant="outline"
            className="text-xl px-12 py-4 border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
          >
            Prompt Engineering Lab
          </Button>

          <Button 
            onClick={handleViewAnalytics}
            size="lg"
            variant="outline" 
            className="text-xl px-12 py-4 border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Analytics
          </Button>

          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            variant="outline" 
            className="text-xl px-12 py-4 border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Accedi
          </Button>
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <GlassmorphismCard className="text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Prompt Engineering Lab</h3>
            <p className="text-white/80 mb-4">
              Laboratorio interattivo per imparare a creare prompt efficaci con AI coaching in tempo reale
            </p>
            <div className="flex items-center text-blue-400 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Strumento avanzato con feedback AI
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="text-left">
            <h3 className="text-xl font-semibold text-white mb-3">Analytics Dashboard</h3>
            <p className="text-white/80 mb-4">
              Analisi dettagliate dei tuoi progressi e performance di apprendimento
            </p>
            <div className="flex items-center text-green-400 text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Metriche complete e insights
            </div>
          </GlassmorphismCard>
        </div>

        <p className="text-white/60 text-sm mt-8">
          Scegli la sezione che desideri esplorare per continuare il tuo percorso di apprendimento
        </p>
      </div>
    </div>
  );
};

export default Index;
