import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import CourseSidebar from '@/components/CourseSidebar';

const IntroduzioneCourse = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data for the current lesson display
  const currentLessonData = {
    title: "Introduzione all'AI",
    duration: "13:54",
    description: "Scopri i fondamenti dell'intelligenza artificiale e come può trasformare il tuo business"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'}}>
      <div className="prompt-lab-container">
        {/* Header - Same as Prompt Lab */}
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          <div className="text-center">
            <div className="text-slate-200 font-medium">
              Introduzione
            </div>
            <div className="text-slate-400 text-sm">
              Passo 1 di 1
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Modulo 1
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Course Navigation Sidebar */}
          <CourseSidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentModuleId="modulo-1"
          />

          {/* Main Content - Video Player */}
          <div className="flex-1 min-w-0">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {currentLessonData.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-slate-400 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Iman Gadzhi
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentLessonData.duration}
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Yq0QkCxoTHM?rel=0&modestbranding=1"
                    title={currentLessonData.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {/* Descrizione */}
                <div className="element-spacing">
                  <h3 className="text-lg font-semibold text-white mb-3">Descrizione della Lezione</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {currentLessonData.description}. In questo video fondamentale, 
                    esploreremo i concetti chiave che definiranno il tuo percorso verso il successo 
                    nell'ecosistema dell'intelligenza artificiale.
                  </p>
                  
                  <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">💡 Punti Chiave</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Comprensione dei fondamenti dell'AI applicata al business</li>
                      <li>• Identificazione delle opportunità di mercato emergenti</li>
                      <li>• Framework strategico per l'implementazione pratica</li>
                      <li>• Metodologie per la creazione di valore sostenibile</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="ghost"
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                  >
                    Torna alla Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate('/llm-fundamentals')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Modulo 1 →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroduzioneCourse;