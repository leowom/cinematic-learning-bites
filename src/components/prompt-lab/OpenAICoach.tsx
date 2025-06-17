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
      role: `Analizza questo testo che dovrebbe definire il ruolo di un AI assistant.

CRITERI DI VALUTAZIONE (1-100 per criterio):
1. CHIAREZZA RUOLO: Inizia con "Sei un..." e definisce chiaramente l'identità (0-100)
2. ESPERIENZA: Specifica anni di esperienza o competenze (0-100)  
3. AUTORITÀ: Stabilisce credibilità e competenza nel settore (0-100)
4. COMPLETEZZA: Include tutti gli elementi necessari per il ruolo (0-100)
5. SPECIFICITÀ: Dettagli concreti invece di descrizioni vaghe (0-100)

SOGLIA MINIMA: 80/100 per procedere (equivale a 4/5 stelle)

Rispondi SOLO in formato JSON con questa struttura esatta:
{
  "score": numero_da_1_a_100,
  "message": "messaggio_principale_breve",
  "suggestions": ["suggerimento1", "suggerimento2"],
  "strengths": ["punto_di_forza1", "punto_di_forza2"],
  "improvements": ["miglioramento1", "miglioramento2"],
  "canProceed": true_se_score_maggiore_uguale_80
}`,

      context: `Analizza questo testo che dovrebbe fornire il contesto aziendale.

CRITERI DI VALUTAZIONE (1-100 per criterio):
1. SETTORE/BUSINESS: Descrive chiaramente il tipo di azienda (0-100)
2. CLIENTI: Identifica chi sono i clienti target (0-100)
3. SITUAZIONI: Include problematiche o situazioni tipiche (0-100)
4. VINCOLI: Specifica policy o limitazioni aziendali (0-100)
5. DETTAGLIO: Fornisce informazioni concrete e specifiche (0-100)

SOGLIA MINIMA: 80/100 per procedere (equivale a 4/5 stelle)

Rispondi SOLO in formato JSON con questa struttura esatta:
{
  "score": numero_da_1_a_100,
  "message": "messaggio_principale_breve",
  "suggestions": ["suggerimento1", "suggerimento2"],
  "strengths": ["punto_di_forza1", "punto_di_forza2"],
  "improvements": ["miglioramento1", "miglioramento2"],
  "canProceed": true_se_score_maggiore_uguale_80
}`,

      tasks: `Analizza questo testo che dovrebbe definire task specifici.

CRITERI DI VALUTAZIONE (1-100 per criterio):
1. NUMERO TASK: Almeno 3 task definiti chiaramente (0-100)
2. VERBI AZIONE: Usa verbi specifici (analizza, identifica, proponi) (0-100)
3. STRUTTURA: Ben organizzato con numerazione o bullet (0-100)
4. MISURABILITÀ: Task con risultati verificabili (0-100)
5. SPECIFICITÀ: Dettagli concreti, non vaghi (0-100)

SOGLIA MINIMA: 80/100 per procedere (equivale a 4/5 stelle)

Rispondi SOLO in formato JSON con questa struttura esatta:
{
  "score": numero_da_1_a_100,
  "message": "messaggio_principale_breve",
  "suggestions": ["suggerimento1", "suggerimento2"],
  "strengths": ["punto_di_forza1", "punto_di_forza2"],
  "improvements": ["miglioramento1", "miglioramento2"],
  "canProceed": true_se_score_maggiore_uguale_80
}`,

      tone: `Analizza questo testo che dovrebbe definire stile e vincoli comunicativi.

CRITERI DI VALUTAZIONE (1-100 per criterio):
1. TONE DEFINITO: Specifica chiaramente lo stile (professionale, empatico) (0-100)
2. VINCOLI: Include limitazioni e cosa evitare (0-100)
3. LUNGHEZZA: Specifica requisiti di formato/lunghezza (0-100)
4. COERENZA: Allineato con contesto aziendale (0-100)
5. APPLICABILITÀ: Facile da implementare e seguire (0-100)

SOGLIA MINIMA: 80/100 per procedere (equivale a 4/5 stelle)

Rispondi SOLO in formato JSON con questa struttura esatta:
{
  "score": numero_da_1_a_100,
  "message": "messaggio_principale_breve",
  "suggestions": ["suggerimento1", "suggerimento2"],
  "strengths": ["punto_di_forza1", "punto_di_forza2"],
  "improvements": ["miglioramento1", "miglioramento2"],
  "canProceed": true_se_score_maggiore_uguale_80
}`,

      format: `Analizza questo testo che dovrebbe definire il formato output.

CRITERI DI VALUTAZIONE (1-100 per criterio):
1. STRUTTURA: Definisce sezioni chiare (oggetto, saluto, corpo, chiusura) (0-100)
2. COMPLETEZZA: Include tutti gli elementi necessari (0-100)
3. PROFESSIONALITÀ: Formato appropriato e professionale (0-100)
4. IMPLEMENTABILITÀ: Facile da seguire e replicare (0-100)
5. DETTAGLIO: Specifico sui requisiti di formattazione (0-100)

SOGLIA MINIMA: 80/100 per procedere (equivale a 4/5 stelle)

Rispondi SOLO in formato JSON con questa struttura esatta:
{
  "score": numero_da_1_a_100,
  "message": "messaggio_principale_breve",
  "suggestions": ["suggerimento1", "suggerimento2"],
  "strengths": ["punto_di_forza1", "punto_di_forza2"],
  "improvements": ["miglioramento1", "miglioramento2"],
  "canProceed": true_se_score_maggiore_uguale_80
}`
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
        console.log('🤖 Starting AI analysis for context:', context);
        
        const analysisPrompt = `${getContextPrompt(context)}

TESTO DA ANALIZZARE:
"${userInput}"`;

        console.log('📝 Sending prompt to AI:', analysisPrompt.substring(0, 200) + '...');

        const { data, error } = await supabase.functions.invoke('test-prompt-gpt', {
          body: {
            prompt: analysisPrompt,
            testCase: {
              type: 'educational_evaluation',
              context: context,
              userInput: userInput
            }
          }
        });

        if (error) {
          console.error('❌ Supabase function error:', error);
          throw new Error(`Errore API: ${error.message}`);
        }

        if (data.error) {
          console.error('❌ AI API error:', data.error);
          throw new Error(data.error);
        }

        console.log('✅ Raw AI response:', data.response);

        // Parse della risposta JSON
        let parsedFeedback;
        try {
          // Pulisci la risposta da eventuali backticks markdown
          const cleanResponse = data.response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          parsedFeedback = JSON.parse(cleanResponse);
          console.log('📊 Parsed feedback:', parsedFeedback);
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          throw new Error('Risposta AI non in formato valido');
        }

        // Converti score da 1-100 a 1-5 per compatibilità UI
        const normalizedScore = Math.round((parsedFeedback.score / 100) * 5);
        const canProceed = parsedFeedback.score >= 80; // Soglia 80/100 per 4/5 stelle

        const aiFeedback: AIFeedback = {
          score: normalizedScore,
          message: parsedFeedback.message || 'Valutazione completata',
          suggestions: parsedFeedback.suggestions || [],
          strengths: parsedFeedback.strengths || [],
          improvements: parsedFeedback.improvements || [],
          canProceed: canProceed,
          type: canProceed ? 'success' : parsedFeedback.score >= 60 ? 'warning' : 'info'
        };

        console.log('🎯 Final feedback:', aiFeedback);
        setFeedback(aiFeedback);
        onScoreChange?.(normalizedScore, canProceed);

      } catch (error) {
        console.error('💥 AI analysis error:', error);
        setError(error.message || 'Errore durante l\'analisi');
        
        // Fallback a valutazione locale semplice
        const fallbackScore = userInput.length > 50 ? 3 : 1;
        const fallbackFeedback: AIFeedback = {
          score: fallbackScore,
          message: 'Valutazione offline (errore connessione AI)',
          suggestions: ['Espandi il contenuto con più dettagli'],
          strengths: [],
          improvements: ['Aggiungi più specificità'],
          canProceed: false,
          type: 'warning'
        };
        setFeedback(fallbackFeedback);
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
          <span className="text-blue-300 text-sm">🤖 AI Coach sta analizzando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 p-3 rounded-lg border bg-red-900/20 border-red-700/40">
        <div className="text-red-300 text-sm">❌ {error}</div>
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          className="mt-2 bg-red-700/60 hover:bg-red-600/80 text-red-200 text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Riprova
        </Button>
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
              ⚠️ Punteggio insufficiente per procedere. Minimo richiesto: 80/100 (4/5 stelle)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenAICoach;
