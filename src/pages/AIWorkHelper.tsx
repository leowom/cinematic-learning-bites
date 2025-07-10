import React, { useState, useEffect } from 'react';
import { Home, Bot, Send, MessageCircle, Lightbulb, CheckCircle, ArrowRight, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useOpenAI } from '@/hooks/useOpenAI';
import CourseSidebar from '@/components/CourseSidebar';
import { toast } from 'sonner';

interface StepData {
  id: number;
  title: string;
  question: string;
  placeholder: string;
  userResponse: string;
  isCompleted: boolean;
}

const AIWorkHelper = () => {
  const navigate = useNavigate();
  const { testPromptWithGPT } = useOpenAI();
  const [currentStep, setCurrentStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [finalResponse, setFinalResponse] = useState('');
  
  const [stepData, setStepData] = useState<StepData[]>([
    {
      id: 1,
      title: "Il tuo ruolo lavorativo",
      question: "Per favore, descrivi brevemente il tuo ruolo lavorativo attuale.",
      placeholder: "Es: Sono un manager di marketing che gestisce campagne social...",
      userResponse: '',
      isCompleted: false
    },
    {
      id: 2,
      title: "Attività che richiedono tempo",
      question: "Quali attività svolgi frequentemente che richiedono molto tempo o potrebbero essere svolte in maniera più efficiente?",
      placeholder: "Es: Scrivere email ai clienti, creare report settimanali...",
      userResponse: '',
      isCompleted: false
    },
    {
      id: 3,
      title: "Principali sfide",
      question: "Quali sono le principali difficoltà o sfide che incontri nello svolgimento di queste attività?",
      placeholder: "Es: Trovo difficile personalizzare le comunicazioni per diversi clienti...",
      userResponse: '',
      isCompleted: false
    }
  ]);

  const currentStepData = stepData[currentStep];
  const allStepsCompleted = stepData.every(step => step.isCompleted);

  if (showIntro) {
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
                Modulo 1.2 - Scopri come l'IA può aiutarti nel tuo lavoro
              </div>
              <div className="text-slate-400 text-sm">
                LearningBites AI
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 text-sm">
                Esperienza Interattiva
              </div>
            </div>
          </div>

          {/* Intro Modal */}
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base text-center">
              <div className="section-spacing">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Benvenuto in LearningBites AI! 🤖
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    In questo esercizio interattivo scoprirai come l'Intelligenza Artificiale può supportarti 
                    concretamente nel tuo lavoro. Iniziamo con alcune semplici domande per identificare le tue 
                    esigenze specifiche.
                  </p>
                </div>

                <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-emerald-300 font-semibold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Come funziona:
                  </h3>
                  <div className="text-slate-300 space-y-3">
                    <div className="flex items-start">
                      <span className="text-emerald-400 mr-3 font-bold">1.</span>
                      Ti faremo 3 domande sul tuo lavoro
                    </div>
                    <div className="flex items-start">
                      <span className="text-emerald-400 mr-3 font-bold">2.</span>
                      L'Intelligenza Artificiale genererà un prompt personalizzato
                    </div>
                    <div className="flex items-start">
                      <span className="text-emerald-400 mr-3 font-bold">3.</span>
                      Riceverai suggerimenti specifici per il tuo lavoro
                    </div>
                    <div className="flex items-start">
                      <span className="text-emerald-400 mr-3 font-bold">4.</span>
                      Potrai approfondire con domande aggiuntive
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowIntro(false)} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-3"
                >
                  Inizia l'Esperienza
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleStepSubmit = async () => {
    if (!currentInput.trim()) return;

    const newStepData = [...stepData];
    newStepData[currentStep].userResponse = currentInput;
    newStepData[currentStep].isCompleted = true;
    setStepData(newStepData);

    // Add to chat history
    setChatHistory(prev => [...prev, 
      { type: 'user', content: currentInput }
    ]);

    setCurrentInput('');

    // Move to next step or generate prompt
    if (currentStep < stepData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed, generate prompt
      await generatePersonalizedPrompt();
    }
  };

  const generatePersonalizedPrompt = async () => {
    setIsLoading(true);
    try {
      const prompt = `Basandoti sulle seguenti informazioni dell'utente:
- Ruolo lavorativo: ${stepData[0].userResponse}
- Attività che richiedono tempo: ${stepData[1].userResponse}
- Principali difficoltà: ${stepData[2].userResponse}

Genera un prompt personalizzato che l'utente possa utilizzare per ricevere supporto specifico dall'IA. Il prompt deve essere pratico e mirato alle sue esigenze. Inizia con "Sono un..." e includi tutti i dettagli rilevanti. Il prompt deve terminare con una richiesta specifica di suggerimenti e soluzioni pratiche.`;

      const testCase = { 
        scenario: "Generazione prompt personalizzato",
        context: "Aiuto lavorativo" 
      };

      const result = await testPromptWithGPT(prompt, testCase);
      setGeneratedPrompt(result.response);
      
      setChatHistory(prev => [...prev, 
        { type: 'ai', content: `Ho generato un prompt personalizzato per te:\n\n"${result.response}"\n\nVuoi inviarlo per ricevere suggerimenti specifici per il tuo lavoro?` }
      ]);
    } catch (error) {
      console.error('Errore durante la generazione del prompt:', error);
      toast.error('Errore durante la generazione del prompt. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitGeneratedPrompt = async () => {
    if (!generatedPrompt) return;

    setIsLoading(true);
    try {
      const testCase = { 
        scenario: "Consulenza lavorativa personalizzata",
        context: "Suggerimenti pratici" 
      };

      const result = await testPromptWithGPT(generatedPrompt, testCase);
      setFinalResponse(result.response);
      
      setChatHistory(prev => [...prev, 
        { type: 'user', content: generatedPrompt },
        { type: 'ai', content: result.response }
      ]);
      
      toast.success('Perfetto! L\'IA ha generato suggerimenti personalizzati per te.');
    } catch (error) {
      console.error('Errore durante l\'invio del prompt:', error);
      toast.error('Errore durante l\'invio del prompt. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const askFollowUpQuestion = async () => {
    if (!currentInput.trim()) return;

    setIsLoading(true);
    try {
      const followUpPrompt = `Basandoti sulla precedente risposta sui suggerimenti lavorativi, l'utente ha questa domanda di approfondimento: "${currentInput}". Fornisci una risposta dettagliata e pratica.`;

      const testCase = { 
        scenario: "Domanda di approfondimento",
        context: "Consulenza lavorativa" 
      };

      const result = await testPromptWithGPT(followUpPrompt, testCase);
      
      setChatHistory(prev => [...prev, 
        { type: 'user', content: currentInput },
        { type: 'ai', content: result.response }
      ]);
      
      setCurrentInput('');
    } catch (error) {
      console.error('Errore durante la domanda di approfondimento:', error);
      toast.error('Errore durante l\'invio della domanda. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

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
              LearningBites AI - Scopri come l'IA può aiutarti
            </div>
            <div className="text-slate-400 text-sm">
              {allStepsCompleted ? 'Conversazione Personalizzata' : `Passo ${currentStep + 1} di ${stepData.length}`}
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              Progresso: {stepData.filter(s => s.isCompleted).length}/{stepData.length}
            </div>
            <div className="w-24 bg-slate-700/60 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stepData.filter(s => s.isCompleted).length / stepData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 relative">
          <CourseSidebar 
            currentModuleId="modulo-1"
            currentLessonId={1}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-12 gap-6">
              {/* Progress Sidebar */}
              <div className="col-span-12 lg:col-span-4">
                <div className="step-card glassmorphism-base">
                  <div className="section-spacing">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-emerald-400" />
                      Passi dell'Esperienza
                    </h3>
                    
                    <div className="space-y-3">
                      {stepData.map((step, index) => (
                        <div 
                          key={step.id} 
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            index === currentStep && !allStepsCompleted
                              ? 'bg-emerald-900/30 border-emerald-500/50 shadow-lg' 
                              : step.isCompleted
                              ? 'bg-emerald-900/20 border-emerald-700/40'
                              : 'bg-slate-800/50 border-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              {step.isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              ) : index === currentStep ? (
                                <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-slate-900">{index + 1}</span>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center">
                                  <span className="text-xs text-slate-500">{index + 1}</span>
                                </div>
                              )}
                              <span className={`font-medium text-sm ${
                                index === currentStep && !allStepsCompleted ? 'text-emerald-300' : 'text-slate-300'
                              }`}>
                                Passo {index + 1}
                              </span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-sm text-slate-200">
                            {step.title}
                          </h4>
                        </div>
                      ))}
                      
                      {allStepsCompleted && (
                        <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-900/30">
                          <div className="flex items-center space-x-3 mb-2">
                            <Bot className="w-5 h-5 text-blue-400" />
                            <span className="font-medium text-sm text-blue-300">
                              Conversazione Attiva
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-slate-200">
                            Chat con l'Intelligenza Artificiale
                          </h4>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Chat Interface */}
              <div className="col-span-12 lg:col-span-8">
                <div className="step-card glassmorphism-base h-[600px] flex flex-col">
                  <div className="section-spacing flex-1 flex flex-col">
                    {!allStepsCompleted ? (
                      <>
                        {/* Current Step Question */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">
                              {currentStepData.title}
                            </h2>
                            <Badge variant="outline" className="text-emerald-300 border-emerald-500/50">
                              {currentStep + 1}/{stepData.length}
                            </Badge>
                          </div>
                          
                          <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Bot className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                              <p className="text-slate-300">
                                {currentStepData.question}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Input Area */}
                        <div className="mt-auto">
                          <Textarea
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder={currentStepData.placeholder}
                            className="bg-slate-800/50 border-slate-700 text-slate-200 mb-4 min-h-[100px]"
                          />
                          <div className="flex justify-between">
                            <Button
                              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                              variant="ghost"
                              disabled={currentStep === 0}
                              className="text-slate-300 hover:text-slate-100"
                            >
                              ← Indietro
                            </Button>
                            <Button
                              onClick={handleStepSubmit}
                              disabled={!currentInput.trim() || isLoading}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4 mr-2" />
                              )}
                              {currentStep === stepData.length - 1 ? 'Genera Prompt' : 'Continua'}
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                          {chatHistory.map((message, index) => (
                            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-lg p-4 ${
                                message.type === 'user' 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-slate-800/50 border border-slate-700 text-slate-200'
                              }`}>
                                {message.type === 'ai' && (
                                  <div className="flex items-center mb-2">
                                    <Bot className="w-4 h-4 mr-2 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">LearningBites AI</span>
                                  </div>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                <div className="flex items-center">
                                  <Bot className="w-4 h-4 mr-2 text-emerald-400" />
                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                  <span className="ml-2 text-slate-300 text-sm">L'IA sta elaborando...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-slate-700/50 pt-4">
                          {generatedPrompt && !finalResponse ? (
                            <div className="mb-4">
                              <Button
                                onClick={submitGeneratedPrompt}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                              >
                                {isLoading ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4 mr-2" />
                                )}
                                Invia il Prompt Personalizzato
                              </Button>
                            </div>
                          ) : finalResponse ? (
                            <>
                              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3 mb-4">
                                <p className="text-blue-300 text-sm">
                                  💡 Prova a chiedere all'Intelligenza Artificiale ulteriori dettagli su una delle soluzioni ricevute, per renderla ancora più specifica e adattata al tuo lavoro.
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Textarea
                                  value={currentInput}
                                  onChange={(e) => setCurrentInput(e.target.value)}
                                  placeholder="Chiedi approfondimenti su una delle soluzioni..."
                                  className="bg-slate-800/50 border-slate-700 text-slate-200 flex-1"
                                />
                                <Button
                                  onClick={askFollowUpQuestion}
                                  disabled={!currentInput.trim() || isLoading}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWorkHelper;