
import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertTriangle, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  userInput: string;
  context: 'role' | 'context' | 'tasks' | 'tone' | 'format';
  onScoreChange?: (score: number) => void;
  onRetryRequest?: () => void;
}

const EnhancedAICoach: React.FC<Props> = ({ userInput, context, onScoreChange, onRetryRequest }) => {
  const [feedback, setFeedback] = useState<{
    score: number;
    message: string;
    suggestions: string[];
    type: 'success' | 'warning' | 'info';
    canProceed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!userInput.trim()) {
      setFeedback(null);
      onScoreChange?.(0);
      return;
    }

    const analyzeFeedback = () => {
      const input = userInput.toLowerCase();
      let score = 0;
      let message = '';
      let suggestions: string[] = [];
      let type: 'success' | 'warning' | 'info' = 'info';
      let canProceed = false;

      switch (context) {
        case 'role':
          if (input.includes('sei un') || input.includes('you are')) {
            score += 3;
            if (input.includes('anni') || input.includes('esperienza') || input.includes('experience')) {
              score += 2;
              message = 'Eccellente! Ruolo e esperienza definiti chiaramente.';
              type = 'success';
              canProceed = true;
            } else {
              message = 'Buon inizio! Aggiungi gli anni di esperienza.';
              suggestions.push('Specifica gli anni di esperienza per maggiore autorità');
              type = 'warning';
            }
          } else {
            message = 'Definisci il ruolo iniziando con "Sei un..."';
            suggestions.push('Esempio: "Sei un responsabile customer service con 5 anni di esperienza"');
            type = 'warning';
          }
          break;

        case 'context':
          const wordCount = input.trim().split(' ').length;
          if (wordCount >= 20) {
            score += 3;
            if (input.includes('azienda') || input.includes('cliente') || input.includes('business')) {
              score += 2;
              message = 'Perfetto! Contesto dettagliato e specifico.';
              type = 'success';
              canProceed = true;
            } else {
              message = 'Buon dettaglio, ma specifica meglio il contesto aziendale.';
              suggestions.push('Includi informazioni su azienda, clienti o settore');
              type = 'warning';
            }
          } else {
            message = 'Espandi il contesto con più dettagli specifici.';
            suggestions.push('Descrivi il settore, tipo di clienti, situazioni tipiche');
            type = 'warning';
          }
          break;

        case 'tasks':
          const lines = input.split('\n').filter(line => line.trim());
          const hasNumbering = lines.some(line => /^\d+\./.test(line.trim()));
          
          if (lines.length >= 3) {
            score += 2;
            if (hasNumbering) {
              score += 2;
              if (lines.some(line => line.includes('analizza') || line.includes('identifica') || line.includes('redigi'))) {
                score += 1;
                message = 'Ottimo! Task ben strutturati e actionable.';
                type = 'success';
                canProceed = true;
              } else {
                message = 'Buona struttura, rendi i task più specifici.';
                suggestions.push('Usa verbi d\'azione: analizza, identifica, proponi, redigi');
                type = 'warning';
              }
            } else {
              message = 'Numera i task per maggiore chiarezza.';
              suggestions.push('Usa formato: 1. Task uno, 2. Task due, ecc.');
              type = 'warning';
            }
          } else {
            message = 'Definisci almeno 3 task specifici.';
            suggestions.push('Ogni task deve essere misurabile e actionable');
            type = 'warning';
          }
          break;

        case 'tone':
          if (input.includes('tone') || input.includes('stile') || input.includes('constraint')) {
            score += 2;
            if (input.includes('professionale') || input.includes('empatico') || input.includes('formale')) {
              score += 2;
              if (input.includes('evita') || input.includes('includi') || input.includes('lunghezza')) {
                score += 1;
                message = 'Perfetto! Constraints complete e specifiche.';
                type = 'success';
                canProceed = true;
              } else {
                message = 'Aggiungi limitazioni e requisiti specifici.';
                suggestions.push('Specifica cosa evitare e cosa includere sempre');
                type = 'warning';
              }
            } else {
              message = 'Definisci meglio il tone desiderato.';
              suggestions.push('Specifica: professionale, empatico, formale, casual, ecc.');
              type = 'warning';
            }
          } else {
            message = 'Inizia specificando il tone e le constraints.';
            suggestions.push('Esempio: "Tone: professionale ed empatico"');
            type = 'warning';
          }
          break;

        case 'format':
          const hasStructure = input.includes('struttura') || input.includes('formato') || input.includes('sezioni');
          if (hasStructure) {
            score += 3;
            if (input.includes('oggetto') || input.includes('saluto') || input.includes('chiusura')) {
              score += 2;
              message = 'Eccellente! Formato email ben strutturato.';
              type = 'success';
              canProceed = true;
            } else {
              message = 'Buona base, aggiungi elementi specifici email.';
              suggestions.push('Includi: oggetto, saluto, corpo, chiusura');
              type = 'warning';
            }
          } else {
            message = 'Definisci la struttura dell\'output desiderato.';
            suggestions.push('Specifica formato: sezioni, ordine, elementi obbligatori');
            type = 'warning';
          }
          break;
      }

      score = Math.min(score, 5);
      onScoreChange?.(score);
      setFeedback({ score, message, suggestions, type, canProceed });
    };

    const timer = setTimeout(analyzeFeedback, 500);
    return () => clearTimeout(timer);
  }, [userInput, context, onScoreChange]);

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
            AI Coach: {feedback.message}
          </div>
          
          {feedback.suggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              {feedback.suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs text-slate-300 flex items-start">
                  <Lightbulb className="w-3 h-3 mr-1 mt-0.5 text-slate-400" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Qualità:</span>
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
            </div>
            
            {!feedback.canProceed && feedback.score > 0 && onRetryRequest && (
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
        </div>
      </div>
    </div>
  );
};

export default EnhancedAICoach;
