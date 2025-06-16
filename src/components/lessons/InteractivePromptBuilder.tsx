
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Lightbulb, Edit3, Play } from 'lucide-react';

const InteractivePromptBuilder: React.FC = () => {
  const [selectedComponents, setSelectedComponents] = useState({
    role: '',
    context: '',
    task: '',
    tone: '',
    output: ''
  });
  
  const [builtPrompt, setBuiltPrompt] = useState('');
  const [currentBuildStep, setCurrentBuildStep] = useState(1);

  const roleOptions = [
    { id: 'customer-service', label: 'Customer Service Expert', value: 'Sei un assistente customer service professionale' },
    { id: 'technical', label: 'Technical Support', value: 'Sei un esperto di supporto tecnico' },
    { id: 'sales', label: 'Sales Assistant', value: 'Sei un assistente vendite esperto' }
  ];

  const contextOptions = [
    { id: 'ecommerce', label: 'E-commerce', value: 'per azienda e-commerce che vende prodotti lifestyle' },
    { id: 'saas', label: 'Software SaaS', value: 'per azienda SaaS che sviluppa software gestionale' },
    { id: 'finance', label: 'Servizi Finanziari', value: 'per istituto finanziario che offre servizi bancari' }
  ];

  const taskOptions = [
    { id: 'analyze-classify', label: 'Analizza + Classifica', value: 'Analizza email, classifica urgenza (1-5)' },
    { id: 'generate-response', label: 'Genera Risposta', value: 'genera risposta appropriata e professionale' },
    { id: 'escalate', label: 'Escalate se necessario', value: 'escalate a team umano se richiesto' }
  ];

  const toneOptions = [
    { id: 'professional', label: 'Professionale', value: 'tono professionale e cortese' },
    { id: 'empathetic', label: 'Empatico', value: 'tono empatico e comprensivo' },
    { id: 'friendly', label: 'Amichevole', value: 'tono amichevole e disponibile' }
  ];

  const outputOptions = [
    { id: 'structured', label: 'Strutturata', value: 'Formato: Saluto + Riconoscimento + Soluzione + Timeline + Chiusura' },
    { id: 'concise', label: 'Concisa', value: 'Risposta concisa max 100 parole' },
    { id: 'detailed', label: 'Dettagliata', value: 'Risposta dettagliata con esempi pratici' }
  ];

  const updatePrompt = () => {
    const parts = [];
    if (selectedComponents.role) parts.push(selectedComponents.role);
    if (selectedComponents.context) parts.push(selectedComponents.context);
    if (selectedComponents.task) parts.push(selectedComponents.task);
    if (selectedComponents.tone) parts.push(selectedComponents.tone);
    if (selectedComponents.output) parts.push(selectedComponents.output);
    
    setBuiltPrompt(parts.join(', ') + '.');
  };

  const selectComponent = (type: keyof typeof selectedComponents, value: string) => {
    setSelectedComponents(prev => ({ ...prev, [type]: value }));
    setTimeout(updatePrompt, 100);
  };

  const badPrompt = "Rispondi alle email dei clienti.";
  const goodPrompt = `Sei un assistente customer service professionale per azienda e-commerce che vende prodotti lifestyle. 

TASK: Analizza email del cliente, classifica urgenza (1-5), genera risposta appropriata
TONE: Empatico ma professionale, max 150 parole
OUTPUT: Saluto personalizzato + Riconoscimento problema + Soluzione + Timeline + Chiusura cortese

ESEMPI:
- "Comprendo la sua frustrazione..."
- "Sono qui per aiutarla a risolvere..."
LIMITI: Non promettere rimborsi oltre policy aziendale`;

  return (
    <div className="space-y-6">
      {/* Bad vs Good Examples */}
      <Card className="bg-slate-800/40 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Confronto: Prompt Inefficace vs Efficace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bad" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="bad" className="flex items-center gap-2 data-[state=active]:bg-red-500/20">
                <XCircle className="w-4 h-4 text-red-400" />
                Prompt Sbagliato
              </TabsTrigger>
              <TabsTrigger value="good" className="flex items-center gap-2 data-[state=active]:bg-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Prompt Corretto
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bad" className="mt-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="bg-slate-800 p-3 rounded border font-mono text-sm text-red-200 mb-3">
                  {badPrompt}
                </div>
                <div className="space-y-1 text-sm text-red-300">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>Troppo generico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>Nessun contesto</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="good" className="mt-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="bg-slate-800 p-3 rounded border font-mono text-xs text-green-200 mb-3 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{goodPrompt}</pre>
                </div>
                <div className="space-y-1 text-sm text-green-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Ruolo definito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Istruzioni specifiche</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Interactive Prompt Builder */}
      <Card className="bg-slate-800/40 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">🎯 Costruisci il Tuo Prompt - Interattivo</CardTitle>
          <p className="text-slate-300">Seleziona i componenti per costruire il prompt perfetto</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: Role */}
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-300">1. Definisci il Ruolo AI</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roleOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedComponents.role === option.value ? "default" : "outline"}
                  onClick={() => selectComponent('role', option.value)}
                  className={`h-auto p-3 text-left ${
                    selectedComponents.role === option.value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700/50 border-white/20 text-slate-200 hover:bg-slate-600/50'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Step 2: Context */}
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-300">2. Aggiungi Contesto Business</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contextOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedComponents.context === option.value ? "default" : "outline"}
                  onClick={() => selectComponent('context', option.value)}
                  className={`h-auto p-3 text-left ${
                    selectedComponents.context === option.value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700/50 border-white/20 text-slate-200 hover:bg-slate-600/50'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Step 3: Task */}
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-300">3. Specifica il Task</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {taskOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedComponents.task === option.value ? "default" : "outline"}
                  onClick={() => selectComponent('task', option.value)}
                  className={`h-auto p-3 text-left ${
                    selectedComponents.task === option.value 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700/50 border-white/20 text-slate-200 hover:bg-slate-600/50'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Live Prompt Preview */}
          <div className="bg-slate-900/60 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-blue-300">Il Tuo Prompt Live:</h4>
            </div>
            <div className="bg-slate-800 p-3 rounded font-mono text-sm text-blue-200 min-h-16">
              {builtPrompt || 'Seleziona i componenti sopra per costruire il tuo prompt...'}
            </div>
            {builtPrompt && (
              <Button className="mt-3 bg-green-600 hover:bg-green-700" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Testa questo Prompt
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default InteractivePromptBuilder;
