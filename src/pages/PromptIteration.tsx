import React, { useState } from 'react';
import { Home, Bot, Send, MessageCircle, CheckCircle, ArrowRight, User, Loader2, RefreshCw, Target, Lightbulb, AlertTriangle, Edit3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useOpenAI } from '@/hooks/useOpenAI';
import CourseSidebar from '@/components/CourseSidebar';
import { toast } from 'sonner';

const PromptIteration = () => {
  const navigate = useNavigate();
  const { testPromptWithGPT } = useOpenAI();
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'phase1' | 'phase2' | 'completed'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [promptHistory, setPromptHistory] = useState<Array<{prompt: string, response: string}>>([]);
  const [reflection, setReflection] = useState('');

  // Mockup data for Phase 1
  const mockupData = {
    initialPrompt: "Scrivi una mail di follow-up per un potenziale cliente",
    badOutput: `Gentile Cliente,

Spero che questa email La trovi in buona salute. Volevo ricontattarLa per discutere ulteriormente delle opportunità di collaborazione che abbiamo affrontato durante il nostro precedente incontro.

La nostra azienda offre soluzioni innovative e di alta qualità che potrebbero essere di Suo interesse. Siamo certi che i nostri servizi possano apportare valore significativo alla Sua organizzazione.

Rimango a Sua disposizione per qualsiasi chiarimento e spero di ricevere Sue notizie al più presto.

Cordiali saluti,
[Nome]`,
    
    improvedPrompt: "Scrivi una mail di follow-up più concisa, in tono informale e che faccia riferimento al nostro precedente incontro di martedì. Menzione il progetto di digital marketing di cui abbiamo discusso e proponi un meeting di 30 minuti la prossima settimana.",
    
    goodOutput: `Ciao Marco,

Spero tutto bene! Volevo ringraziarti per il tempo che mi hai dedicato martedì. 

Ho riflettuto sul progetto di digital marketing di cui abbiamo parlato e credo di avere alcune idee interessanti da condividere. Che ne dici di sentirci per 30 minuti la prossima settimana? Potrei mostrarti una proposta più dettagliata.

Fammi sapere quando ti va bene!

A presto,
[Nome]`
  };

  const issues = [
    "Troppo formale e generico",
    "Non fa riferimento al precedente incontro",
    "Troppo lungo e verboso",
    "Non specifica l'oggetto della discussione",
    "Non propone un'azione concreta"
  ];

  const phase2Scenario = {
    title: "Riscrivere una descrizione prodotto",
    description: "Hai una descrizione prodotto troppo generica per un'app di fitness. Usa l'IA per migliorarla iterativamente.",
    initialDescription: "La nostra app di fitness ti aiuta a rimanere in forma. Ha molte funzionalità utili per il tuo allenamento."
  };

  const handlePhaseChange = (phase: typeof currentPhase) => {
    setCurrentPhase(phase);
    setCurrentStep(0);
  };

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleApiPrompt = async () => {
    if (!userInput.trim()) {
      toast.error("Inserisci un prompt prima di procedere");
      return;
    }

    setIsLoading(true);
    try {
      const result = await testPromptWithGPT(userInput, {
        context: "Product description improvement",
        scenario: phase2Scenario.initialDescription
      });
      
      const cleanResponse = result.response
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      setApiResponse(cleanResponse);
      setPromptHistory(prev => [...prev, { prompt: userInput, response: cleanResponse }]);
      setUserInput('');
      toast.success("Risposta generata con successo!");
    } catch (error) {
      console.error('Errore API:', error);
      toast.error("Errore durante la generazione della risposta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletion = () => {
    if (!reflection.trim()) {
      toast.error("Completa la riflessione finale prima di procedere");
      return;
    }
    setCurrentPhase('completed');
    toast.success("Esercizio completato con successo!");
  };

  const renderIntro = () => (
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
              Modulo 1.3 – Iterazione e Miglioramento dei Prompt
            </div>
            <div className="text-slate-400 text-sm">
              Esercizio Prima & Dopo + Pratica Reale
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-300 text-sm">
              2 Fasi Guidate
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        <div className="max-w-4xl mx-auto">
          <div className="step-card glassmorphism-base text-center">
            <div className="section-spacing">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  🔄 Iterazione e Miglioramento dei Prompt
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                  Impara che un prompt spesso non è sufficiente e che il valore si genera tramite <strong>prompt engineering iterativo</strong>. 
                  Sperimenterai come affinare le richieste in base al contesto e agli errori.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-6 text-left">
                  <h3 className="text-green-300 font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    🟢 Fase 1: Simulazione Guidata
                  </h3>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Analizza un output problematico</li>
                    <li>• Identifica gli errori comuni</li>
                    <li>• Correggi il prompt step-by-step</li>
                    <li>• Confronta Prima vs Dopo</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-lg p-6 text-left">
                  <h3 className="text-yellow-300 font-semibold mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    🟡 Fase 2: Pratica Autonoma
                  </h3>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Usa l'IA reale con API OpenAI</li>
                    <li>• Itera autonomamente i prompt</li>
                    <li>• Learn by doing</li>
                    <li>• Rifletti sull'apprendimento</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                onClick={() => handlePhaseChange('phase1')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
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

  const renderPhase1 = () => {
    if (currentStep === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
          background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
        }}>
          <div className="prompt-lab-container">
            <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50">
                  <Home className="w-4 h-4 mr-2" />Dashboard
                </Button>
              </div>
              <div className="text-center">
                <div className="text-slate-200 font-medium">Modulo 1.3 – Iterazione e Miglioramento dei Prompt</div>
                <div className="text-slate-400 text-sm">Step 1 - Introduzione</div>
              </div>
              <Badge variant="secondary">Fase 1: Simulazione</Badge>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="step-card glassmorphism-base">
                <div className="section-spacing">
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-400 mb-2">Attenzione!</h3>
                        <p className="text-sm text-slate-300">In questo esercizio simulerai l'uso di ChatGPT per scrivere una mail di follow-up commerciale. Il primo prompt che vedrai genera un output <strong>volutamente sbagliato</strong>.</p>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-6">Questo ti aiuterà a comprendere che:</h2>
                  <ul className="space-y-3 mb-8 text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />Un prompt spesso non è sufficiente</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />L'output può essere insoddisfacente per motivi prevedibili</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />Il valore si genera tramite iterazione e affinamento</li>
                  </ul>
                  
                  <Button onClick={() => setCurrentStep(1)} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
                    Procedi al Mockup ChatGPT
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
          <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
            <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50">
              <Home className="w-4 h-4 mr-2" />Dashboard
            </Button>
            <div className="text-center">
              <div className="text-slate-200 font-medium">Modulo 1.3 – Iterazione e Miglioramento dei Prompt</div>
              <div className="text-slate-400 text-sm">Fase 1: Simulazione Guidata</div>
            </div>
            <Badge variant="secondary">Step {currentStep + 1}</Badge>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="step-card glassmorphism-base">
              <div className="section-spacing">
                {currentStep === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Mockup ChatGPT</h2>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white rounded-lg p-4 max-w-xs">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" /><span className="text-sm font-medium">Tu</span>
                          </div>
                          <p>{mockupData.initialPrompt}</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-600 text-white rounded-lg p-4 max-w-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="h-4 w-4" /><span className="text-sm font-medium">ChatGPT</span>
                          </div>
                          <div className="text-sm whitespace-pre-line">{mockupData.badOutput}</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-6 text-center">Questa è una risposta <strong>volutamente problematica</strong>.</p>
                    <div className="text-center">
                      <Button onClick={() => setCurrentStep(2)} className="bg-blue-600 hover:bg-blue-700">
                        Analizza i Problemi <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
                
                {currentStep === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Identificazione Problemi</h2>
                    <h3 className="text-lg font-semibold mb-4 text-white">Cosa c'è che non va in questa risposta?</h3>
                    <div className="space-y-3 mb-8">
                      {issues.map((issue, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                          <input type="checkbox" checked={selectedIssues.includes(issue)} onChange={() => handleIssueToggle(issue)} className="w-4 h-4" />
                          <span className="text-slate-300">{issue}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold mb-2 text-blue-300">💡 Concetto Chiave: Refining Prompt</h4>
                      <p className="text-sm text-slate-300">Ora dovrai scrivere un prompt migliorato che risolva questi problemi.</p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-white">Scrivi un prompt migliorato:</label>
                      <Textarea value={improvedPrompt} onChange={(e) => setImprovedPrompt(e.target.value)} placeholder="Es: Scrivi una mail di follow-up più concisa..." className="bg-slate-700/30 border-slate-600 text-white placeholder:text-slate-400" rows={4} />
                    </div>
                    
                    <div className="text-center">
                      <Button onClick={() => setCurrentStep(3)} disabled={selectedIssues.length === 0 || !improvedPrompt.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        Vedi il Risultato Migliorato <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
                
                {currentStep === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Output Migliorato</h2>
                    <div className="space-y-6 mb-8">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3">Prompt Migliorato</h3>
                        <div className="bg-blue-600 text-white rounded-lg p-4">
                          <p className="text-sm">{mockupData.improvedPrompt}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3">Output ChatGPT Migliorato</h3>
                        <div className="bg-gray-600 text-white rounded-lg p-4 mb-4">
                          <div className="text-sm whitespace-pre-line">{mockupData.goodOutput}</div>
                        </div>
                        
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                          <h4 className="font-semibold text-green-400 mb-3">✅ Miglioramenti Ottenuti:</h4>
                          <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-400" />Tono più diretto e informale</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-400" />Riferimento specifico al precedente incontro</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-400" />Messaggio più conciso e focalizzato</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-slate-300 mb-6">Eccellente! Ora passiamo alla fase pratica con l'IA reale.</p>
                      <Button onClick={() => handlePhaseChange('phase2')} className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                        Procedi alla Fase 2 <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhase2 = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 border border-slate-700/40 rounded-lg">
          <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50">
            <Home className="w-4 h-4 mr-2" />Dashboard
          </Button>
          <div className="text-center">
            <div className="text-slate-200 font-medium">Modulo 1.3 – Iterazione e Miglioramento dei Prompt</div>
            <div className="text-slate-400 text-sm">Fase 2: Pratica Autonoma</div>
          </div>
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pratica Reale</Badge>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="step-card glassmorphism-base">
            <div className="section-spacing">
              {currentStep === 0 && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Target className="w-10 h-10 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">🎯 Nuova Sfida Pratica</h2>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">{phase2Scenario.title}</h3>
                    <p className="text-slate-300 mb-4">{phase2Scenario.description}</p>
                  </div>
                  
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <p className="text-xs text-slate-400 mb-1">Descrizione attuale:</p>
                    <p className="text-sm italic text-yellow-300">"{phase2Scenario.initialDescription}"</p>
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-4 mb-8">
                    <h4 className="font-semibold mb-2 text-blue-300">🔄 Come Funziona:</h4>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>• Scrivi un prompt nell'area sottostante</li>
                      <li>• Ricevi una risposta reale dall'IA</li>
                      <li>• Valuta il risultato e itera (minimo 1 volta)</li>
                      <li>• I tuoi prompt vengono salvati nella cronologia</li>
                    </ul>
                  </div>
                  
                  <div className="text-center">
                    <Button onClick={() => setCurrentStep(1)} className="bg-yellow-600 hover:bg-yellow-700 text-white text-lg px-8 py-3">
                      Inizia l'Esercizio Pratico <Target className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
              
              {currentStep >= 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white text-center">Iterazione Libera con IA Reale</h2>
                  
                  <div className="bg-slate-700/30 rounded-lg p-4 h-64 overflow-y-auto space-y-4">
                    {promptHistory.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Inizia scrivendo il tuo primo prompt...</p>
                      </div>
                    ) : (
                      promptHistory.map((entry, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-end">
                            <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                              <div className="text-xs mb-1">Prompt {index + 1}</div>
                              <p className="text-sm">{entry.prompt}</p>
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-gray-600 text-white rounded-lg p-3 max-w-lg">
                              <div className="text-xs mb-1">IA</div>
                              <p className="text-sm whitespace-pre-line">{entry.response}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Scrivi qui il tuo prompt per migliorare la descrizione del prodotto..." className="bg-slate-700/30 border-slate-600 text-white placeholder:text-slate-400" rows={3} />
                    <div className="flex gap-2">
                      <Button onClick={handleApiPrompt} disabled={isLoading || !userInput.trim()} className="bg-yellow-600 hover:bg-yellow-700 flex-1">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Invia Prompt
                      </Button>
                      {promptHistory.length > 0 && (
                        <Button onClick={() => setCurrentStep(2)} variant="outline" className="border-slate-600 text-white hover:bg-slate-700/50">
                          Completa Esercizio <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {promptHistory.length > 0 && (
                    <div className="bg-green-500/20 rounded p-3 text-center">
                      <p className="text-xs text-green-400 font-medium">✅ Obiettivo raggiunto! Hai iterato almeno una volta.</p>
                    </div>
                  )}
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white text-center">Riflessione Finale</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Qual è stato l'errore del primo prompt? Cosa hai cambiato per migliorarlo?
                    </label>
                    <Textarea value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Es: Il primo prompt era troppo generico..." className="bg-slate-700/30 border-slate-600 text-white placeholder:text-slate-400" rows={5} />
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-300">📊 Il tuo Progress:</h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Prompt inviati:</span><span className="font-medium">{promptHistory.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Iterazioni completate:</span><span className="font-medium">{Math.max(0, promptHistory.length - 1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button onClick={handleCompletion} disabled={!reflection.trim() || promptHistory.length < 2} className="bg-green-600 hover:bg-green-700 w-full py-3">
                      Completa l'Esercizio <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{
      background: 'linear-gradient(135deg, #1a2434 0%, #0f172a 50%, #1a2434 100%)'
    }}>
      <div className="prompt-lab-container">
        <div className="max-w-4xl mx-auto">
          <div className="step-card glassmorphism-base text-center">
            <div className="section-spacing">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">🎉 Esercizio Completato!</h1>
              <Badge variant="outline" className="border-green-500 text-green-500 mb-6">
                Modulo 1.3: Iterazione e Miglioramento dei Prompt
              </Badge>
              
              <div className="bg-green-900/20 border border-green-700/40 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-green-300 mb-4">🎯 Hai imparato che:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />Un primo prompt raramente è sufficiente</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />L'iterazione è la chiave del successo</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />La specificità migliora drasticamente i risultati</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" />Il contesto è fondamentale per prompt efficaci</li>
                </ul>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-slate-600 text-white hover:bg-slate-700/50">
                  <Home className="mr-2 h-4 w-4" />Torna alla Dashboard
                </Button>
                <Button onClick={() => navigate('/prompting')} className="bg-blue-600 hover:bg-blue-700">
                  Prosegui il Corso <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      <CourseSidebar 
        currentModuleId="1.3"
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {currentPhase === 'intro' && renderIntro()}
        {currentPhase === 'phase1' && renderPhase1()}
        {currentPhase === 'phase2' && renderPhase2()}
        {currentPhase === 'completed' && renderCompleted()}
      </div>
    </div>
  );
};

export default PromptIteration;