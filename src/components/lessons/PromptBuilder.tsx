
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';

const PromptBuilder: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<'bad' | 'good'>('bad');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const badPrompt = `Rispondi alle email dei clienti.`;

  const goodPrompt = `Sei un assistente AI per il customer service di TechCorp Inc.

CONTESTO: Azienda tecnologica che vende software per PMI
TONO: Professionale, empatico, orientato alla soluzione
OBIETTIVO: Risolvere problemi clienti o indirizzare al team giusto

ISTRUZIONI:
1. Inizia sempre con un saluto personalizzato
2. Riconosci il problema specifico del cliente
3. Fornisci una soluzione chiara e actionable
4. Se non puoi risolvere, indica i prossimi passi
5. Concludi con offerta di assistenza aggiuntiva

ESEMPI DI TONO:
- "Comprendo la sua frustrazione..."
- "Sono qui per aiutarla a risolvere..."
- "Le propongo questa soluzione..."

LIMITI: Non promettere rimborsi oltre i termini di servizio`;

  const promptSteps = [
    {
      id: 1,
      title: 'Contesto e Ruolo',
      description: 'Chi è l\'AI e in che contesto opera',
      example: 'Sei un assistente AI per il customer service di TechCorp Inc.'
    },
    {
      id: 2,
      title: 'Tono e Personalità',
      description: 'Come deve comunicare l\'AI',
      example: 'TONO: Professionale, empatico, orientato alla soluzione'
    },
    {
      id: 3,
      title: 'Istruzioni Specifiche',
      description: 'Passi concreti da seguire',
      example: '1. Saluto personalizzato\n2. Riconosci il problema\n3. Fornisci soluzione'
    },
    {
      id: 4,
      title: 'Esempi e Limiti',
      description: 'Modelli di comportamento e restrizioni',
      example: 'ESEMPI: "Comprendo la sua frustrazione..."\nLIMITI: No rimborsi oltre termini'
    }
  ];

  const markStepCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bad vs Good Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Confronto: Prompt Inefficace vs Efficace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedExample} onValueChange={(value) => setSelectedExample(value as 'bad' | 'good')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bad" className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Prompt Sbagliato
              </TabsTrigger>
              <TabsTrigger value="good" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Prompt Corretto
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bad" className="mt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Prompt Inefficace</h4>
                    <Badge variant="destructive" className="mt-1">Troppo Generico</Badge>
                  </div>
                </div>
                
                <div className="bg-white/80 p-3 rounded border font-mono text-sm text-gray-800 mb-3">
                  {badPrompt}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span>Nessun contesto aziendale</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span>Tono non specificato</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span>Nessuna struttura di risposta</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-4 h-4" />
                    <span>Nessun limite o guardrail</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="good" className="mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Prompt Efficace</h4>
                    <Badge variant="default" className="mt-1 bg-green-600">Strutturato e Specifico</Badge>
                  </div>
                </div>
                
                <div className="bg-white/80 p-3 rounded border font-mono text-xs text-gray-800 mb-3 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{goodPrompt}</pre>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Contesto aziendale chiaro</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Tono e personalità definiti</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Istruzioni step-by-step</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Esempi e limiti chiari</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Step-by-Step Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Costruisci il Tuo Prompt - Step by Step</CardTitle>
          <p className="text-gray-600">Segui questi 4 passaggi per creare prompt efficaci</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promptSteps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4 transition-all duration-100">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-100 ${
                    completedSteps.includes(step.id) 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {completedSteps.includes(step.id) ? '✓' : step.id}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                      <div className="text-xs text-blue-600 font-medium mb-1">ESEMPIO:</div>
                      <div className="text-sm text-blue-800 font-mono whitespace-pre-wrap">
                        {step.example}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => markStepCompleted(step.id)}
                      disabled={completedSteps.includes(step.id)}
                      size="sm"
                      variant={completedSteps.includes(step.id) ? "default" : "outline"}
                      className="transition-all duration-100"
                    >
                      {completedSteps.includes(step.id) ? 'Completato' : 'Segna come Completato'}
                    </Button>
                  </div>
                </div>
                
                {index < promptSteps.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {completedSteps.length === 4 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Ottimo lavoro!</h4>
                  <p className="text-green-700 text-sm">
                    Hai completato tutti i passaggi per costruire prompt efficaci. 
                    Ora puoi procedere all'implementazione pratica.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptBuilder;
