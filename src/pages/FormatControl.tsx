import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb, ChevronDown, ChevronRight, Menu, Layout, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const FormatControl = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
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
      duration: '45:36',
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
          current: true,
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

  const exercises = [
    {
      id: 0,
      title: "Output in Tabella",
      icon: Table,
      prompt: "Potresti farmi una panoramica comparativa di 3 tool di intelligenza artificiale utili per chi lavora in marketing, indicando nome, funzione e se sono gratuiti o a pagamento?",
      outputWithoutFormat: "ChatGPT: un assistente AI per scrivere testi, email, script, brainstorming. Offre sia versione gratuita che a pagamento.\n\nCopy.ai: AI per generare testi pubblicitari, headline, email. Ha un piano gratuito limitato.\n\nSurfer SEO: AI per ottimizzazione SEO, crea articoli e brief. Solo a pagamento.",
      formatRequest: "...e puoi mostrarmeli in una tabella con queste colonne: Nome, Funzione, Prezzo?",
      outputWithFormat: "Nome\t\tFunzione\t\t\t\t\tPrezzo\nChatGPT\t\tAssistente AI per testi e idee\t\t\tGratuito + Pro\nCopy.ai\t\tGeneratore testi pubblicitari\t\t\tGratuito (limitato)\nSurfer SEO\tOttimizzazione SEO e content brief\tA pagamento",
      tooltip: "La tabella rende il confronto immediato e facilmente copiabile in slide, report o email.",
      color: "blue"
    },
    {
      id: 1,
      title: "Output in Bullet List Operativa",
      icon: List,
      prompt: "Mi scrivi uno script base per una call di follow-up con un cliente che ha chiesto informazioni ma non ha ancora acquistato?",
      outputWithoutFormat: "Certo. Potresti iniziare salutando il cliente e ringraziandolo per l'interesse. Poi chiedere se ha domande o dubbi sul servizio, infine ribadire i benefici e proporre di fissare una call più dettagliata o direttamente l'acquisto.",
      formatRequest: "...puoi invece scrivermelo come elenco puntato, diviso per fasi della call?",
      outputWithFormat: "Script follow-up:\n\n• Apertura:\n  - \"Ciao [Nome], grazie ancora per l'interesse di qualche giorno fa.\"\n  - \"Hai avuto modo di pensarci o ci sono domande a cui posso rispondere?\"\n\n• Ascolto attivo:\n  - Ascolta dubbi, motivazioni, obiezioni\n  - \"Capisco perfettamente, ti va se rivediamo insieme i punti principali?\"\n\n• Proposta:\n  - \"Come ti accennavo, ecco i vantaggi principali del servizio...\"\n  - \"Possiamo fissare una demo oppure iniziare già con il primo step.\"\n\n• Chiusura:\n  - \"Ti andrebbe di fissare un appuntamento già domani o venerdì?\"",
      tooltip: "La bullet list rende il discorso più operativo e ti guida passo-passo nella call.",
      color: "emerald"
    },
    {
      id: 2,
      title: "Output in Formato Slide",
      icon: Layout,
      prompt: "Devo preparare una presentazione introduttiva sull'uso dell'intelligenza artificiale in ufficio da mostrare ai miei colleghi. Puoi darmi una sintesi chiara con i punti principali?",
      outputWithoutFormat: "Certo. L'intelligenza artificiale sta diventando uno strumento essenziale negli uffici. Può aiutare a generare testi, riassumere documenti, rispondere a email, analizzare dati e supportare decisioni. È importante però usarla con senso critico...",
      formatRequest: "...puoi organizzarla come se fosse una presentazione PowerPoint? Tipo: slide 1 = titolo + bullet point, e così via?",
      outputWithFormat: "Slide 1 – Cos'è l'Intelligenza Artificiale\n• È la simulazione del ragionamento umano da parte delle macchine\n• Si basa su dati, modelli statistici e linguaggio\n• È già integrata in molti strumenti che usiamo\n\nSlide 2 – Usi pratici in ufficio\n• Scrivere email e report più velocemente\n• Riassumere documenti o meeting\n• Creare presentazioni, analizzare dati\n\nSlide 3 – Cose da ricordare\n• Verificare sempre i risultati\n• L'AI è un supporto, non un sostituto\n• Serve sperimentare per integrarla bene nel proprio lavoro",
      tooltip: "Chiedere il formato 'slide' aiuta a ottenere contenuti già pronti da incollare in PowerPoint.",
      color: "purple"
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
                Modulo 2.2 – Controllare il formato dell'output
              </div>
              <div className="text-slate-400 text-sm">
                3 Esercizi Comparativi
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                Prima & Dopo
              </div>
            </div>
          </div>

          {/* Tutorial Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Layout className="w-10 h-10 text-orange-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    📋 Controllare il formato dell'output
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    Scopri come lo stesso contenuto può diventare molto più utile e professionale 
                    semplicemente specificando il formato desiderato nel tuo prompt.
                  </p>
                </div>

                <div className="bg-orange-900/20 border border-orange-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-orange-300 font-semibold mb-4 flex items-center">
                    <Layout className="w-5 h-5 mr-2" />
                    Formati che sperimenterai:
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <Table className="w-4 h-4 mr-2 mt-0.5 text-blue-400" />
                      <div>
                        <strong>Tabelle</strong> - Per confronti chiari e dati strutturati
                      </div>
                    </li>
                    <li className="flex items-start">
                      <List className="w-4 h-4 mr-2 mt-0.5 text-emerald-400" />
                      <div>
                        <strong>Bullet List</strong> - Per istruzioni operative step-by-step
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Layout className="w-4 h-4 mr-2 mt-0.5 text-purple-400" />
                      <div>
                        <strong>Slide PowerPoint</strong> - Per presentazioni pronte all'uso
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-4 mb-8 text-left max-w-2xl mx-auto">
                  <p className="text-yellow-300 text-sm">
                    <strong>💡 Punto chiave:</strong> Il contenuto è sempre lo stesso, cambia solo come viene presentato. 
                    Questo ti fa risparmiare tempo nella formattazione e rende l'output immediatamente utilizzabile.
                  </p>
                </div>

                <Button
                  onClick={() => setShowTutorial(false)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3"
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
              Modulo 2.2 – Controllare il formato dell'output
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
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
                      {allModules.map((module) => (
                        <div key={module.id} className="border border-slate-700/40 rounded-lg overflow-hidden bg-slate-800/20">
                          {/* Module Header */}
                          <div
                            className={`p-4 cursor-pointer transition-all duration-200 ${
                              module.id === 'modulo-2' 
                                ? 'bg-orange-900/30 border-l-4 border-orange-400' 
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
                                    <Play className="w-5 h-5 text-orange-400" />
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
                                      ? 'bg-orange-800/20 border-orange-400'
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
                                      }
                                      // Current lesson (2.2) - no navigation needed
                                    } else if (module.id !== 'modulo-2') {
                                      navigateToModule(module.route);
                                    }
                                  }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 pr-3">
                                      <h5 className={`text-sm font-medium leading-tight ${
                                        lesson.current && module.id === 'modulo-2' ? 'text-orange-300' : 'text-slate-300'
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
                              ? 'bg-orange-900/40 border border-orange-400/50' 
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
                            <Play className="w-4 h-4 text-orange-400" />
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
                          className="text-orange-300 border-orange-500/50"
                        >
                          {currentStep + 1}/{exercises.length}
                        </Badge>
                      </div>
                    </div>

                    {/* Original Prompt */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">📝 Prompt Base (sempre lo stesso)</h3>
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 mr-2 text-blue-400" />
                          <span className="text-blue-300 font-medium">Input Utente</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-3 inline-block max-w-[90%]">
                          <p className="text-sm">{currentExercise.prompt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Without Format */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">❌ Senza formato specificato</h3>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Bot className="w-5 h-5 mr-2 text-red-400" />
                          <span className="text-red-300 font-medium">Risposta AI</span>
                        </div>
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3">
                          <p className="text-sm whitespace-pre-line">{currentExercise.outputWithoutFormat}</p>
                        </div>
                      </div>
                    </div>

                    {/* With Format Request */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">✅ Con formato richiesto</h3>
                      </div>
                      
                      {/* Format Request */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 mr-2 text-blue-400" />
                          <span className="text-blue-300 font-medium">Aggiunta al Prompt</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg px-4 py-3 inline-block max-w-[90%]">
                          <p className="text-sm">{currentExercise.formatRequest}</p>
                        </div>
                      </div>

                      {/* Formatted Output */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Bot className="w-5 h-5 mr-2 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Risposta AI Formattata</span>
                        </div>
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-4 py-3">
                          <pre className="text-sm whitespace-pre-wrap font-mono">{currentExercise.outputWithFormat}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className={`bg-${currentExercise.color}-900/20 border border-${currentExercise.color}-700/40 rounded-lg p-4 mb-6`}>
                      <div className="flex items-center mb-2">
                        <Lightbulb className={`w-5 h-5 mr-2 text-${currentExercise.color}-400`} />
                        <span className={`text-${currentExercise.color}-300 font-medium`}>Perché funziona meglio?</span>
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
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Prossimo Esercizio →
                          </Button>
                        )}
                        
                        {completedSteps[currentStep] && currentStep === exercises.length - 1 && (
                          <Button
                            onClick={() => {
                              // Mark as fully completed and show final message
                              setCompletedSteps([true, true, true]);
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
                      Hai visto come può cambiare lo stesso contenuto solo in base al formato richiesto?
                    </p>

                    <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
                      <h3 className="text-blue-300 font-semibold mb-4">🧠 Con i LLM puoi chiedere:</h3>
                      <ul className="text-slate-300 space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          "Fammi una tabella con..."
                        </li>
                        <li className="flex items-start">
                          <span className="text-emerald-400 mr-2">•</span>
                          "Scrivimi in bullet point..."
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          "Organizzalo come presentazione slide..."
                        </li>
                      </ul>
                      
                      <div className="bg-orange-900/30 border border-orange-700/30 rounded p-4 mt-4">
                        <p className="text-orange-200 text-sm">
                          <strong>💡 Regola d'oro:</strong> Ogni formato ti fa risparmiare tempo in un contesto diverso: 
                          presentazioni, call, email, documenti.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => navigate('/contesto')}
                        variant="ghost"
                        className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                      >
                        ← Modulo 2.1
                      </Button>
                      <Button
                        onClick={() => navigate('/dashboard')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Torna alla Dashboard
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

export default FormatControl;