
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Zap, AlertCircle, CheckCircle, Award, Target } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [isPromptGenerated, setIsPromptGenerated] = useState(false);

  const { testPromptWithGPT } = useOpenAI();

  const testCases = [
    {
      id: 'complaint',
      title: 'Reclamo Cliente Arrabbiato',
      email: `Oggetto: ORDINE SBAGLIATO - VOGLIO RIMBORSO

Salve, ho ricevuto oggi l'ordine #12345 ma è completamente sbagliato! Ho ordinato una maglietta rossa taglia M e mi è arrivata una blu taglia L. È la terza volta che succede quest'anno e sono davvero stufo.

Voglio il rimborso immediato, non sostituzione. Ho pagato con carta di credito 45€ + 8€ spedizione express.

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

  const generateFinalPrompt = () => {
    let prompt = '';
    
    if (promptData.userWrittenRole || promptData.role) {
      const role = promptData.userWrittenRole || promptData.role;
      prompt += `Sei un ${role}`;
      if (promptData.experience) {
        prompt += ` con ${promptData.experience} anni di esperienza`;
      }
      prompt += '.\n\n';
    }
    
    if (promptData.userWrittenContext || promptData.context) {
      const context = promptData.userWrittenContext || promptData.context;
      prompt += `CONTESTO:\n${context}\n\n`;
    }
    
    if (promptData.userWrittenTasks) {
      prompt += `TASK:\n${promptData.userWrittenTasks}\n\n`;
    } else if (promptData.tasks?.length > 0) {
      prompt += 'TASK:\n';
      promptData.tasks.forEach((task: string, index: number) => {
        prompt += `${index + 1}. ${task}\n`;
      });
      prompt += '\n';
    }
    
    if (promptData.userWrittenTone) {
      prompt += `VINCOLI:\n${promptData.userWrittenTone}\n\n`;
    } else if (promptData.tone) {
      prompt += 'VINCOLI:\n';
      prompt += `- Tone: ${promptData.tone.formal > 60 ? 'Professionale' : 'Casual'} ${promptData.tone.empathy > 60 ? 'ed empatico' : 'e diretto'}\n\n`;
    }
    
    if (promptData.userWrittenFormat) {
      prompt += `FORMATO OUTPUT:\n${promptData.userWrittenFormat}`;
    } else if (promptData.outputFormat?.length > 0) {
      prompt += 'FORMATO OUTPUT:\n';
      promptData.outputFormat.forEach((format: string) => {
        prompt += `${format}\n`;
      });
    }
    
    return prompt;
  };

  const handleGeneratePrompt = () => {
    const generated = generateFinalPrompt();
    setFinalPrompt(generated);
    setIsPromptGenerated(true);
  };

  const handleRealAITest = async () => {
    const currentTest = testCases[selectedTestCase];

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Inizio test con GPT-4o via Supabase...', { prompt: finalPrompt, testCase: currentTest.title });
      
      const result = await testPromptWithGPT(finalPrompt, currentTest);
      
      console.log('✅ Test completato:', result);
      
      // Assicurati che il score sia tra 1-5
      const normalizedScore = Math.max(1, Math.min(5, Math.round(result.score)));
      const normalizedResult = {
        ...result,
        score: normalizedScore,
        analysis: {
          completeness: Math.max(0, Math.min(100, result.analysis.completeness)),
          accuracy: Math.max(0, Math.min(100, result.analysis.accuracy)),
          tone: Math.max(0, Math.min(100, result.analysis.tone)),
          specificity: Math.max(0, Math.min(100, result.analysis.specificity)),
          actionability: Math.max(0, Math.min(100, result.analysis.actionability))
        }
      };
      
      setTestResult(normalizedResult);
      updatePromptData('aiTestScore', normalizedScore);
      
    } catch (error: any) {
      console.error('❌ Errore test AI:', error);
      setError(error.message || 'Errore sconosciuto durante il test AI');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-emerald-400';
    if (score >= 3) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4) return '🎉 Eccellente!';
    if (score >= 3) return '👍 Buono!';
    return '📚 Da Migliorare';
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="text-center space-y-4 mb-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center border border-green-700/50">
            <Award className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            🏆 STEP 8/8: Il TUO PROMPT in Azione
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            È il momento di vedere il tuo prompt professionale completo e testarlo con GPT-4o reale! 
            Questo è il culmine del tuo percorso di apprendimento.
          </p>
        </div>
      </div>
      
      <div className="relative z-10 space-y-6">
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

        {/* Step 1: Generate Final Prompt */}
        <div className="section-spacing">
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
            <h3 className="text-blue-300 font-medium mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              🎯 Passo 1: Genera il Tuo Prompt Finale
            </h3>
            <p className="text-slate-300 mb-4">
              Assembla tutti i componenti che hai creato in un prompt professionale completo.
            </p>
            <div className="text-center">
              <Button
                onClick={handleGeneratePrompt}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                🔧 Genera Prompt Completo
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Prompt Display */}
        {isPromptGenerated && (
          <div className="section-spacing">
            <h3 className="text-emerald-300 font-medium mb-4 flex items-center">
              ✨ Il TUO PROMPT Professionale:
            </h3>
            <div className="bg-slate-800/50 border border-emerald-400/30 rounded-lg p-4 prompt-preview">
              <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {finalPrompt || 'Clicca "Genera Prompt Completo" per vedere il risultato...'}
              </pre>
            </div>
          </div>
        )}

        {/* Step 2: Test Selection */}
        {isPromptGenerated && (
          <div className="section-spacing">
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
              <h3 className="text-purple-300 font-medium mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                🧪 Passo 2: Scegli il Test
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {testCases.map((testCase, index) => (
                  <button
                    key={testCase.id}
                    onClick={() => setSelectedTestCase(index)}
                    className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedTestCase === index
                        ? 'bg-purple-600/40 border-purple-400/50'
                        : 'bg-slate-800/40 border-white/20 hover:bg-slate-700/60'
                    }`}
                  >
                    <h4 className="text-white font-medium mb-2">{testCase.title}</h4>
                    <p className="text-white/60 text-sm line-clamp-3">{testCase.email.substring(0, 150)}...</p>
                  </button>
                ))}
              </div>

              {/* Email di Test */}
              <div className="bg-slate-800/50 border border-purple-400/30 rounded-lg p-4 mb-4">
                <h4 className="text-purple-300 font-medium mb-2">📧 Email di Test:</h4>
                <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                  {testCases[selectedTestCase].email}
                </pre>
              </div>

              {/* Test Button */}
              <div className="text-center">
                <Button
                  onClick={handleRealAITest}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-xl font-medium text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Testing con GPT-4o...</span>
                    </div>
                  ) : (
                    '🚀 Testa con GPT-4o Reale'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <div className="space-y-6 section-spacing">
            {/* AI Response */}
            <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-6">
              <h3 className="text-green-300 font-medium mb-4">🤖 Risposta AI Generata:</h3>
              <div className="bg-slate-800/50 border border-green-400/30 rounded-lg p-4">
                <pre className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                  {testResult.response}
                </pre>
              </div>
            </div>

            {/* Final Score */}
            <div className={`rounded-xl p-6 border text-center ${
              testResult.score >= 4 
                ? 'bg-emerald-600/20 border-emerald-400/30'
                : testResult.score >= 3
                ? 'bg-amber-600/20 border-amber-400/30'
                : 'bg-red-600/20 border-red-400/30'
            }`}>
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    <span className={getScoreColor(testResult.score)}>
                      {testResult.score}/5
                    </span>
                  </div>
                  <h4 className={`text-xl font-bold ${getScoreColor(testResult.score)}`}>
                    {getScoreLabel(testResult.score)}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Analisi Dettagliata:</h4>
                  {Object.entries(testResult.analysis).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 capitalize text-sm">{key}:</span>
                        <span className="text-white font-medium text-sm">{value}%</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2 w-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            value >= 80 ? 'bg-green-400' : value >= 60 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium">Feedback Specifico:</h4>
                  <div className="space-y-1">
                    {testResult.feedback.map((item, index) => (
                      <div key={index} className="text-white/70 text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mt-4">
                {testResult.score >= 4 
                  ? '🎉 Eccellente! Il tuo prompt genera risposte di qualità professionale. Sei pronto per uso aziendale!'
                  : testResult.score >= 3
                  ? '👍 Buona base! Il tuo prompt funziona bene, considera di aggiungere più dettagli per migliorare ulteriormente.'
                  : '📚 Il prompt ha potenziale ma necessita di più struttura e dettagli specifici. Continua a praticare!'}
              </p>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={onComplete}
            disabled={!testResult}
            className={`text-lg px-8 py-3 transition-all duration-300 ${
              testResult 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            {testResult ? (
              <>
                <Award className="w-5 h-5 mr-2" />
                Completa il Corso
              </>
            ) : (
              'Completa il test per procedere'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AITestingStep;
