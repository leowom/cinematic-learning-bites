
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

const TestImplementation: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState('refund');
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const testScenarios = [
    {
      id: 'refund',
      title: 'Richiesta Rimborso',
      description: 'Cliente insoddisfatto chiede rimborso',
      customerEmail: `Oggetto: RIMBORSO IMMEDIATO!!!

Salve,
sono MOLTO arrabbiato! Ho comprato il vostro software 3 giorni fa e non funziona per niente. Voglio il rimborso SUBITO o chiamo il mio avvocato!
Questa è una TRUFFA!

Marco Rossi`,
      difficulty: 'Alta',
      expectedOutcome: 'Risposta empatica, verifica problema, processo rimborso se giustificato'
    },
    {
      id: 'technical',
      title: 'Problema Tecnico',
      description: 'Supporto per bug del software',
      customerEmail: `Oggetto: Software si blocca continuamente

Buongiorno,
da ieri il software si blocca ogni volta che provo a esportare i report. Ho provato a riavviare ma il problema persiste. 
Potete aiutarmi? Ho una presentazione importante domani.

Grazie,
Laura Bianchi`,
      difficulty: 'Media',
      expectedOutcome: 'Troubleshooting step-by-step, escalation se necessario'
    },
    {
      id: 'information',
      title: 'Richiesta Informazioni',
      description: 'Cliente chiede dettagli sui piani',
      customerEmail: `Oggetto: Informazioni sui piani Enterprise

Gentili,
sono interessato al piano Enterprise. Potreste inviarmi maggiori dettagli sui prezzi e le funzionalità incluse?
Siamo un'azienda di 50 dipendenti.

Cordiali saluti,
Andrea Verdi`,
      difficulty: 'Bassa',
      expectedOutcome: 'Informazioni dettagliate, offerta personalizzata'
    }
  ];

  const simulateAIResponse = async (scenario: string) => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = {
      refund: `Gentile Sig. Rossi,

Comprendo la sua frustrazione e mi scuso per l'esperienza negativa con il nostro software.

ANALISI DEL PROBLEMA:
Ho verificato il suo account e vedo che ha acquistato il software 3 giorni fa. Per aiutarla al meglio, vorrei capire:
- Quale errore specifico riscontra?
- Su che sistema operativo sta utilizzando il software?

SOLUZIONE IMMEDIATA:
1. Le invio subito la guida di troubleshooting veloce
2. Se il problema persiste, organizziamo una call di supporto entro 24h
3. Se non risolviamo, procederemo con il rimborso completo

La ricontatterò entro 2 ore con un aggiornamento.

Cordiali saluti,
Team Customer Service TechCorp`,
      
      technical: `Gentile Laura,

Grazie per aver segnalato questo problema. Capisco l'urgenza vista la sua presentazione di domani.

TROUBLESHOOTING IMMEDIATO:
1. Scarichi l'ultimo aggiornamento (v.2.1.3) dal suo account
2. Svuoti la cache: Impostazioni > Avanzate > Cancella Cache
3. Provi l'export con file più piccoli

SUPPORTO PRIORITARIO:
Ho escalato il suo caso al team tecnico con priorità ALTA. Le garantisco una soluzione entro stasera.

Nel frattempo, può utilizzare l'export in PDF come workaround temporaneo.

Le scrivo aggiornamenti ogni 2 ore.

Team Support TechCorp`,
      
      information: `Gentile Andrea,

Grazie per l'interesse verso TechCorp Enterprise!

PIANO ENTERPRISE - PERFETTO PER 50 DIPENDENTI:
✅ Utenti illimitati
✅ Dashboard analytics avanzate  
✅ Integrazioni API personalizzate
✅ Support dedicato 24/7
✅ Training team gratuito

PREZZO SPECIALE: €2.400/anno (invece di €3.000)
INCLUSO: Setup gratuito + 3 mesi extra

Le invio subito:
- Brochure dettagliata
- Demo personalizzata (disponibile questa settimana)
- Preventivo ufficiale

Quando può per una call di 30 minuti?

Cordialmente,
Sales Team TechCorp`
    };
    
    setTestResults(prev => ({ ...prev, [scenario]: responses[scenario as keyof typeof responses] }));
    setIsGenerating(false);
  };

  const resetTest = () => {
    setTestResults({});
  };

  return (
    <div className="space-y-8">
      {/* Test Scenarios */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Play className="w-6 h-6 text-green-400" />
            Test del Prompt - Scenari Reali
          </CardTitle>
          <p className="text-slate-300">Testa il tuo prompt su diversi tipi di email clienti</p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              {testScenarios.map((scenario) => (
                <TabsTrigger 
                  key={scenario.id} 
                  value={scenario.id}
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-200"
                >
                  {scenario.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {testScenarios.map((scenario) => (
              <TabsContent key={scenario.id} value={scenario.id} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Email */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">{scenario.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${
                          scenario.difficulty === 'Alta' ? 'border-red-400/50 text-red-200 bg-red-900/20' :
                          scenario.difficulty === 'Media' ? 'border-yellow-400/50 text-yellow-200 bg-yellow-900/20' :
                          'border-green-400/50 text-green-200 bg-green-900/20'
                        }`}
                      >
                        Difficoltà: {scenario.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm">{scenario.description}</p>
                    
                    <div className="bg-slate-900/60 border border-slate-600/50 rounded-lg p-4">
                      <div className="text-xs text-slate-400 mb-2">EMAIL CLIENTE:</div>
                      <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono">
                        {scenario.customerEmail}
                      </pre>
                    </div>
                    
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-xs text-blue-300 font-medium">OBIETTIVO:</div>
                          <div className="text-sm text-blue-200">{scenario.expectedOutcome}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">Risposta AI</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => simulateAIResponse(scenario.id)}
                          disabled={isGenerating}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Generando...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Testa
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={resetTest}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/60 border border-green-400/30 rounded-lg p-4 min-h-80">
                      {testResults[scenario.id] ? (
                        <>
                          <div className="text-xs text-green-300 mb-2">RISPOSTA GENERATA:</div>
                          <pre className="text-sm text-green-100 whitespace-pre-wrap">
                            {testResults[scenario.id]}
                          </pre>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                          Clicca "Testa" per vedere la risposta AI
                        </div>
                      )}
                    </div>
                    
                    {testResults[scenario.id] && (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-green-900/20 border border-green-500/30 rounded p-2 text-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
                          <div className="text-green-200">Tono Appropriato</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-500/30 rounded p-2 text-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
                          <div className="text-green-200">Struttura Corretta</div>
                        </div>
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2 text-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                          <div className="text-yellow-200">Migliorabile</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      {Object.keys(testResults).length > 0 && (
        <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">📊 Analisi delle Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-200">85%</div>
                <div className="text-sm text-blue-300">Qualità Risposta</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-200">2.3s</div>
                <div className="text-sm text-green-300">Tempo Risposta</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-200">92%</div>
                <div className="text-sm text-purple-300">Soddisfazione Cliente</div>
              </div>
            </div>
            
            <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-200 mb-2">Ottimo lavoro! 🎉</h4>
                  <p className="text-green-100 text-sm">
                    Il tuo prompt gestisce bene diversi scenari. Con queste competenze puoi 
                    automatizzare il 70% delle email customer service mantenendo alta qualità.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestImplementation;
