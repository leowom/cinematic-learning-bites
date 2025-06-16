import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOpenAI } from '@/hooks/useOpenAI';
import APIKeyModal from './APIKeyModal';
import { Settings, Zap, AlertCircle } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

interface TestResult {
  response: string;
  score: number;
  analysis: {
    completeness: number;
    accuracy: number;
    tone: number;
    specificity: number;
    actionability: number;
  };
  feedback: string[];
}

const AITestingStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiKey, saveApiKey, testPromptWithGPT, hasApiKey } = useOpenAI();

  const testCases = [
    {
      id: 'complaint',
      title: 'Reclamo Cliente Arrabbiato',
      email: `Oggetto: ORDINE SBAGLIATO - VOGLIO RIMBORSO

Salve, ho ricevuto oggi l'ordine #12345 ma è completamente sbagliato! Ho ordinato una maglietta rossa taglia M e mi è arrivata una blu taglia L. È la terza volta che succede quest'anno e sono davvero stufo.

Voglio il rimborso immediato, non sostituzione. Ho pagato con carta di credito 45€ + 8€ spedizione.

Marco Bianchi
Cliente dal 2019`,
      expectedElements: ['sentiment negativo', 'urgenza alta', 'richiesta rimborso specifico', 'dettagli ordine', 'storia cliente']
    },
    {
      id: 'inquiry',
      title: 'Richiesta Informazioni Urgente',
      email: `Ciao! Devo fare un regalo per domani e vorrei sapere se riuscite a spedire in giornata l'articolo che ho visto sul vostro sito (codice: TEE-001-R-M).

Sono disposta a pagare spedizione express. Il regalo è per un compleanno importante!

Grazie mille,
Sofia`,
      expectedElements: ['urgenza temporale', 'informazioni prodotto', 'disponibilità spedizione', 'tone positivo']
    }
  ];

  const handleRealAITest = async () => {
    if (!hasApiKey) {
      setShowAPIModal(true);
      return;
    }

    const currentPrompt = generateCurrentPrompt();
    const currentTest = testCases[selectedTestCase];

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Inizio test con GPT-4o...', { prompt: currentPrompt, testCase: currentTest.title });
      
      const result = await testPromptWithGPT(currentPrompt, currentTest);
      
      console.log('✅ Test completato:', result);
      
      setTestResult(result);
      updatePromptData('aiTestScore', result.score);
      
    } catch (error: any) {
      console.error('❌ Errore test AI:', error);
      setError(error.message || 'Errore sconosciuto durante il test AI');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCurrentPrompt = () => {
    let prompt = '';
    
    if (promptData.role) {
      prompt += `Sei un ${promptData.role}`;
      if (promptData.experience) {
        prompt += ` con ${promptData.experience} anni di esperienza`;
      }
      prompt += '.\n\n';
    }
    
    if (promptData.context) {
      prompt += `CONTESTO:\n${promptData.context}\n\n`;
    }
    
    if (promptData.tasks?.length > 0) {
      prompt += 'TASK:\n';
      promptData.tasks.forEach((task: string, index: number) => {
        prompt += `${index + 1}. ${task}\n`;
      });
      prompt += '\n';
    }
    
    if (promptData.tone) {
      prompt += 'CONSTRAINTS:\n';
      prompt += `- Tone: ${promptData.tone.formal > 60 ? 'Professionale' : 'Casual'} ${promptData.tone.empathy > 60 ? 'ed empatico' : 'e diretto'}\n\n`;
    }
    
    if (promptData.outputFormat?.length > 0) {
      prompt += 'OUTPUT FORMAT:\n';
      promptData.outputFormat.forEach((format: string) => {
        prompt += `${format}\n`;
      });
    }
    
    return prompt;
  };

  const currentPrompt = generateCurrentPrompt();
  const currentTest = testCases[selectedTestCase];

  return (
    <div className="step-card glassmorphism-base">
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        🧪 STEP 8/9: Test Reale con GPT-4o
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-white/70 leading-relaxed element-spacing">
            Ora testiamo il tuo prompt con GPT-4o reale! L'AI analizzerà il tuo prompt e genererà una risposta, 
            poi valuterà automaticamente la qualità su 5 criteri specifici.
          </p>

          <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 element-spacing">
            <h3 className="text-green-400 font-medium sub-element-spacing flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              🎯 Test con AI Reale:
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Usiamo GPT-4o per generare la risposta e poi un secondo GPT-4o per analizzare oggettivamente 
              la qualità su completeness, accuracy, tone, specificity e actionability.
            </p>
          </div>

          {/* API Status */}
          <div className={`rounded-lg p-4 border ${
            hasApiKey 
              ? 'bg-green-600/20 border-green-400/30'
              : 'bg-amber-600/20 border-amber-400/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="text-white font-medium">
                  {hasApiKey ? '✅ OpenAI API Configurata' : '⚠️ API Key Richiesta'}
                </span>
              </div>
              <Button
                onClick={() => setShowAPIModal(true)}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {hasApiKey ? 'Modifica' : 'Configura'} API
              </Button>
            </div>
            {!hasApiKey && (
              <p className="text-white/70 text-sm mt-2">
                Configura la tua OpenAI API key per testare con GPT-4o reale
              </p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-medium">Errore Test AI:</h4>
                <p className="text-white/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Test Case Selection */}
        <div className="section-spacing">
          <h3 className="text-white font-medium sub-element-spacing">Seleziona Caso di Test:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testCases.map((testCase, index) => (
              <button
                key={testCase.id}
                onClick={() => setSelectedTestCase(index)}
                className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                  selectedTestCase === index
                    ? 'bg-blue-600/40 border-blue-400/50'
                    : 'bg-slate-800/40 border-white/20 hover:bg-slate-700/60'
                }`}
              >
                <h4 className="text-white font-medium sub-element-spacing">{testCase.title}</h4>
                <p className="text-white/60 text-sm line-clamp-3">{testCase.email.substring(0, 150)}...</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Test Case Display */}
        <div className="section-spacing">
          <h3 className="text-white font-medium sub-element-spacing">📧 Email di Test:</h3>
          <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4">
            <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
              {currentTest.email}
            </pre>
          </div>
        </div>

        {/* Current Prompt Preview */}
        <div className="section-spacing">
          <h3 className="text-white font-medium sub-element-spacing">🎯 Il Tuo Prompt:</h3>
          <div className="bg-slate-800/50 border border-green-400/30 rounded-lg p-4 prompt-preview">
            <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
              {currentPrompt || 'Completa gli step precedenti per vedere il prompt...'}
            </pre>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center section-spacing">
          <Button
            onClick={handleRealAITest}
            disabled={isLoading || !currentPrompt}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-xl font-medium text-lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing con GPT-4o...</span>
              </div>
            ) : !hasApiKey ? (
              '🔑 Configura API per Test Reale'
            ) : (
              '🚀 Testa con GPT-4o Reale'
            )}
          </Button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="space-y-6 section-spacing">
            {/* AI Response */}
            <div>
              <h3 className="text-white font-medium sub-element-spacing">🤖 Risposta AI Generata:</h3>
              <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4 prompt-preview">
                <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                  {testResult.response}
                </pre>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg p-6">
              <div className="flex items-center justify-between sub-element-spacing">
                <h3 className="text-blue-400 font-medium">📊 Analisi Dettagliata:</h3>
                <div className="text-right">
                  <div className="text-white/60 text-xs">Score Finale</div>
                  <div className={`text-2xl font-bold ${
                    testResult.score >= 8 ? 'text-green-400' : 
                    testResult.score >= 6 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {testResult.score}/10
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {Object.entries(testResult.analysis).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-white/70 capitalize">{key}:</span>
                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-700 rounded-full h-2 w-24">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              value >= 80 ? 'bg-green-400' : value >= 60 ? 'bg-amber-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-white/80 font-medium">Feedback Specifico:</h4>
                  <div className="space-y-1">
                    {testResult.feedback.map((item, index) => (
                      <div key={index} className="text-white/70 text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className={`rounded-lg p-4 border ${
              testResult.score >= 8 
                ? 'bg-green-600/20 border-green-400/30'
                : testResult.score >= 6
                ? 'bg-amber-600/20 border-amber-400/30'
                : 'bg-red-600/20 border-red-400/30'
            }`}>
              <h4 className={`font-medium sub-element-spacing ${
                testResult.score >= 8 ? 'text-green-400' : testResult.score >= 6 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {testResult.score >= 8 ? '🎉 Eccellente!' : testResult.score >= 6 ? '👍 Buono!' : '📚 Da Migliorare'}
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {testResult.score >= 8 
                  ? 'Il tuo prompt genera risposte di qualità professionale. Sei pronto per uso aziendale!'
                  : testResult.score >= 6
                  ? 'Buona base! Considera di aggiungere più specifiche per migliorare ulteriormente.'
                  : 'Il prompt ha potenziale ma necessita di più struttura e dettagli specifici.'}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!testResult}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            Vai al Test Finale →
          </Button>
        </div>
      </div>

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={showAPIModal}
        onClose={() => setShowAPIModal(false)}
        onSave={saveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
};

export default AITestingStep;
