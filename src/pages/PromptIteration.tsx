import React, { useState } from 'react';
import { Home, Bot, Send, MessageCircle, CheckCircle, ArrowRight, User, Loader2, RefreshCw, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Modulo 1.3: Iterazione e Miglioramento dei Prompt
        </h1>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <p className="text-lg mb-4">
            In questo esercizio imparerai che un prompt spesso non è sufficiente e che il valore si genera tramite <strong>prompt engineering iterativo</strong>.
          </p>
          <p className="mb-6">
            L'esercizio è diviso in due fasi:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🟢 Fase 1: Simulazione Guidata</h3>
              <p className="text-sm">Apprendimento sicuro con esempi controllati</p>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🟡 Fase 2: Pratica Autonoma</h3>
              <p className="text-sm">Learn by doing con API reale</p>
            </div>
          </div>
          <Button 
            onClick={() => handlePhaseChange('phase1')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
          >
            Inizia l'Esercizio
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPhase1 = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">Fase 1: Simulazione Guidata</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 1 - Introduzione</h2>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-400 mb-2">Attenzione!</h3>
                        <p className="text-sm">
                          In questo esercizio simulerai l'uso di ChatGPT per scrivere una mail di follow-up commerciale. 
                          Il primo prompt che vedrai genera un output <strong>volutamente sbagliato</strong>. 
                          Il tuo compito sarà capirne i limiti e correggerlo.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-6">
                    Questo ti aiuterà a comprendere che:
                  </p>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Un prompt spesso non è sufficiente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      L'output può essere insoddisfacente per motivi prevedibili
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Il valore si genera tramite iterazione e affinamento
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Procedi al Mockup ChatGPT
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">Fase 1: Simulazione Guidata</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 2 - Mockup ChatGPT</h2>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Simulazione ChatGPT
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-4 max-w-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Tu</span>
                      </div>
                      <p>{mockupData.initialPrompt}</p>
                    </div>
                  </div>
                  
                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-600 text-white rounded-lg p-4 max-w-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-sm font-medium">ChatGPT</span>
                      </div>
                      <div className="text-sm whitespace-pre-line">{mockupData.badOutput}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-white mb-4">
                    Leggi attentamente l'output generato. Questa è una risposta <strong>volutamente problematica</strong>.
                  </p>
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Analizza i Problemi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">Fase 1: Simulazione Guidata</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 3 - Identificazione Problemi</h2>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-4">Cosa c'è che non va in questa risposta?</h3>
                  <p className="mb-6 text-gray-300">Seleziona una o più criticità che hai identificato:</p>
                  
                  <div className="space-y-3 mb-8">
                    {issues.map((issue, index) => (
                      <label key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedIssues.includes(issue)}
                          onChange={() => handleIssueToggle(issue)}
                          className="w-4 h-4"
                        />
                        <span>{issue}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2">💡 Concetto Chiave: Refining Prompt</h4>
                    <p className="text-sm">
                      Ora dovrai scrivere un prompt migliorato che risolva questi problemi. 
                      Un buon prompt deve essere <strong>specifico, contestuale e orientato all'azione</strong>.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Scrivi un prompt migliorato:</label>
                    <Textarea
                      value={improvedPrompt}
                      onChange={(e) => setImprovedPrompt(e.target.value)}
                      placeholder="Es: Scrivi una mail di follow-up più concisa, in tono informale che faccia riferimento al nostro precedente incontro..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={selectedIssues.length === 0 || !improvedPrompt.trim()}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    Vedi il Risultato Migliorato
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">Fase 1: Simulazione Guidata</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 4 - Output Migliorato</h2>
            </div>
            
            <div className="grid gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Prompt Migliorato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-600 text-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Il tuo prompt migliorato</span>
                    </div>
                    <p className="text-sm">{mockupData.improvedPrompt}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Output ChatGPT Migliorato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-600 text-white rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-sm font-medium">ChatGPT</span>
                    </div>
                    <div className="text-sm whitespace-pre-line">{mockupData.goodOutput}</div>
                  </div>
                  
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-3">✅ Miglioramenti Ottenuti:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Tono più diretto e informale</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Riferimento specifico al precedente incontro</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Messaggio più conciso e focalizzato</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span>Call-to-action chiara e specifica</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-white mb-6">
                Eccellente! Questo è il risultato di un prompt più specifico e contestuale. 
                Ora passiamo alla fase pratica con l'IA reale.
              </p>
              <Button 
                onClick={() => handlePhaseChange('phase2')}
                className="bg-primary hover:bg-primary/90 px-8 py-3"
              >
                Procedi alla Fase 2
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPhase2 = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 border-yellow-500 text-yellow-500">Fase 2: Pratica Autonoma</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 5 - Nuovo Scenario Reale</h2>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-white">
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-yellow-400 mb-2">🎯 Nuova Sfida Pratica</h3>
                    <h4 className="font-medium mb-2">{phase2Scenario.title}</h4>
                    <p className="text-sm mb-4">{phase2Scenario.description}</p>
                    <div className="bg-black/20 rounded p-3">
                      <p className="text-xs text-gray-300 mb-1">Descrizione attuale:</p>
                      <p className="text-sm italic">"{phase2Scenario.initialDescription}"</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-2">🔄 Come Funziona:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Scrivi un prompt nell'area sottostante</li>
                      <li>• Ricevi una risposta reale dall'IA</li>
                      <li>• Valuta il risultato e itera (minimo 1 volta)</li>
                      <li>• I tuoi prompt vengono salvati nella cronologia</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Inizia l'Esercizio Pratico
                    <Target className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 border-yellow-500 text-yellow-500">Fase 2: Pratica Autonoma</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 6 - Iterazione Libera</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main chat area */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      IA Reale - ChatGPT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Chat history */}
                    <div className="h-64 overflow-y-auto bg-black/20 rounded-lg p-4 mb-4 space-y-4">
                      {promptHistory.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Inizia scrivendo il tuo primo prompt...</p>
                        </div>
                      ) : (
                        promptHistory.map((entry, index) => (
                          <div key={index} className="space-y-3">
                            <div className="flex justify-end">
                              <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                                <div className="flex items-center gap-2 mb-1">
                                  <User className="h-3 w-3" />
                                  <span className="text-xs">Prompt {index + 1}</span>
                                </div>
                                <p className="text-sm">{entry.prompt}</p>
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="bg-gray-600 text-white rounded-lg p-3 max-w-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Bot className="h-3 w-3" />
                                  <span className="text-xs">IA</span>
                                </div>
                                <p className="text-sm whitespace-pre-line">{entry.response}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Input area */}
                    <div className="space-y-3">
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Scrivi qui il tuo prompt per migliorare la descrizione del prodotto..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleApiPrompt}
                          disabled={isLoading || !userInput.trim()}
                          className="bg-primary hover:bg-primary/90 flex-1"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Invia Prompt
                        </Button>
                        {promptHistory.length > 0 && (
                          <Button 
                            onClick={() => setCurrentStep(2)}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Completa Esercizio
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar with history */}
              <div className="lg:col-span-1">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Cronologia Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {promptHistory.length === 0 ? (
                      <p className="text-gray-400 text-sm">Nessun prompt ancora inviato</p>
                    ) : (
                      <div className="space-y-3">
                        {promptHistory.map((entry, index) => (
                          <div key={index} className="bg-black/20 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                Prompt {index + 1}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-300 truncate">{entry.prompt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {promptHistory.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/20">
                        <div className="bg-green-500/20 rounded p-3">
                          <p className="text-xs text-green-400 font-medium">
                            ✅ Obiettivo raggiunto!
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            Hai iterato almeno una volta. Ora puoi completare l'esercizio.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-4">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Suggerimenti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-xs text-gray-300">
                      <p>• Sii specifico sui miglioramenti desiderati</p>
                      <p>• Indica il target di audience</p>
                      <p>• Specifica il tono di voce preferito</p>
                      <p>• Chiedi elementi specifici (benefici, features)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4 border-yellow-500 text-yellow-500">Fase 2: Pratica Autonoma</Badge>
              <h2 className="text-2xl font-bold text-white mb-4">Step 7 - Riflessione Finale</h2>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-4">Rifletti sulla tua esperienza</h3>
                  <p className="text-gray-300 mb-6">
                    Completa questa riflessione per consolidare l'apprendimento:
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Qual è stato l'errore del primo prompt? Cosa hai cambiato per migliorarlo?
                      </label>
                      <Textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Es: Il primo prompt era troppo generico e non specificava il target audience. Nel secondo ho aggiunto dettagli sul pubblico di riferimento e il tono di voce desiderato..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        rows={5}
                      />
                    </div>
                    
                    <div className="bg-blue-500/20 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">📊 Il tuo Progress:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Prompt inviati:</span>
                          <span className="font-medium">{promptHistory.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Iterazioni completate:</span>
                          <span className="font-medium">{Math.max(0, promptHistory.length - 1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-medium text-green-400">
                            {promptHistory.length > 1 ? "Obiettivo raggiunto!" : "Serve almeno 1 iterazione"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button 
                      onClick={handleCompletion}
                      disabled={!reflection.trim() || promptHistory.length < 2}
                      className="bg-primary hover:bg-primary/90 w-full py-3"
                    >
                      Completa l'Esercizio
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderCompleted = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-8 mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">🎉 Esercizio Completato!</h1>
          <Badge variant="outline" className="border-green-500 text-green-500 mb-4">
            Modulo 1.3: Iterazione e Miglioramento dei Prompt
          </Badge>
          
          <div className="bg-white/10 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-white mb-3">🎯 Hai imparato che:</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Un primo prompt raramente è sufficiente</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>L'iterazione è la chiave del successo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>La specificità migliora drasticamente i risultati</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Il contesto è fondamentale per prompt efficaci</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Home className="mr-2 h-4 w-4" />
            Torna alla Dashboard
          </Button>
          <Button 
            onClick={() => navigate('/prompting-course')}
            className="bg-primary hover:bg-primary/90"
          >
            Prosegui il Corso
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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