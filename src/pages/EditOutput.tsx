import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb, ChevronDown, ChevronRight, Menu, Edit3, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const EditOutput = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string, timestamp?: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
          completed: true,
          current: false,
          description: "Impara come assegnare ruoli specifici per ottenere risposte più esperte e specializzate"
        },
        {
          id: 4,
          title: "Chiedere modifiche all'output",
          duration: "10:00",
          completed: false,
          current: true,
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

  const initialPrompt = "Cos'è l'Intelligenza Artificiale Generativa?";
  const initialResponse = "L'intelligenza artificiale generativa è una branca dell'AI che si occupa di creare nuovi contenuti come testi, immagini, musica o codice, partendo da dati esistenti. Utilizza modelli linguistici di grandi dimensioni (LLM) per imparare e replicare la struttura del linguaggio umano o di altri segnali digitali.";

  const simplifiedResponse = "L'intelligenza artificiale generativa è una tecnologia che può creare cose nuove, come testi, immagini o musica. Lo fa imparando da tanti esempi già esistenti. È come un programma molto intelligente che ha letto milioni di cose e ora riesce a scriverne di nuove da solo.";

  const childFriendlyResponse = "L'intelligenza artificiale generativa è come un robot che legge tanti libri e poi ne inventa uno nuovo tutto da solo. Non copia, ma crea cose nuove, come storie, disegni o canzoni, proprio come fanno le persone creative.";

  const tooltips = [
    "Puoi chiedere all'AI di riscrivere, semplificare o adattare la risposta al tuo pubblico.",
    "Non servono prompt perfetti. Basta dire cosa vuoi in modo chiaro.",
    "ChatGPT è una conversazione, non un generatore a colpo singolo!"
  ];

  const startExercise = () => {
    setShowTutorial(false);
    // Initialize chat with the first prompt and response
    setChatMessages([
      { type: 'user', content: initialPrompt },
      { type: 'ai', content: initialResponse }
    ]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { type: 'user' as const, content: userInput }];
    setChatMessages(newMessages);
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let aiResponse = "";
      const input = userInput.toLowerCase();

      if (input.includes('semplice') || input.includes('semplicemente') || input.includes('più facile')) {
        aiResponse = simplifiedResponse;
      } else if (input.includes('10 anni') || input.includes('bambino') || input.includes('bambini') || input.includes('semplice per')) {
        aiResponse = childFriendlyResponse;
      } else {
        aiResponse = "Perfetto! Prova a chiedermi di 'rendere più semplice' la spiegazione, oppure di 'spiegarlo come se avessi 10 anni'. Sono qui per adattare la risposta alle tue esigenze!";
      }

      setChatMessages([...newMessages, { type: 'ai', content: aiResponse }]);
      setIsLoading(false);
      setUserInput('');
      
      // Show tooltip after successful interaction
      if (aiResponse !== "Perfetto! Prova a chiedermi di 'rendere più semplice' la spiegazione, oppure di 'spiegarlo come se avessi 10 anni'. Sono qui per adattare la risposta alle tue esigenze!") {
        setStepCompleted(true);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 2000);
  };

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
                Modulo 2.4 – Chiedere modifiche all'output
              </div>
              <div className="text-slate-400 text-sm">
                Esercizio Interattivo
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                Pratica Guidata
              </div>
            </div>
          </div>

          {/* Tutorial Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Edit3 className="w-10 h-10 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    ✏️ Chiedere modifiche all'output
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    Ora è il tuo turno! Sperimenta l'interazione iterativa con l'AI per affinare 
                    e migliorare le risposte in base alle tue esigenze specifiche.
                  </p>
                </div>

                <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-green-300 font-semibold mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Come funziona:
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">1.</span>
                      L'AI risponderà a una domanda iniziale
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">2.</span>
                      Tu chiederai di modificare la risposta
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">3.</span>
                      L'AI adatterà l'output alle tue richieste
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-4 mb-8 text-left max-w-2xl mx-auto">
                  <p className="text-yellow-300 text-sm">
                    <strong>💡 Suggerimenti:</strong> Prova a dire "Rendilo più semplice" o 
                    "Spiegamelo come se avessi 10 anni" per vedere come l'AI adatta la risposta!
                  </p>
                </div>

                <Button
                  onClick={startExercise}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
                >
                  Inizia a Chattare
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
      <div className="prompt-lab-container max-w-7xl mx-auto">
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
              Modulo 2.4 – Chiedere modifiche all'output
            </div>
            <div className="text-slate-400 text-sm">
              Chat Interattiva
            </div>
          </div>

          <div className="text-right">
            <Badge variant="outline" className={`${stepCompleted ? 'text-emerald-300 border-emerald-500/50' : 'text-green-300 border-green-500/50'}`}>
              {stepCompleted ? 'Completato!' : 'In Corso'}
            </Badge>
          </div>
        </div>

        <div className="flex gap-4 relative">
          {/* Collapsible Sidebar - Course Navigation */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-72'} flex-shrink-0`}>
            <div className="step-card glassmorphism-base sticky top-4 h-[calc(100vh-2rem)] flex flex-col">
              <div className="p-6 flex-shrink-0">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-4">
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
                  <>
                    {/* Overall Progress */}
                    <div className="mb-4 p-4 bg-slate-800/40 rounded-lg border border-slate-700/30">
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
                  </>
                )}
              </div>

              {!sidebarCollapsed && (
                <div className="flex-1 overflow-y-auto px-6 pb-6" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgb(71 85 105) rgb(30 41 59)'
                }}>
                  {/* Modules List - Scrollable */}
                  <div className="space-y-3">
                    {allModules.map((module) => (
                      <div key={module.id} className="border border-slate-700/40 rounded-lg overflow-hidden bg-slate-800/20">
                        {/* Module Header */}
                        <div
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            module.id === 'modulo-2' 
                              ? 'bg-green-900/30 border-l-4 border-green-400' 
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
                                  <Play className="w-5 h-5 text-green-400" />
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
                                    ? 'bg-green-800/20 border-green-400'
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
                                      navigateToModule('/ai-interactive/role-instruction');
                                    }
                                    // Current lesson (2.4) - no navigation needed
                                  } else if (module.id !== 'modulo-2') {
                                    navigateToModule(module.route);
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 pr-3">
                                    <h5 className={`text-sm font-medium leading-tight ${
                                      lesson.current && module.id === 'modulo-2' ? 'text-green-300' : 'text-slate-300'
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
                <div className="flex flex-col items-center space-y-4 flex-1 p-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="space-y-2">
                    {allModules.map((module) => (
                      <div
                        key={module.id}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                          module.id === 'modulo-2' 
                            ? 'bg-green-900/40 border border-green-400/50' 
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
                          <Play className="w-4 h-4 text-green-400" />
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

          {/* Main Content - Chat Interface */}
          <div className="flex-1 max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base h-full">
              <div className="section-spacing h-full flex flex-col">
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center">
                    <Edit3 className="w-6 h-6 mr-3 text-green-400" />
                    Chat Interattiva con l'AI
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Prova a chiedere modifiche alla risposta dell'AI per adattarla alle tue esigenze
                  </p>
                </div>

                {/* Tooltip */}
                {showTooltip && (
                  <div className="mb-4 bg-green-900/20 border border-green-700/40 rounded-lg p-3 animate-fade-in">
                    <p className="text-green-300 text-sm flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {tooltips[Math.floor(Math.random() * tooltips.length)]}
                    </p>
                  </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4 overflow-y-auto min-h-[400px] max-h-[500px]">
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700/50 text-slate-200'
                        }`}>
                          {message.type === 'ai' && (
                            <div className="flex items-center mb-2">
                              <Bot className="w-4 h-4 mr-2 text-green-400" />
                              <span className="text-green-400 text-sm font-medium">AI Assistant</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* Loading State */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3 max-w-[80%]">
                          <div className="flex items-center mb-2">
                            <Bot className="w-4 h-4 mr-2 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">AI Assistant</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-slate-400 text-xs">Sto pensando...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {chatMessages.length === 0 && (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <div className="text-center">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>La conversazione inizierà automaticamente...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Scrivi qui la tua richiesta di modifica (es. 'Rendilo più semplice')..."
                      className="flex-1 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 resize-none focus:border-green-500/50 focus:ring-green-500/20"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim() || isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Suggestions */}
                  {!stepCompleted && chatMessages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setUserInput("Rendilo più semplice")}
                        variant="outline"
                        size="sm"
                        className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 text-xs"
                      >
                        💡 Rendilo più semplice
                      </Button>
                      <Button
                        onClick={() => setUserInput("Spiegamelo come se avessi 10 anni")}
                        variant="outline"
                        size="sm"
                        className="bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 text-xs"
                      >
                        👶 Come per un bambino
                      </Button>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                    <Button
                      onClick={() => navigate('/ai-interactive/role-instruction')}
                      variant="ghost"
                      className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    >
                      ← Modulo 2.3
                    </Button>
                    
                    {!stepCompleted && (
                      <div className="text-slate-400 text-sm">
                        Prova a modificare la risposta dell'AI
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Completion Section - Outside main content for better centering */}
        {stepCompleted && (
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 mr-3 text-emerald-400" />
                <h3 className="text-emerald-300 font-bold text-xl">Ottimo lavoro!</h3>
              </div>
              <p className="text-slate-300 mb-4">
                Hai sperimentato l'interazione iterativa con l'AI per migliorare l'output in base alle tue esigenze.
              </p>
              <div className="text-left bg-slate-800/30 rounded-lg p-4">
                <p className="text-slate-300 text-sm mb-3 font-medium">Non serve riscrivere da zero. Basta dire:</p>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li className="flex items-center"><span className="text-green-400 mr-2">•</span> "Semplifica"</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">•</span> "Fallo più tecnico"</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">•</span> "Fammelo in bullet"</li>
                  <li className="flex items-center"><span className="text-green-400 mr-2">•</span> "Scrivilo per LinkedIn"</li>
                </ul>
                <p className="text-green-300 text-sm mt-4 font-semibold text-center">L'AI ti segue, se la guidi.</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3"
              size="lg"
            >
              <Award className="w-5 h-5 mr-2" />
              Completa Modulo 2
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditOutput;