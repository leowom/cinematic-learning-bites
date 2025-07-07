import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb, ChevronDown, ChevronRight, Menu, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const ContestoExercise = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [userPrompts, setUserPrompts] = useState<string[]>(['', '']);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState<boolean[]>([false, false, false, false]);
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
      duration: '25:36',
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
          completed: false,
          current: false,
          description: "Scopri come ottenere output strutturati e utilizzabili specificando il formato desiderato"
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

  const steps = [
    {
      id: 0,
      title: "Prompt Scarno - Esempio",
      type: "demo",
      demoPrompt: "Scrivimi una mail di ringraziamento",
      demoResponse: "Gentile Cliente,\n\nGrazie per il tuo acquisto.\n\nCordiali saluti,\nIl Team",
      explanation: "Questo output è generico, impersonale e poco utile. Non ha personalizzazione né specificità.",
      color: "red"
    },
    {
      id: 1,
      title: "Prompt Arricchito - Esempio",
      type: "demo",
      demoPrompt: "Scrivimi una mail di ringraziamento per un cliente B2B che ha appena acquistato un pacchetto annuale di consulenza marketing. Voglio usare un tono professionale ma amichevole, includere i prossimi passi e mostrare entusiasmo per la partnership.",
      demoResponse: "Gentile [Nome Cliente],\n\nSono entusiasta di darle il benvenuto nella famiglia dei nostri partner strategici!\n\nGrazie per aver scelto il nostro pacchetto annuale di consulenza marketing. La sua fiducia nel nostro team rappresenta per noi un grande onore e siamo pronti a supportarla nel raggiungimento dei suoi obiettivi di crescita.\n\nNei prossimi giorni riceverà:\n• Una chiamata dal suo account manager dedicato per pianificare la strategia\n• L'accesso alla nostra piattaforma di reporting\n• Il calendario degli incontri mensili\n\nNon vediamo l'ora di iniziare questo percorso insieme e di contribuire al successo della sua azienda.\n\nCordiali saluti,\n[Il suo nome]\nSenior Marketing Consultant",
      explanation: "Questo output è specifico, personalizzato e actionable. Include dettagli rilevanti e prossimi passi chiari.",
      color: "emerald"
    },
    {
      id: 2,
      title: "La tua prova - Prompt Scarno",
      type: "practice",
      placeholder: "Scrivi un prompt scarno (es. 'Scrivimi un post LinkedIn')...",
      suggestedPrompt: "Scrivimi un post LinkedIn",
      simulatedResponse: "Ecco un post per LinkedIn:\n\n'Giornata produttiva in ufficio! #lavoro #produttività'\n\nSpero sia utile!"
    },
    {
      id: 3,
      title: "La tua prova - Prompt Arricchito",
      type: "practice",
      placeholder: "Ora arricchisci il tuo prompt con contesto, target, obiettivo...",
      suggestedPrompt: "Scrivimi un post LinkedIn per promuovere il mio nuovo corso di digital marketing rivolto a PMI. Voglio un tono professionale ma accessibile, includere una call-to-action e condividere un insight sul ROI del marketing digitale. Il post dovrebbe essere di circa 150 parole.",
      simulatedResponse: "🚀 Hai mai calcolato il ROI del tuo marketing digitale?\n\nDopo 8 anni di esperienza con oltre 200 PMI, ho scoperto che il 73% delle aziende non traccia correttamente i propri risultati online. Questo significa perdere opportunità di ottimizzazione e budget sprecato.\n\nNel mio nuovo corso 'Digital Marketing per PMI' condivido le strategie concrete che hanno portato i miei clienti a:\n✅ Aumentare le conversioni del 40% in media\n✅ Ridurre il costo per acquisizione del 25%\n✅ Costruire sistemi di misurazione affidabili\n\nSe gestisci una PMI e vuoi trasformare il marketing da costo a investimento, questo corso fa per te.\n\n💡 Messaggio diretto per info e early bird (sconto 30%)\n\n#DigitalMarketing #PMI #ROI #MarketingStrategy"
    }
  ];
  
  const handlePromptSubmit = async () => {
    if (currentPrompt.trim()) {
      const newPrompts = [...userPrompts];
      newPrompts[currentStep - 2] = currentPrompt;
      setUserPrompts(newPrompts);
      setIsLoading(true);
      
      const delay = Math.random() * 2000 + 2000;
      
      setTimeout(() => {
        const newCompleted = [...completedSteps];
        newCompleted[currentStep] = true;
        setCompletedSteps(newCompleted);
        
        const newShowResponse = [...showResponse];
        newShowResponse[currentStep] = true;
        setShowResponse(newShowResponse);
        
        setIsLoading(false);
        setCurrentPrompt('');
      }, delay);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentPrompt('');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentPrompt('');
    }
  };

  const isCompleted = completedSteps.every(step => step);
  const currentStepData = steps[currentStep];

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
                Modulo 2.1 – Il potere del contesto nel prompt
              </div>
              <div className="text-slate-400 text-sm">
                Esercizio Prima & Dopo
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                4 Step Guidati
              </div>
            </div>
          </div>

          {/* Tutorial Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Target className="w-10 h-10 text-purple-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    🎯 Il potere del contesto nel prompt
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    Scopri come trasformare prompt generici in istruzioni precise che generano 
                    output di qualità superiore. Sperimenterai la differenza tra "prima" e "dopo" 
                    l'aggiunta di contesto strategico.
                  </p>
                </div>

                <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-purple-300 font-semibold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Cosa sperimenterai:
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">❌</span>
                      Output generico da prompt scarno
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">✅</span>
                      Output specifico da prompt arricchito
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">🔄</span>
                      Confronto diretto "Prima vs Dopo"
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">🎯</span>
                      Pratica guidata con i tuoi prompt
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">🧠</span>
                      Comprensione del "perché" funziona
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => setShowTutorial(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3"
                >
                  Inizia l'Esercizio
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
              Modulo 2.1 – Il potere del contesto nel prompt
            </div>
            <div className="text-slate-400 text-sm">
              Step {currentStep + 1} di {steps.length}
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: {completedSteps.filter(Boolean).length}/{steps.length}
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.filter(Boolean).length / steps.length) * 100}%` }}
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
                                ? 'bg-purple-900/30 border-l-4 border-purple-400' 
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
                                    <Play className="w-5 h-5 text-purple-400" />
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
                                      ? 'bg-purple-800/20 border-purple-400'
                                      : lesson.completed
                                      ? 'bg-emerald-800/10 hover:bg-emerald-800/20 border-emerald-400/50'
                                      : 'hover:bg-slate-700/20 border-transparent'
                                  }`}
                                  onClick={() => {
                                    if (module.id === 'modulo-2' && index === 0) {
                                      navigateToModule('/prompting');
                                    } else if (module.id !== 'modulo-2') {
                                      navigateToModule(module.route);
                                    }
                                    // Current lesson (2.1) - no navigation needed
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-3">
                                      <h5 className={`text-sm font-medium leading-tight ${
                                        lesson.current && module.id === 'modulo-2' ? 'text-purple-300' : 'text-slate-300'
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
                              ? 'bg-purple-900/40 border border-purple-400/50' 
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
                            <Play className="w-4 h-4 text-purple-400" />
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
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      {currentStepData.title}
                    </h2>
                    <Badge 
                      variant="outline" 
                      className={`${
                        currentStepData.type === 'demo' 
                          ? 'text-purple-300 border-purple-500/50' 
                          : 'text-blue-300 border-blue-500/50'
                      }`}
                    >
                      {currentStep + 1}/{steps.length}
                    </Badge>
                  </div>
                </div>

                {/* Demo Steps */}
                {currentStepData.type === 'demo' && (
                  <div className="space-y-6">
                    {/* Prompt */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 mr-2 text-blue-400" />
                        <span className="text-blue-300 font-medium">Input Utente</span>
                      </div>
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-3 inline-block max-w-[80%]">
                        <p className="text-sm">{currentStepData.demoPrompt}</p>
                      </div>
                    </div>

                    {/* Response */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Bot className="w-5 h-5 mr-2 text-purple-400" />
                        <span className="text-purple-300 font-medium">Risposta AI</span>
                      </div>
                      <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3">
                        <p className="text-sm whitespace-pre-line">{currentStepData.demoResponse}</p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className={`${
                      currentStepData.color === 'red' 
                        ? 'bg-red-900/20 border-red-700/40' 
                        : 'bg-emerald-900/20 border-emerald-700/40'
                    } border rounded-lg p-4`}>
                      <div className="flex items-center mb-2">
                        {currentStepData.color === 'red' ? (
                          <span className="text-red-400 text-lg mr-2">❌</span>
                        ) : (
                          <span className="text-emerald-400 text-lg mr-2">✅</span>
                        )}
                        <span className={`${
                          currentStepData.color === 'red' ? 'text-red-300' : 'text-emerald-300'
                        } font-medium`}>
                          Analisi Output
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{currentStepData.explanation}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        variant="ghost"
                        className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 disabled:opacity-50"
                      >
                        ← Precedente
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Prossimo Step →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Practice Steps */}
                {currentStepData.type === 'practice' && (
                  <div className="space-y-6">
                    {/* Suggestion */}
                    {!completedSteps[currentStep] && (
                      <div className="bg-purple-900/20 border border-purple-700/40 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-purple-300 text-sm mb-2">💡 <strong>Prompt suggerito:</strong></p>
                            <p className="text-slate-300 text-sm italic">"{currentStepData.suggestedPrompt}"</p>
                          </div>
                          <Button 
                            onClick={() => setCurrentPrompt(currentStepData.suggestedPrompt)} 
                            variant="outline" 
                            size="sm" 
                            className="ml-4 bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
                          >
                            Usa questo
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Chat Area */}
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                      {userPrompts[currentStep - 2] ? (
                        <div className="space-y-4 animate-fade-in">
                          {/* User Message */}
                          <div className="flex justify-end">
                            <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                              <p className="text-sm">{userPrompts[currentStep - 2]}</p>
                            </div>
                          </div>

                          {/* Loading State */}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3 max-w-[80%]">
                                <div className="flex items-center mb-2">
                                  <Bot className="w-4 h-4 mr-2 text-purple-400" />
                                  <span className="text-purple-400 text-sm font-medium">AI Assistant</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                  </div>
                                  <span className="text-slate-400 text-xs">Sto scrivendo...</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* AI Response */}
                          {showResponse[currentStep] && !isLoading && (
                            <div className="flex justify-start animate-fade-in">
                              <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3 max-w-[80%]">
                                <div className="flex items-center mb-2">
                                  <Bot className="w-4 h-4 mr-2 text-purple-400" />
                                  <span className="text-purple-400 text-sm font-medium">AI Assistant</span>
                                </div>
                                <p className="text-sm leading-relaxed whitespace-pre-line">
                                  {currentStepData.simulatedResponse}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Scrivi il tuo prompt qui sotto per iniziare...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    {!completedSteps[currentStep] && (
                      <div className="space-y-4">
                        <Textarea
                          value={currentPrompt}
                          onChange={(e) => setCurrentPrompt(e.target.value)}
                          placeholder={currentStepData.placeholder}
                          className="min-h-[100px] bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 resize-none focus:border-purple-500/50 focus:ring-purple-500/20"
                        />
                        
                        <div className="flex justify-between items-center">
                          <Button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            variant="ghost"
                            className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 disabled:opacity-50"
                          >
                            ← Precedente
                          </Button>
                          <Button
                            onClick={handlePromptSubmit}
                            disabled={!currentPrompt.trim() || isLoading}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Invio...
                              </div>
                            ) : (
                              'Invia Prompt'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Completed State */}
                    {completedSteps[currentStep] && (
                      <div className="flex justify-between items-center">
                        <Button
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          variant="ghost"
                          className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 disabled:opacity-50"
                        >
                          ← Precedente
                        </Button>
                        {currentStep < steps.length - 1 ? (
                          <Button
                            onClick={nextStep}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Prossimo Step →
                          </Button>
                        ) : (
                          <div className="space-x-4">
                            <Button
                              onClick={() => navigate('/prompting')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Completa Esercizio
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Final Explanation for last step */}
                {currentStep === steps.length - 1 && completedSteps[currentStep] && (
                  <div className="mt-6 bg-blue-900/20 border border-blue-700/40 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white">Perché il contesto funziona?</h3>
                    </div>
                    <div className="space-y-4 text-slate-300">
                      <p className="leading-relaxed">
                        <strong className="text-blue-300">Disambiguazione:</strong> Il contesto elimina l'ambiguità, permettendo all'AI di comprendere esattamente cosa vuoi.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-blue-300">Grounding:</strong> Fornire dettagli specifici (pubblico, tono, obiettivo) "ancora" la risposta alla tua situazione reale.
                      </p>
                      <p className="leading-relaxed">
                        <strong className="text-blue-300">Architettura LLM:</strong> I Large Language Models sono addestrati per utilizzare il contesto per generare risposte più appropriate e utili.
                      </p>
                      <div className="bg-purple-900/30 border border-purple-700/30 rounded p-4 mt-4">
                        <p className="text-purple-200 text-sm">
                          <strong>Regola d'oro:</strong> Più contesto specifico fornisci, più l'output sarà preciso e actionable per le tue esigenze.
                        </p>
                      </div>
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

export default ContestoExercise;