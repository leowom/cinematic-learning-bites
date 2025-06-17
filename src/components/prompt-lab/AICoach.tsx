
import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  userInput: string;
  context: 'role' | 'context' | 'tasks' | 'tone' | 'format';
  onFeedback?: (score: number) => void;
}

const AICoach: React.FC<Props> = ({ userInput, context, onFeedback }) => {
  const [feedback, setFeedback] = useState<{
    score: number;
    message: string;
    suggestions: string[];
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  useEffect(() => {
    if (!userInput.trim()) {
      setFeedback(null);
      onFeedback?.(0);
      return;
    }

    const analyzeFeedback = () => {
      const input = userInput.toLowerCase();
      let score = 0;
      let message = '';
      let suggestions: string[] = [];
      let type: 'success' | 'warning' | 'info' = 'info';

      switch (context) {
        case 'role':
          if (input.includes('sei un') || input.includes('you are')) {
            score += 3;
            message = 'Ottimo! Hai definito chiaramente il ruolo.';
            type = 'success';
          } else {
            message = 'Inizia con "Sei un..." per definire il ruolo.';
            suggestions.push('Esempio: "Sei un responsabile customer service..."');
            type = 'warning';
          }
          
          if (input.includes('anni') || input.includes('esperienza')) {
            score += 2;
            suggestions.push('✅ Esperienza specificata correttamente');
          } else if (score > 0) {
            suggestions.push('💡 Aggiungi anni di esperienza per più autorità');
          }
          break;

        case 'context':
          if (input.length > 50) {
            score += 2;
            message = 'Buon livello di dettaglio nel contesto.';
            type = 'success';
          } else {
            message = 'Aggiungi più dettagli sul contesto aziendale.';
            type = 'warning';
          }
          
          if (input.includes('azienda') || input.includes('business') || input.includes('cliente')) {
            score += 2;
            suggestions.push('✅ Contesto business ben definito');
          }
          break;

        case 'tasks':
          const taskCount = (input.match(/[.!]\s/g) || []).length + 1;
          if (taskCount >= 3) {
            score += 3;
            message = 'Eccellente! Hai definito task specifici.';
            type = 'success';
          } else {
            message = 'Definisci almeno 3 task specifici.';
            suggestions.push('Usa elenchi numerati o bullet points');
            type = 'warning';
          }
          break;
      }

      score = Math.min(score, 5);
      onFeedback?.(score);
      setFeedback({ score, message, suggestions, type });
    };

    const timer = setTimeout(analyzeFeedback, 500);
    return () => clearTimeout(timer);
  }, [userInput, context, onFeedback]);

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
          
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-slate-400">Score:</span>
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
        </div>
      </div>
    </div>
  );
};

export default AICoach;
