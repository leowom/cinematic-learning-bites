
import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertTriangle, Lightbulb, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  userInput: string;
  context: 'role' | 'context' | 'tasks' | 'tone' | 'format';
  onScoreChange?: (score: number, canProceed: boolean) => void;
  onRetryRequest?: () => void;
}

interface AIFeedback {
  score: number;
  message: string;
  suggestions: string[];
  type: 'success' | 'warning' | 'info';
  canProceed: boolean;
  strengths: string[];
  improvements: string[];
}

const OpenAICoach: React.FC<Props> = ({ userInput, context, onScoreChange, onRetryRequest }) => {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContextPrompt = (context: string) => {
    const prompts = {
      role: `Valuta questo testo che dovrebbe definire il ruolo di un AI assistant per il customer service.
Criteri di valutazione:
- Chiarezza del ruolo (inizia con "Sei un...")
- Specificità dell'esperienza (anni, competenze)
- Autorità e credibilità
- Completezza della definizione

Punteggio: 1-5 (5=eccellente, 4=buono, 3=sufficiente, 2=insufficiente, 1=molto insufficiente)
Soglia minima per procedere: 4/5`,

      context: `Valuta questo testo che dovrebbe fornire il contesto aziendale per un AI assistant.
Criteri di valutazione:
- Dettaglio del settore/business
- Informazioni sui clienti
- Situazioni operative tipiche
- Vincoli e limitazioni aziendali
- Chiarezza del contesto

Punteggio: 1-5 (5=eccellente, 4=buono, 3=sufficiente, 2=insufficiente, 1=molto insufficiente)
Soglia minima per procedere: 4/5`,

      tasks: `Valuta questo testo che dovrebbe definire task specifici per un AI assistant.
Criteri di valutazione:
- Numero di task (almeno 3)
- Specificità e chiarezza
- Verbi d'azione (analizza, identifica, proponi, redigi)
- Misurabilità dei risultati
- Strutturazione (numerazione, bullet points)

Punteggio: 1-5 (5=eccellente, 4=buono, 3=sufficiente, 2=insufficiente, 1=molto insufficiente)
Soglia minima per procedere: 4/5`,

      tone: `Valuta questo testo che dovrebbe definire lo stile e i vincoli per un AI assistant.
Criteri di valutazione:
- Definizione chiara del tone (professionale, empatico, etc.)
- Specificazione di vincoli e limitazioni
- Indicazioni su cosa evitare
- Requisiti di lunghezza/formato
- Coerenza con il contesto aziendale

Punteggio: 1-5 (5=eccellente, 4=buono, 3=sufficiente, 2=insufficiente, 1=molto insufficiente)
Soglia minima per procedere: 4/5`,

      format: `Valuta questo testo che dovrebbe definire il formato output per un AI assistant.
Criteri di valutazione:
- Struttura chiara e logica
- Sezioni ben definite (oggetto, saluto, corpo, chiusura)
- Completezza del formato
- Professionalità della struttura
- Facilità di implementazione

Punteggio: 1-5 (5=eccellente, 4=buono, 3=sufficiente, 2=insufficiente, 1=molto insufficiente)
Soglia minima per procedere: 4/5`
    };
    return prompts[context] || prompts.role;
  };

  useEffect(() => {
    if (!userInput.trim()) {
      setFeedback(null);
      onScoreChange?.(0, false);
      return;
    }

    const analyzeWithAI = async () => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const contextPrompt = getContextPrompt(context);
        
        const { data, error } = await supabase.functions.invoke('test-prompt-gpt', {
          body: {
            prompt: `${contextPrompt}

TESTO DA VALUTARE:
"${userInput}"

Rispondi SOLO in formato JSON con questa struttura:
{
  "score": numero_da_1_a_5,
  "message": "messaggio_principale_breve",
  "suggestions": ["suggerimento1", "suggerimento2"],
  "strengths": ["punto_di_forza1", "punto_di_forza2"],
  "improvements": ["miglioramento1", "miglioramento2"],
  "canProceed": boolean_se_score_maggiore_uguale_4
}`,
            testCase: { type: 'coaching_evaluation' }
          }
        });

        if (error) {
          throw new Error(`Errore API: ${error.message}`);
        }

        if (data.error) {
          throw new Error(data.error);
        }

        // Parse della risposta JSON
        let parsedFeedback;
        try {
          parsedFeedback = JSON.parse(data.response);
        } catch (parseError) {
          throw new Error('Risposta AI non valida');
        }

        const aiFeedback: AIFeedback = {
          score: parsedFeedback.score || 1,
          message: parsedFeedback.message || 'Valutazione completata',
          suggestions: parsedFeedback.suggestions || [],
          strengths: parsedFeedback.strengths || [],
          improvements: parsedFeedback.improvements || [],
          canProceed: parsedFeedback.canProceed || false,
          type: parsedFeedback.score >= 4 ? 'success' : parsedFeedback.score >= 2 ? 'warning' : 'info'
        };

        setFeedback(aiFeedback);
        onScoreChange?.(aiFeedback.score, aiFeedback.canProceed);

      } catch (error) {
        console.error('Errore analisi AI:', error);
        setError('Errore durante l\'analisi. Riprova.');
        // Fallback a valutazione locale semplice
        const fallbackScore = userInput.length > 50 ? 3 : 1;
        setFeedback({
          score: fallbackScore,
          message: 'Valutazione offline (errore connessione AI)',
          suggestions: ['Espandi il contenuto con più dettagli'],
          strengths: [],
          improvements: ['Aggiungi più specificità'],
          canProceed: false,
          type: 'warning'
        });
        onScoreChange?.(fallbackScore, false);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const timer = setTimeout(analyzeWithAI, 1500);
    return () => clearTimeout(timer);
  }, [userInput, context, onScoreChange]);

  if (!feedback && !isAnalyzing) return null;

  if (isAnalyzing) {
    return (
      <div className="mt-3 p-3 rounded-lg border bg-blue-900/20 border-blue-700/40">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-blue-300 text-sm">AI Coach sta analizzando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 p-3 rounded-lg border bg-red-900/20 border-red-700/40">
        <div className="text-red-300 text-sm">{error}</div>
      </div>
    );
  }

  if (!feedback) return null;

  const Icon = feedback.type === 'success' ? CheckCircle : 
               feedback.type === 'warning' ? AlertTriangle : Brain;

  return (
    <div className={`mt-3 p-3 rounded-lg border transition-all duration-300 ${
      feedback.type === 'success' ? 'bg-emerald-900/20 border-emerald-700/40' :
      feedback.type === 'warning' ? 'bg-orange-900/20 border-orange-700/40' :
      'bg-blue-900/20 border-blue-700/40'
    }`}>
      <div className="flex items-start space-x-2">
        <Icon className={`w-4 h-4 mt-0.5 ${
          feedback.type === 'success' ? 'text-emerald-400' :
          feedback.type === 'warning' ? 'text-orange-400' :
          'text-blue-400'
        }`} />
        <div className="flex-1">
          <div className={`text-sm font-medium ${
            feedback.type === 'success' ? 'text-emerald-300' :
            feedback.type === 'warning' ? 'text-orange-300' :
            'text-blue-300'
          }`}>
            🤖 AI Coach: {feedback.message}
          </div>
          
          {feedback.strengths.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-emerald-400 font-medium mb-1">✅ Punti di forza:</div>
              {feedback.strengths.map((strength, index) => (
                <div key={index} className="text-xs text-slate-300 ml-2">• {strength}</div>
              ))}
            </div>
          )}

          {feedback.improvements.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-orange-400 font-medium mb-1">🔧 Da migliorare:</div>
              {feedback.improvements.map((improvement, index) => (
                <div key={index} className="text-xs text-slate-300 ml-2">• {improvement}</div>
              ))}
            </div>
          )}
          
          {feedback.suggestions.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-blue-400 font-medium mb-1">💡 Suggerimenti:</div>
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs text-slate-300 flex items-start ml-2">
                  <span>• {suggestion}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Punteggio AI:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-2 h-2 rounded-full ${
                      star <= feedback.score ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">({feedback.score}/5)</span>
            </div>
            
            {!feedback.canProceed && onRetryRequest && (
              <Button
                onClick={onRetryRequest}
                size="sm"
                variant="outline"
                className="text-orange-300 border-orange-600 hover:bg-orange-900/20 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Migliora
              </Button>
            )}
          </div>

          {!feedback.canProceed && (
            <div className="mt-2 p-2 bg-orange-900/30 border border-orange-700/50 rounded text-xs text-orange-200">
              ⚠️ Punteggio insufficiente per procedere. Minimo richiesto: 4/5
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenAICoach;
