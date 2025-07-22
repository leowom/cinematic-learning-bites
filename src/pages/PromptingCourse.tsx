import React, { useState } from 'react';
import { Home, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CourseSidebar from '@/components/CourseSidebar';

const PromptingCourse = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentLessonData = {
    title: "Prompting Avanzato e Strategie di Comunicazione con l'AI",
    duration: "25:36",
    description: "Scopri le tecniche avanzate di prompting per massimizzare l'efficacia della comunicazione con l'intelligenza artificiale"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'}}>
      <div className="prompt-lab-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg">
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
              <div className="text-slate-200 font-medium text-sm">
                Modulo 2 - Prompting
              </div>
              <div className="text-slate-400 text-xs">
                Passo 1 di 5
              </div>
            </div>

          <div className="text-right">
            <div className="text-slate-300 text-xs">
              Modulo 2 - Prompting
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          <CourseSidebar 
            currentModuleId="modulo-2"
            currentLessonId="0"
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
                      AI Expert
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
                    src="https://www.youtube.com/embed/Oyp2m9bf10k?rel=0&modestbranding=1"
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
                    {currentLessonData.description}. In questo modulo approfondiremo 
                    le tecniche più avanzate di prompt engineering, esplorando come strutturare 
                    conversazioni efficaci con l'AI per ottenere risultati eccezionali.
                  </p>
                  
                  <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-4">
                    <h4 className="text-purple-300 font-medium mb-2">🎯 Tecniche Avanzate</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Strutturazione di prompt complessi per task articolati</li>
                      <li>• Tecniche di chain-of-thought e reasoning guidato</li>
                      <li>• Ottimizzazione del contesto e gestione della memoria</li>
                      <li>• Strategie per prompt iteration e refinement</li>
                      <li>• Best practices per diverse tipologie di output</li>
                    </ul>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => navigate('/ai-tutorial-interactive')}
                    variant="ghost"
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                  >
                    ← Modulo 1.2
                  </Button>
                  <Button
                    onClick={() => navigate('/contesto')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Modulo 2.1 →
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

export default PromptingCourse;