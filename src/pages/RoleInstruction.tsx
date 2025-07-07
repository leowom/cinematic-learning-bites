import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb, ChevronDown, ChevronRight, Menu, UserCheck, Briefcase, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const RoleInstruction = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false]);
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
      duration: '65:36',
      completed: false,
      route: '/prompting',
      lessons: [
        {
          id: 0,
          title: "Prompting Avanzato e Strategie di Comunicazione con l'AI",
          duration: "25:36",
          completed: true,
          current: false,
          description: "Scopri le tecniche avanzate di prompting per massimizzare l'efficacia della comunicazione con l'intelligenza artificiale"
        },
        {
          id: 1,
          title: "Il potere del contesto nel prompt",
          duration: "10:00",
          completed: true,
          current: false,
          description: "Esercizio pratico per comprendere l'importanza del contesto nei prompt"
        },
        {
          id: 2,
          title: "Controllare il formato dell'output",
          duration: "10:00",
          completed: true,
          current: false,
          description: "Scopri come ottenere output strutturati e utilizzabili specificando il formato desiderato"
        },
        {
          id: 3,
          title: "Dare un ruolo all'AI nel prompt",
          duration: "10:00",
          completed: false,
          current: true,
          description: "Impara come assegnare ruoli specifici per ottenere risposte più esperte e specializzate"
        },
        {
          id: 4,
          title: "Chiedere modifiche all'output",
          duration: "10:00",
          completed: false,
          current: false,
          description: "Pratica l'interazione iterativa per affinare e migliorare le risposte dell'AI"
        }
      ]
    }
  ];

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

  const exercises = [
    {
      id: 0,
      title: "Copywriter Esperto",
      icon: Briefcase,
      subject: "Script pubblicitario per corso di inglese",
      promptWithoutRole: "Scrivi uno script pubblicitario per promuovere un corso online di inglese per adulti.",
      outputWithoutRole: "Vuoi migliorare il tuo inglese? Il nostro corso online è la soluzione! Scopri come imparare divertendoti, da casa, al tuo ritmo.",
      promptWithRole: "Sei un copywriter esperto in educazione online. Scrivi uno script pubblicitario per promuovere un corso di inglese per adulti, focalizzandoti sul superamento del blocco psicologico e sulla flessibilità del corso.",
      outputWithRole: "Quante volte hai pensato: 'Ormai è troppo tardi per imparare una lingua'?\nCon il nostro corso di inglese online, flessibile e su misura per adulti, imparare non è mai stato così semplice.\nSupera la paura di sbagliare e riprendi in mano la tua crescita personale.\n👉 Inizia oggi. Parla domani.",
      tooltip: "Assegnare un ruolo guida lo stile, il tono e il focus dell'output. È come parlare con un esperto, non con un generico assistente.",
      color: "blue"
    },
    {
      id: 1,
      title: "Avvocato Commerciale",
      icon: Scale,
      subject: "Clausola contrattuale per collaborazione",
      promptWithoutRole: "Scrivimi una clausola per un contratto di collaborazione tra due aziende.",
      outputWithoutRole: "Le parti si impegnano a collaborare in buona fede per il raggiungimento degli obiettivi concordati, secondo quanto definito nel presente accordo.",
      promptWithRole: "Sei un avvocato esperto in diritto commerciale. Scrivi una clausola contrattuale per regolamentare gli obblighi di due aziende che collaborano su un progetto condiviso, inclusa la gestione di responsabilità e proprietà intellettuale.",
      outputWithRole: "Le Parti concordano di cooperare nello sviluppo del Progetto [●], impegnandosi a condividere risorse, know-how e documentazione tecnica in modo riservato.\nCiascuna Parte resterà titolare dei Diritti di Proprietà Intellettuale preesistenti.\nLe eventuali nuove invenzioni sviluppate congiuntamente saranno oggetto di accordo separato.\nLa responsabilità per danni a terzi derivanti dall'esecuzione delle attività ricadrà esclusivamente sulla Parte esecutrice, salvo dolo o colpa grave dell'altra Parte.",
      tooltip: "Dare un ruolo tecnico (es. 'sei un avvocato esperto…') aiuta a generare testi con la terminologia e la struttura corretta per la nicchia.",
      color: "emerald"
    }
  ];

  const nextStep = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepCompleted = () => {
    const newCompleted = [...completedSteps];
    newCompleted[currentStep] = true;
    setCompletedSteps(newCompleted);
  };

  const isAllCompleted = completedSteps.every(step => step);
  const currentExercise = exercises[currentStep];

  if (showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
        background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
      }}>
        <div className="prompt-lab-container">
          {/* Header */}
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
                Modulo 2.3 – Dare un ruolo all'AI nel prompt
              </div>
              <div className="text-slate-400 text-sm">
                2 Esercizi Comparativi
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                Ruoli Esperti
              </div>
            </div>
          </div>

          {/* Tutorial Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <UserCheck className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    👤 Dare un ruolo all'AI nel prompt
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    Scopri come trasformare l'AI da assistente generico a esperto specializzato 
                    assegnando ruoli specifici nei tuoi prompt.
                  </p>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-indigo-300 font-semibold mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Ruoli che sperimenterai:
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <Briefcase className="w-4 h-4 mr-2 mt-0.5 text-blue-400" />
                      <div>
                        <strong>Copywriter Esperto</strong> - Per testi pubblicitari efficaci
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Scale className="w-4 h-4 mr-2 mt-0.5 text-emerald-400" />
                      <div>
                        <strong>Avvocato Commerciale</strong> - Per documentazione legale precisa
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-4 mb-8 text-left max-w-2xl mx-auto">
                  <p className="text-yellow-300 text-sm">
                    <strong>💡 Concetto chiave:</strong> È come scegliere l'esperto giusto con cui parlare. 
                    L'AI adatta linguaggio, tono e competenze specifiche al ruolo assegnato.
                  </p>
                </div>

                <Button
                  onClick={() => setShowTutorial(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3"
                >
                  Inizia gli Esercizi
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        {/* Header */}
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
              Modulo 2.3 – Dare un ruolo all'AI nel prompt
            </div>
            <div className="text-slate-400 text-sm">
              Esercizio {currentStep + 1} di {exercises.length}
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: {completedSteps.filter(Boolean).length}/{exercises.length}
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.filter(Boolean).length / exercises.length) * 100}%` }}
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
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                      {allModules.map((module) => (
                        <div key={module.id} className="border border-slate-700/40 rounded-lg overflow-hidden bg-slate-800/20">
                          {/* Module Header */}
                          <div
                            className={`p-4 cursor-pointer transition-all duration-200 ${
                              module.id === 'modulo-2' 
                                ? 'bg-indigo-900/30 border-l-4 border-indigo-400' 
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
                                    <Play className="w-5 h-5 text-indigo-400" />
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
                                      ? 'bg-indigo-800/20 border-indigo-400'
                                      : lesson.completed
                                      ? 'bg-emerald-800/10 hover:bg-emerald-800/20 border-emerald-400/50'
                                      : 'hover:bg-slate-700/20 border-transparent'
                                  }`}
                                  onClick={() => {
                                    if (module.id === 'modulo-2') {
                                      if (index === 0) {
                                        navigateToModule('/prompting');
                                      } else if (index === 1) {
                                        navigateToModule('/contesto');
                                      } else if (index === 2) {
                                        navigateToModule('/ai-interactive/format-control');
                                      } else if (index === 3) {
                                        // Current lesson - no navigation
                                      } else if (index === 4) {
                                        navigateToModule('/ai-interactive/edit-output');
                                      }
                                    } else if (module.id !== 'modulo-2') {
                                      navigateToModule(module.route);
                                    }
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-3">
                                      <h5 className={`text-sm font-medium leading-tight ${
                                        lesson.current && module.id === 'modulo-2' ? 'text-indigo-300' : 'text-slate-300'
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
                              ? 'bg-indigo-900/40 border border-indigo-400/50' 
                              : module.completed
                              ? 'bg-emerald-900/40 border border-emerald-400/50'
                              : 'bg-slate-800/40 border border-slate-600/50 hover:bg-slate-700/50'
                          }`}
                          onClick={() => {
                            if (module.id !== 'modulo-2') {
                              navigateToModule(module.route);
                            }
                          }}
                          title={module.title}
                        >
                          {module.completed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : module.id === 'modulo-2' ? (
                            <Play className="w-4 h-4 text-indigo-400" />
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                {!isAllCompleted ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                          <currentExercise.icon className={`w-6 h-6 mr-3 text-${currentExercise.color}-400`} />
                          {currentExercise.title}
                        </h2>
                        <Badge 
                          variant="outline" 
                          className="text-indigo-300 border-indigo-500/50"
                        >
                          {currentStep + 1}/{exercises.length}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm">Argomento: {currentExercise.subject}</p>
                    </div>

                    {/* Without Role */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">❌ Senza ruolo assegnato</h3>
                      
                      {/* Prompt Without Role */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 mr-2 text-blue-400" />
                          <span className="text-blue-300 font-medium">Input Utente</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-3 inline-block max-w-[90%]">
                          <p className="text-sm">{currentExercise.promptWithoutRole}</p>
                        </div>
                      </div>

                      {/* Output Without Role */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Bot className="w-5 h-5 mr-2 text-red-400" />
                          <span className="text-red-300 font-medium">Risposta AI Generica</span>
                        </div>
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3">
                          <p className="text-sm whitespace-pre-line">{currentExercise.outputWithoutRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* With Role */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">✅ Con ruolo specifico</h3>
                      
                      {/* Prompt With Role */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 mr-2 text-blue-400" />
                          <span className="text-blue-300 font-medium">Input con Ruolo Assegnato</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-3 inline-block max-w-[90%]">
                          <p className="text-sm">{currentExercise.promptWithRole}</p>
                        </div>
                      </div>

                      {/* Output With Role */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Bot className="w-5 h-5 mr-2 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Risposta AI Esperta</span>
                        </div>
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3">
                          <p className="text-sm whitespace-pre-line">{currentExercise.outputWithRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className={`bg-${currentExercise.color}-900/20 border border-${currentExercise.color}-700/40 rounded-lg p-4 mb-6`}>
                      <div className="flex items-center mb-2">
                        <Lightbulb className={`w-5 h-5 mr-2 text-${currentExercise.color}-400`} />
                        <span className={`text-${currentExercise.color}-300 font-medium`}>Perché il ruolo funziona?</span>
                      </div>
                      <p className="text-slate-300 text-sm">{currentExercise.tooltip}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        variant="ghost"
                        className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 disabled:opacity-50"
                      >
                        ← Precedente
                      </Button>
                      
                      <div className="flex space-x-4">
                        {!completedSteps[currentStep] && (
                          <Button
                            onClick={markStepCompleted}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Ho Capito!
                          </Button>
                        )}
                        
                        {completedSteps[currentStep] && currentStep < exercises.length - 1 && (
                          <Button
                            onClick={nextStep}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            Prossimo Esercizio →
                          </Button>
                        )}
                        
                        {completedSteps[currentStep] && currentStep === exercises.length - 1 && (
                          <Button
                            onClick={() => {
                              setCompletedSteps([true, true]);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Completa Modulo
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Final Summary */
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-4">
                      🎉 Modulo Completato!
                    </h2>
                    
                    <p className="text-slate-300 text-lg mb-6">
                      Assegnare un ruolo all'AI nel prompt è come scegliere l'esperto giusto con cui parlare.
                    </p>

                    <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
                      <h3 className="text-blue-300 font-semibold mb-4">🧠 È utile quando:</h3>
                      <ul className="text-slate-300 space-y-2">
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          Hai bisogno di tono, linguaggio e struttura professionale
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          Ti serve terminologia di settore
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          Vuoi un approccio coerente con il tuo lavoro (marketing, legale, HR, tech…)
                        </li>
                      </ul>
                      
                      <div className="bg-indigo-900/30 border border-indigo-700/30 rounded p-4 mt-4">
                        <p className="text-indigo-200 text-sm">
                          <strong>💡 Esempi di ruoli:</strong> "Sei un copywriter esperto...", "Agisci come un consulente marketing...", 
                          "Immagina di essere un avvocato specializzato in..."
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => navigate('/ai-interactive/format-control')}
                        variant="ghost"
                        className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                      >
                        ← Modulo 2.2
                      </Button>
                      <Button
                        onClick={() => navigate('/ai-interactive/edit-output')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Modulo 2.4 →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInstruction;