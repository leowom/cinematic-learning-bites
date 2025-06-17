
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Star, Award, Brain, FileText } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FreeWritingStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [freePrompt, setFreePrompt] = useState(promptData.freeWrittenPrompt || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    canProceed: boolean;
    message: string;
    suggestions: string[];
  } | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFreePrompt(text);
    updatePromptData('freeWrittenPrompt', text);
    
    // Reset feedback when user starts typing
    if (feedback) {
      setFeedback(null);
    }
  };

  const analyzePrompt = async () => {
    if (!freePrompt.trim()) return;

    setIsAnalyzing(true);
    
    // Simulated AI analysis - replace with actual OpenAI call
    setTimeout(() => {
      const wordCount = freePrompt.trim().split(' ').length;
      const hasRole = freePrompt.toLowerCase().includes('sei un') || freePrompt.toLowerCase().includes('you are');
      const hasTasks = freePrompt.includes('1.') || freePrompt.includes('•') || freePrompt.includes('-');
      const hasContext = wordCount > 100;
      
      let score = 0;
      const suggestions = [];
      
      if (hasRole) score += 1;
      else suggestions.push('Definisci chiaramente il ruolo con "Sei un..."');
      
      if (hasContext) score += 1;
      else suggestions.push('Aggiungi più contesto aziendale');
      
      if (hasTasks) score += 1;
      else suggestions.push('Includi task specifici numerati');
      
      if (wordCount > 200) score += 1;
      else suggestions.push('Espandi con più dettagli (minimo 200 parole)');
      
      if (freePrompt.includes('tone') || freePrompt.includes('stile')) score += 1;
      else suggestions.push('Specifica lo stile di comunicazione');

      const canProceed = score >= 4;
      
      setFeedback({
        score,
        canProceed,
        message: canProceed ? 'Ottimo prompt completo!' : 'Il prompt necessita di miglioramenti',
        suggestions
      });
      
      updatePromptData('qualityScore', score);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleComplete = () => {
    if (feedback?.canProceed) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-700/50">
            <Edit3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            ✍️ Scrittura Libera del Prompt
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Ora è il momento di mettere insieme tutto quello che hai imparato. Scrivi un prompt completo da zero utilizzando tutti gli elementi appresi.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
        <h3 className="text-purple-300 font-medium mb-3 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          📋 Checklist del Prompt Perfetto
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Ruolo definito chiaramente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Contesto aziendale specifico</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Task numerati e misurabili</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Stile e vincoli comunicativi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Formato output strutturato</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Almeno 200 parole di dettaglio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Writing Area */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-200 font-medium flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>🖊️ Il Tuo Prompt Completo</span>
          </h3>
          
          <Button
            onClick={analyzePrompt}
            disabled={!freePrompt.trim() || isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
          >
            {isAnalyzing ? 'Analizzando...' : '🤖 Analizza con AI'}
          </Button>
        </div>

        <textarea
          value={freePrompt}
          onChange={handlePromptChange}
          placeholder="Scrivi qui il tuo prompt completo utilizzando tutti gli elementi appresi nei moduli precedenti..."
          className="w-full bg-slate-700/60 border border-slate-600/50 rounded-lg p-4 text-slate-200 placeholder-slate-400 resize-none h-64 focus:border-slate-500 focus:outline-none text-sm"
          rows={12}
        />
        
        <div className="mt-2 text-xs text-slate-400">
          Parole: {freePrompt.trim().split(' ').filter(word => word).length} / 200 minimo
        </div>
      </div>

      {/* AI Feedback */}
      {feedback && (
        <div className={`rounded-xl p-6 border transition-all duration-300 ${
          feedback.canProceed 
            ? 'bg-emerald-900/20 border-emerald-700/40' 
            : 'bg-orange-900/20 border-orange-700/40'
        }`}>
          <div className="flex items-start space-x-3">
            <Brain className={`w-5 h-5 mt-0.5 ${
              feedback.canProceed ? 'text-emerald-400' : 'text-orange-400'
            }`} />
            <div className="flex-1">
              <h4 className={`font-medium mb-2 ${
                feedback.canProceed ? 'text-emerald-300' : 'text-orange-300'
              }`}>
                🤖 AI Feedback: {feedback.message}
              </h4>
              
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= feedback.score ? 'text-emerald-400 fill-emerald-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-300 text-sm">
                  Punteggio: {feedback.score}/5
                </span>
              </div>

              {feedback.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-slate-300 text-sm font-medium">💡 Suggerimenti per migliorare:</h5>
                  {feedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="text-slate-300 text-sm flex items-start">
                      <span className="text-slate-500 mr-2">•</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= (feedback?.score || 0) ? 'text-emerald-400 fill-emerald-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-300 text-sm">
              Qualità: {feedback?.score || 0}/5 {feedback?.canProceed ? '✅' : '⏳'}
            </span>
          </div>
          
          <Button 
            onClick={handleComplete}
            disabled={!feedback?.canProceed}
            className={`${
              feedback?.canProceed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {feedback?.canProceed ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                Continua
              </>
            ) : (
              'Migliora per Continuare'
            )}
          </Button>
        </div>
        
        {feedback && !feedback.canProceed && (
          <div className="mt-3 p-3 bg-orange-900/30 border border-orange-700/50 rounded-lg">
            <p className="text-orange-200 text-sm">
              ⚠️ Punteggio insufficiente per procedere. Minimo richiesto: 4/5
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeWritingStep;
