import React, { useState } from 'react';
import { Home, Play, CheckCircle, Clock, User, BookOpen, Award, ArrowRight, Bot, MessageCircle, Lightbulb, ChevronDown, ChevronRight, Menu, Layout, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import CourseSidebar from '@/components/CourseSidebar';
import { useNavigation } from '@/hooks/useNavigation';

const FormatControl = () => {
  const navigate = useNavigate();
  const { getNextLesson, getPreviousLesson } = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    } else {
      // If it's the last step, go to next lesson
      const nextLesson = getNextLesson('/ai-interactive/format-control');
      if (nextLesson) {
        navigate(nextLesson.route);
      }
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
                Modulo 2.2 – Controllare il formato dell'output
              </div>
              <div className="text-slate-400 text-xs">
                3 Esercizi Comparativi
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-xs">
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
              Modulo 2.2 – Controllare il formato dell'output
            </div>
            <div className="text-slate-400 text-xs">
              Esercizio {currentStep + 1} di {exercises.length}
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-xs">
              Progresso: {completedSteps.filter(Boolean).length}/{exercises.length}
            </div>
            <div className="w-20 bg-slate-700/60 rounded-full h-1.5 mt-1">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.filter(Boolean).length / exercises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          {/* Course Navigation Sidebar */}
          <CourseSidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentModuleId="modulo-2"
          />

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
                    <div className="demo-horizontal mb-4">
                      <div className="demo-section">
                        <h3 className="text-base font-semibold text-white mb-2">📝 Prompt Base</h3>
                        <div className="bg-blue-600 text-white rounded-lg px-3 py-2">
                          <p className="text-sm">{currentExercise.prompt}</p>
                        </div>
                      </div>

                      {/* Without Format */}
                      <div className="demo-section">
                        <h3 className="text-base font-semibold text-white mb-2">❌ Senza formato</h3>
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 max-h-32 overflow-y-auto">
                          <p className="text-sm whitespace-pre-line">{currentExercise.outputWithoutFormat}</p>
                        </div>
                      </div>
                    </div>

                    {/* With Format */}
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-white mb-2">✅ Con formato richiesto</h3>
                      
                      {/* Format Request */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center mb-2">
                          <User className="w-4 h-4 mr-2 text-blue-400" />
                          <span className="text-blue-300 font-medium text-sm">Aggiunta al Prompt</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg px-3 py-2">
                          <p className="text-sm">{currentExercise.formatRequest}</p>
                        </div>
                      </div>

                      {/* Formatted Output */}
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Bot className="w-4 h-4 mr-2 text-emerald-400" />
                          <span className="text-emerald-300 font-medium text-sm">Risposta AI Formattata</span>
                        </div>
                        <div className="bg-slate-700/50 text-slate-200 rounded-lg px-3 py-2 max-h-40 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap font-mono">{currentExercise.outputWithFormat}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className={`bg-${currentExercise.color}-900/20 border border-${currentExercise.color}-700/40 rounded-lg p-3 mb-4`}>
                      <div className="flex items-center mb-2">
                        <Lightbulb className={`w-4 h-4 mr-2 text-${currentExercise.color}-400`} />
                        <span className={`text-${currentExercise.color}-300 font-medium text-sm`}>Perché funziona meglio?</span>
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
                        onClick={() => {
                          const prevLesson = getPreviousLesson('/ai-interactive/format-control');
                          if (prevLesson) {
                            navigate(prevLesson.route);
                          }
                        }}
                        variant="ghost"
                        className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                      >
                        ← Precedente
                      </Button>
                      <Button
                        onClick={() => {
                          const nextLesson = getNextLesson('/ai-interactive/format-control');
                          if (nextLesson) {
                            navigate(nextLesson.route);
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Prossimo →
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