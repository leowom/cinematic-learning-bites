import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const PromptingCourse = () => {
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['modulo-2']);

  const allModules = [
    {
      id: 'introduzione',
      title: 'Introduzione',
      description: 'Introduzione all\'AI',
      duration: '13:54',
      completed: true,
      route: '/introduzione',
      lessons: [
        {
          id: 0,
          title: "Introduzione all'AI",
          duration: "13:54",
          completed: true,
          current: false,
          description: "Scopri i fondamenti dell'intelligenza artificiale e come può trasformare il tuo business"
        }
      ]
    },
    {
      id: 'modulo-1',
      title: 'Modulo 1 - LLM Fundamentals',
      description: 'Fondamenti dei Large Language Models',
      duration: '8:12',
      completed: true,
      route: '/llm-fundamentals',
      lessons: [
        {
          id: 0,
          title: "Dentro un LLM: cosa fa e come parlarci in modo efficace",
          duration: "8:12",
          completed: true,
          current: false,
          description: "Esplora il funzionamento interno dei Large Language Models e impara le tecniche più efficaci per comunicare con l'AI"
        }
      ]
    },
    {
      id: 'modulo-1-2',
      title: 'Modulo 1.2 - Tutorial Interattivo',
      description: 'Esercizio guidato pratico',
      duration: '15:00',
      completed: true,
      route: '/ai-tutorial-interactive',
      lessons: [
        {
          id: 0,
          title: "Esercizio Guidato Pratico",
          duration: "15:00", 
          completed: true,
          current: false,
          description: "Metti in pratica le conoscenze acquisite attraverso un esercizio guidato interattivo"
        }
      ]
    },
    {
      id: 'modulo-2',
      title: 'Modulo 2 - Prompting',
      description: 'Tecniche avanzate di prompting',
      duration: '55:36',
      completed: false,
      route: '/prompting',
      lessons: [
        {
          id: 0,
          title: "Prompting Avanzato e Strategie di Comunicazione con l'AI",
          duration: "25:36",
          completed: false,
          current: true,
          description: "Scopri le tecniche avanzate di prompting per massimizzare l'efficacia della comunicazione con l'intelligenza artificiale"
        },
        {
          id: 1,
          title: "Il potere del contesto nel prompt",
          duration: "10:00",
          completed: false,
          current: false,
          description: "Esercizio pratico per comprendere l'importanza del contesto nei prompt"
        },
        {
          id: 2,
          title: "Controllare il formato dell'output",
          duration: "10:00",
          completed: false,
          current: false,
          description: "Scopri come ottenere output strutturati e utilizzabili specificando il formato desiderato"
        },
        {
          id: 3,
          title: "Dare un ruolo all'AI nel prompt",
          duration: "10:00",
          completed: false,
          current: false,
          description: "Impara come assegnare ruoli specifici per ottenere risposte più esperte e specializzate"
        }
      ]
    }
  ];

  const lessons = allModules.find(m => m.id === 'modulo-2')?.lessons || [];
  const currentLessonData = lessons[currentLesson];
  
  const totalLessons = allModules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = allModules.reduce((acc, module) => 
    acc + module.lessons.filter(l => l.completed).length, 0);
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const navigateToModule = (route: string) => {
    navigate(route);
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
                Modulo 2 - Prompting
              </div>
              <div className="text-slate-400 text-sm">
                Passo 1 di 4
              </div>
            </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: {Math.round(progressPercentage)}%
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Collapsible Sidebar - Course Navigation */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0`}>
            <div className="step-card glassmorphism-base sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-hidden">
              <div className="section-spacing h-full flex flex-col">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  {!sidebarCollapsed && (
                    <h3 className="text-lg font-semibold text-white flex items-center truncate">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                      Corso Completo
                    </h3>
                  )}
                  <Button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 p-2 flex-shrink-0"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                </div>

                {!sidebarCollapsed && (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Overall Progress */}
                    <div className="mb-4 p-4 bg-slate-800/40 rounded-lg border border-slate-700/30 flex-shrink-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-300 text-sm font-medium">Progresso Totale</span>
                        <span className="text-emerald-400 text-sm font-bold">{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/60 rounded-full h-2 mb-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 text-center">
                        {completedLessons} di {totalLessons} lezioni completate
                      </div>
                    </div>

                    {/* Modules List - Scrollable */}
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
                      {allModules.map((module) => (
                        <div key={module.id} className="border border-slate-700/40 rounded-lg overflow-hidden bg-slate-800/20">
                          {/* Module Header */}
                          <div
                            className={`p-4 cursor-pointer transition-all duration-200 ${
                              module.id === 'modulo-2' 
                                ? 'bg-blue-900/30 border-l-4 border-blue-400' 
                                : module.completed
                                ? 'bg-emerald-900/20 hover:bg-emerald-900/30 border-l-4 border-emerald-400'
                                : 'bg-slate-800/40 hover:bg-slate-700/50 border-l-4 border-slate-600'
                            }`}
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div className="flex-shrink-0 mt-0.5">
                                  {module.completed ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                  ) : module.id === 'modulo-2' ? (
                                    <Play className="w-5 h-5 text-blue-400" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-semibold text-sm leading-tight mb-1 ${
                                    module.id === 'modulo-2' ? 'text-white' : 'text-slate-200'
                                  }`}>
                                    {module.title}
                                  </h4>
                                  <p className="text-xs text-slate-400 leading-relaxed">
                                    {module.description}
                                  </p>
                                  <div className="flex items-center text-slate-500 text-xs mt-2">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {module.duration}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-2">
                                {expandedModules.includes(module.id) ? (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Module Lessons */}
                          {expandedModules.includes(module.id) && (
                            <div className="border-t border-slate-700/40 bg-slate-900/30">
                              {module.lessons.map((lesson, index) => (
                                <div
                                  key={lesson.id}
                                  className={`p-4 pl-16 cursor-pointer transition-all duration-200 border-l-4 ${
                                    lesson.current && module.id === 'modulo-2'
                                      ? 'bg-blue-800/20 border-blue-400'
                                      : lesson.completed
                                      ? 'bg-emerald-800/10 hover:bg-emerald-800/20 border-emerald-400/50'
                                      : 'hover:bg-slate-700/20 border-transparent'
                                  }`}
                                  onClick={() => {
                                    if (module.id === 'modulo-2') {
                                      if (index === 0) {
                                        setCurrentLesson(index);
                                      } else if (index === 1) {
                                        navigate('/contesto');
                                      } else if (index === 2) {
                                        navigate('/ai-interactive/format-control');
                                      } else if (index === 3) {
                                        navigate('/ai-interactive/role-instruction');
                                      }
                                    } else {
                                      navigateToModule(module.route);
                                    }
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-3">
                                      <h5 className={`text-sm font-medium leading-tight ${
                                        lesson.current && module.id === 'modulo-2' ? 'text-blue-300' : 'text-slate-300'
                                      }`}>
                                        {lesson.title}
                                      </h5>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-xs flex-shrink-0">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {lesson.duration}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collapsed State Content */}
                {sidebarCollapsed && (
                  <div className="flex flex-col items-center space-y-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 text-xs font-bold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="space-y-2">
                      {allModules.map((module) => (
                        <div
                          key={module.id}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            module.id === 'modulo-2' 
                              ? 'bg-blue-900/40 border border-blue-400/50' 
                              : module.completed
                              ? 'bg-emerald-900/40 border border-emerald-400/50'
                              : 'bg-slate-800/40 border border-slate-600/50 hover:bg-slate-700/50'
                          }`}
                          onClick={() => {
                            if (module.id === 'modulo-2') {
                              // Already on this module
                            } else {
                              navigateToModule(module.route);
                            }
                          }}
                          title={module.title}
                        >
                          {module.completed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : module.id === 'modulo-2' ? (
                            <Play className="w-4 h-4 text-blue-400" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-slate-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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