
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Play, Download, BarChart3, Zap } from 'lucide-react';

const TestImplementation: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [showResult, setShowResult] = useState(false);

  const testScenarios = [
    {
      id: 'refund',
      title: 'Richiesta Rimborso',
      email: 'Ciao, ho ordinato una maglietta la settimana scorsa ma è arrivata della taglia sbagliata. Voglio il rimborso immediato!',
      difficulty: 'Medio'
    },
    {
      id: 'technical',
      title: 'Problema Tecnico',
      email: 'Il vostro sito non funziona, non riesco a loggarmi da 3 giorni. Questo è inaccettabile!',
      difficulty: 'Alto'
    },
    {
      id: 'info',
      title: 'Richiesta Info',
      email: 'Salve, vorrei sapere se avete disponibilità della giacca blu in taglia M. Grazie!',
      difficulty: 'Basso'
    }
  ];

  const aiResponse = `Gentile Cliente,

Comprendo perfettamente la sua frustrazione per aver ricevuto una taglia sbagliata. Mi scuso per l'inconveniente.

SOLUZIONE IMMEDIATA:
1. Le invierò ora l'etichetta di reso gratuito via email
2. Appena riceviamo il prodotto (2-3 giorni), procederemo con il rimborso completo
3. Rimborso elaborato entro 3-5 giorni lavorativi

Per velocizzare il processo, può anche scegliere il cambio taglia diretto - spedizione express gratuita.

Resto a disposizione per qualsiasi chiarimento.

Cordiali saluti,
Team Customer Service`;

  const benefits = [
    { title: 'Riduzione 70% tempo risposta', value: 'Da 48h a 14h' },
    { title: 'Consistenza qualità', value: '95% soddisfazione' },
    { title: 'Scala automatica', value: '500+ email/giorno' },
    { title: 'Team focus su casi complessi', value: '+60% produttività' }
  ];

  const implementation = [
    'Integra prompt nel sistema email aziendale',
    'Configura automazione per email standard (80% casi)',
    'Imposta escalation automatica per casi complessi',
    'Monitora performance e ottimizza continuamente'
  ];

  const runTest = () => {
    setShowResult(true);
  };

  return (
    <div className="space-y-6">
      {/* Testing Playground */}
      <Card className="bg-slate-800/40 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Play className="w-5 h-5 text-green-500" />
            Testing Playground - Prova il Tuo Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="test">Test Scenari</TabsTrigger>
              <TabsTrigger value="results">Risultati & Metriche</TabsTrigger>
            </TabsList>
            
            <TabsContent value="test" className="space-y-4">
              <h4 className="font-semibold text-blue-300">Scegli uno scenario per testare il prompt:</h4>
              
              <div className="grid gap-3">
                {testScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-150 ${
                      selectedScenario === scenario.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/20 bg-slate-700/30 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white">{scenario.title}</h5>
                      <Badge 
                        variant={scenario.difficulty === 'Alto' ? 'destructive' : scenario.difficulty === 'Medio' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm italic">"{scenario.email}"</p>
                  </div>
                ))}
              </div>

              {selectedScenario && (
                <div className="space-y-4">
                  <Button 
                    onClick={runTest}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Esegui Test con AI
                  </Button>

                  {showResult && (
                    <div className="bg-slate-900/60 border border-green-500/30 rounded-lg p-4">
                      <h5 className="font-semibold text-green-300 mb-3">📧 Risposta AI Generata:</h5>
                      <div className="bg-slate-800 p-4 rounded text-sm text-slate-200 whitespace-pre-line">
                        {aiResponse}
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Badge className="bg-green-600">Tempo: 2.3s</Badge>
                        <Badge className="bg-blue-600">Tono: ✓ Professionale</Badge>
                        <Badge className="bg-purple-600">Struttura: ✓ Completa</Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results">
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-slate-700/40 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{benefit.title}</h4>
                        <p className="text-green-300 text-xs mt-1">{benefit.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card className="bg-slate-800/40 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Implementazione Pratica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {implementation.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-slate-200">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Scarica Template Prompt
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-slate-700/50 border-white/20 text-slate-200">
              <Play className="w-4 h-4" />
              Demo Live
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completion */}
      <Card className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border-green-500/30">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Complimenti! 🎉
          </h3>
          <p className="text-slate-300 mb-4">
            Hai masterizzato il Prompt Engineering per automazione email
          </p>
          <Badge className="bg-green-600 text-white px-4 py-2">
            Certificato: AI Email Automation Expert
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestImplementation;
