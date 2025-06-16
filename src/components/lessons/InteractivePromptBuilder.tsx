
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Edit3, Play } from 'lucide-react';

const InteractivePromptBuilder: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<'bad' | 'good'>('bad');
  const [builtPrompt, setBuiltPrompt] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [stepInputs, setStepInputs] = useState({
    role: '',
    context: '',
    task: '',
    tone: '',
    format: ''
  });

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
      title: 'Ruolo e Identità',
      description: 'Definisci chi è l\'AI e il suo ruolo',
      placeholder: 'Es: Sei un assistente customer service per...',
      key: 'role' as keyof typeof stepInputs
    },
    {
      id: 2,
      title: 'Contesto Aziendale',
      description: 'Aggiungi il background e la situazione',
      placeholder: 'Es: Azienda e-commerce specializzata in...',
      key: 'context' as keyof typeof stepInputs
    },
    {
      id: 3,
      title: 'Task Specifico',
      description: 'Cosa deve fare esattamente l\'AI',
      placeholder: 'Es: Analizza email, classifica urgenza, genera risposta...',
      key: 'task' as keyof typeof stepInputs
    },
    {
      id: 4,
      title: 'Tono e Stile',
      description: 'Come deve comunicare',
      placeholder: 'Es: Professionale, empatico, diretto...',
      key: 'tone' as keyof typeof stepInputs
    },
    {
      id: 5,
      title: 'Formato Output',
      description: 'Struttura della risposta',
      placeholder: 'Es: Saluto + Problema + Soluzione + Chiusura',
      key: 'format' as keyof typeof stepInputs
    }
  ];

  const updateStepInput = (key: keyof typeof stepInputs, value: string) => {
    const newInputs = { ...stepInputs, [key]: value };
    setStepInputs(newInputs);
    
    // Rebuild prompt in real-time
    let prompt = '';
    if (newInputs.role) prompt += `${newInputs.role}\n\n`;
    if (newInputs.context) prompt += `CONTESTO: ${newInputs.context}\n`;
    if (newInputs.tone) prompt += `TONO: ${newInputs.tone}\n`;
    if (newInputs.task) prompt += `TASK: ${newInputs.task}\n`;
    if (newInputs.format) prompt += `FORMATO: ${newInputs.format}`;
    
    setBuiltPrompt(prompt);
  };

  const nextStep = () => {
    if (currentStep < promptSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Bad vs Good Examples */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            Confronto: Prompt Inefficace vs Efficace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedExample} onValueChange={(value) => setSelectedExample(value as 'bad' | 'good')}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="bad" className="flex items-center gap-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-200">
                <XCircle className="w-4 h-4" />
                Prompt Sbagliato
              </TabsTrigger>
              <TabsTrigger value="good" className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-200">
                <CheckCircle className="w-4 h-4" />
                Prompt Corretto
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bad" className="mt-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-200">Prompt Inefficace</h4>
                    <Badge variant="destructive" className="mt-2 bg-red-500/20 text-red-200 border-red-400/30">
                      Troppo Generico
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-slate-900/60 border border-red-400/30 p-4 rounded font-mono text-sm text-red-100 mb-4">
                  {badPrompt}
                </div>
                
                <div className="space-y-2 text-sm">
                  {[
                    'Nessun contesto aziendale',
                    'Tono non specificato',
                    'Nessuna struttura di risposta',
                    'Nessun limite o guardrail'
                  ].map((issue, index) => (
                    <div key={index} className="flex items-center gap-2 text-red-200">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="good" className="mt-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-200">Prompt Efficace</h4>
                    <Badge className="mt-2 bg-green-500/20 text-green-200 border-green-400/30">
                      Strutturato e Specifico
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-slate-900/60 border border-green-400/30 p-4 rounded font-mono text-xs text-green-100 mb-4 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{goodPrompt}</pre>
                </div>
                
                <div className="space-y-2 text-sm">
                  {[
                    'Contesto aziendale chiaro',
                    'Tono e personalità definiti',
                    'Istruzioni step-by-step',
                    'Esempi e limiti chiari'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-green-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Interactive Prompt Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Builder Steps */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">🔧 Costruisci il Tuo Prompt</CardTitle>
            <p className="text-slate-300">Completa ogni step per creare un prompt efficace</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {promptSteps.map((step) => (
                <div 
                  key={step.id} 
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    currentStep >= step.id 
                      ? 'border-blue-400/50 bg-blue-900/20' 
                      : 'border-slate-600/50 bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                      stepInputs[step.key] 
                        ? 'bg-green-500 text-white' 
                        : currentStep === step.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}>
                      {stepInputs[step.key] ? '✓' : step.id}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-slate-300 text-sm mb-3">{step.description}</p>
                      
                      <textarea
                        placeholder={step.placeholder}
                        value={stepInputs[step.key]}
                        onChange={(e) => updateStepInput(step.key, e.target.value)}
                        className="w-full h-20 p-3 bg-slate-900/60 border border-slate-600/50 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                onClick={nextStep}
                disabled={currentStep >= promptSteps.length}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Step Successivo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-slate-800/40 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Edit3 className="w-5 h-5 text-blue-400" />
              Anteprima Live del Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-blue-400/30 rounded-lg p-4 min-h-48">
                <div className="text-xs text-blue-300 font-medium mb-2">IL TUO PROMPT:</div>
                {builtPrompt ? (
                  <pre className="text-sm text-blue-100 whitespace-pre-wrap font-mono">
                    {builtPrompt}
                  </pre>
                ) : (
                  <div className="text-slate-400 text-sm italic">
                    Inizia a compilare gli step per vedere il prompt costruirsi in tempo reale...
                  </div>
                )}
              </div>
              
              {builtPrompt && (
                <div className="space-y-3">
                  <div className="text-sm text-slate-300">
                    <strong className="text-white">Qualità Prompt:</strong>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, Object.values(stepInputs).filter(v => v.length > 10).length * 20)}%` 
                          }}
                        />
                      </div>
                      <span className="text-white font-medium">
                        {Object.values(stepInputs).filter(v => v.length > 10).length * 20}%
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Testa il Prompt
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractivePromptBuilder;
