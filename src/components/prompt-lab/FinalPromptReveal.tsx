
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import OpenAICoach from './OpenAICoach';

interface Props {
  promptData: any;
  onComplete: () => void;
}

const FinalPromptReveal: React.FC<Props> = ({ promptData, onComplete }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [showExampleEmail, setShowExampleEmail] = useState(false);

  const testEmail = `Oggetto: PROBLEMA URGENTE - Ordine #45672

Salve,

Sono davvero arrabbiata! Ho ricevuto ieri l'ordine #45672 che ho fatto per il matrimonio di mia sorella questo weekend, ma invece del vestito blu navy taglia M che avevo ordinato, mi è arrivato un vestito verde taglia L completamente sbagliato!

Il matrimonio è sabato (tra 3 giorni) e ora non ho niente da mettere. Ho già pagato 89€ + 12€ di spedizione express. Voglio o il vestito giusto domani mattina o il rimborso completo immediato.

Sono cliente da 2 anni e non mi era mai successa una cosa del genere. Mi aspetto una soluzione rapida!

Distinti saluti,
Elena Marchetti
Cliente #: 28947`;

  const handleScoreChange = (score: number, canProceedNow: boolean) => {
    setCurrentScore(score);
    setCanProceed(canProceedNow);
  };

  const generateReferencePrompt = () => {
    let reference = '';
    
    if (promptData.userWrittenRole) {
      reference += `${promptData.userWrittenRole}\n\n`;
    }
    
    if (promptData.userWrittenContext) {
      reference += `CONTESTO:\n${promptData.userWrittenContext}\n\n`;
    }
    
    if (promptData.userWrittenTasks) {
      reference += `TASK:\n${promptData.userWrittenTasks}\n\n`;
    }
    
    if (promptData.userWrittenTone) {
      reference += `VINCOLI:\n${promptData.userWrittenTone}\n\n`;
    }
    
    if (promptData.userWrittenFormat) {
      reference += `FORMATO OUTPUT:\n${promptData.userWrittenFormat}`;
    }
    
    return reference;
  };

  return (
    <div className="step-card glassmorphism-base">
      {/* Header */}
      <div className="text-center space-y-4 mb-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-700/50">
            <Edit3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            ✍️ STEP 7/9: Test Pratico di Scrittura
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Ora è il momento di applicare tutto quello che hai imparato! Scrivi un prompt completo da zero per gestire l'email qui sotto. 
            Devi raggiungere almeno <strong>7/10</strong> per procedere.
          </p>
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6 mb-6">
        <h3 className="text-red-300 font-medium mb-4 flex items-center">
          📧 Email di Test da Gestire:
        </h3>
        
        <div className="bg-slate-800/60 border border-red-600/30 rounded-lg p-4">
          <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
            {testEmail}
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-6 mb-6">
        <h3 className="text-blue-300 font-medium mb-3">📋 Istruzioni del Test:</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">1.</span>
            <span>Scrivi un prompt completo che includa: <strong>ruolo, contesto, task, vincoli e formato output</strong></span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">2.</span>
            <span>Il prompt deve essere specifico per gestire l'email di Elena sopra</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">3.</span>
            <span>L'AI Coach ti darà feedback in tempo reale - serve almeno <strong>7/10</strong> per passare</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-1">4.</span>
            <span>Usa tutto quello che hai imparato negli step precedenti!</span>
          </div>
        </div>
      </div>

      {/* Reference Toggle */}
      <div className="mb-6 text-center">
        <Button
          onClick={() => setShowExampleEmail(!showExampleEmail)}
          size="sm"
          className="bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 border border-slate-600/50"
        >
          <Lightbulb className="w-3 h-3 mr-1" />
          {showExampleEmail ? 'Nascondi' : 'Mostra'} i Tuoi Componenti Precedenti
        </Button>
      </div>

      {/* Reference Components */}
      {showExampleEmail && (
        <div className="mb-6 p-4 bg-slate-800/40 border border-slate-700/30 rounded-lg">
          <h4 className="text-slate-300 text-sm font-medium mb-2">📚 I Tuoi Componenti Precedenti (solo come riferimento):</h4>
          <div className="bg-slate-900/60 border border-slate-700/30 rounded p-3 max-h-48 overflow-y-auto">
            <pre className="text-slate-400 text-xs whitespace-pre-wrap leading-relaxed font-mono">
              {generateReferencePrompt() || 'Completa gli step precedenti per vedere i componenti...'}
            </pre>
          </div>
        </div>
      )}

      {/* Writing Area */}
      <div className="bg-blue-900/15 border border-blue-700/30 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-blue-300 font-medium flex items-center">
            <Edit3 className="w-4 h-4 mr-2" />
            ✍️ Scrivi il Tuo Prompt Completo:
          </h3>
          <div className="text-right">
            <div className="text-blue-400 text-xs">Score Attuale</div>
            <div className={`text-lg font-bold ${
              currentScore >= 7 ? 'text-emerald-400' : 
              currentScore >= 5 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {currentScore}/10
            </div>
          </div>
        </div>

        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Inizia con qualcosa come: 'Sei un responsabile customer service esperto...' e continua costruendo tutti i componenti che hai imparato..."
          className="w-full bg-slate-800/60 border border-blue-600/50 rounded-lg p-4 text-slate-200 placeholder-slate-400 resize-none min-h-64 focus:border-blue-500 focus:outline-none text-sm leading-relaxed"
          rows={12}
        />

        {/* AI Coach Feedback */}
        <OpenAICoach 
          userInput={userPrompt} 
          context="tasks" // Usiamo tasks come contesto generale per il prompt completo
          onScoreChange={handleScoreChange}
        />
      </div>

      {/* Progress Indicator */}
      {currentScore > 0 && (
        <div className={`mb-6 p-4 rounded-lg border ${
          canProceed 
            ? 'bg-emerald-900/20 border-emerald-700/30'
            : 'bg-orange-900/20 border-orange-700/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${canProceed ? 'text-emerald-400' : 'text-orange-400'}`}>
                {canProceed ? '🎉 Ottimo Lavoro!' : '📚 Continua a Migliorare'}
              </h4>
              <p className="text-slate-300 text-sm">
                {canProceed 
                  ? 'Hai raggiunto il punteggio minimo! Puoi procedere al test con AI.' 
                  : `Ti serve almeno 7/10 per procedere. Attuale: ${currentScore}/10`}
              </p>
            </div>
            {canProceed ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={onComplete}
          disabled={!canProceed}
          className={`text-lg px-8 py-3 transition-all duration-300 ${
            canProceed 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed'
          }`}
        >
          {canProceed ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Procedi al Test con AI
            </>
          ) : (
            `Serve almeno 7/10 per procedere (${currentScore}/10)`
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalPromptReveal;
