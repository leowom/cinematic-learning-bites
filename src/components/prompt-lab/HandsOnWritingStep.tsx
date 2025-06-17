
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import OpenAICoach from './OpenAICoach';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const HandsOnWritingStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [userWrittenPrompt, setUserWrittenPrompt] = useState(promptData.freeWrittenPrompt || '');
  const [currentScore, setCurrentScore] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const testScenario = {
    title: "Gestione Reclamo Cliente E-commerce",
    email: `Oggetto: ORDINE SBAGLIATO - RIMBORSO IMMEDIATO

Buongiorno,

Sono davvero delusa! Ho ricevuto ieri l'ordine #78932 ma invece della borsa nera che avevo ordinato per il matrimonio di mia cugina (questo sabato!), mi è arrivata una borsa marrone completamente diversa.

Ho pagato 89€ + 15€ di spedizione express proprio per averla in tempo. Ora non ho più tempo per riordinare e sono senza regalo!

Voglio il rimborso completo subito. Sono cliente da 3 anni e non mi era mai capitato.

Distinti saluti,
Francesca Rossi
Cliente #: 45892`,
    requirements: [
      "Rispondere con empatia al problema del cliente",
      "Proporre una soluzione rapida e concreta",
      "Mantenere un tono professionale ma umano",
      "Includere informazioni sui prossimi passi",
      "Gestire l'urgenza temporale (matrimonio sabato)"
    ]
  };

  const handleScoreChange = (score: number, canProceedNow: boolean) => {
    setCurrentScore(score);
    setCanProceed(canProceedNow);
    updatePromptData('freeWrittenPrompt', userWrittenPrompt);
  };

  const generateReferencePrompt = () => {
    let reference = '';
    
    if (promptData.userWrittenRole || promptData.role) {
      const role = promptData.userWrittenRole || `Sei un ${promptData.role} con ${promptData.experience} anni di esperienza`;
      reference += `${role}\n\n`;
    }
    
    if (promptData.userWrittenContext || promptData.context) {
      const context = promptData.userWrittenContext || promptData.context;
      reference += `CONTESTO:\n${context}\n\n`;
    }
    
    if (promptData.userWrittenTasks || (promptData.tasks && promptData.tasks.length > 0)) {
      const tasks = promptData.userWrittenTasks || promptData.tasks.join(', ');
      reference += `TASK:\n${tasks}\n\n`;
    }
    
    if (promptData.userWrittenTone || promptData.tone) {
      const tone = promptData.userWrittenTone || `Mantieni un tono ${promptData.tone?.formal > 60 ? 'professionale' : 'informale'} e ${promptData.tone?.empathy > 60 ? 'empatico' : 'diretto'}`;
      reference += `STILE:\n${tone}\n\n`;
    }
    
    if (promptData.userWrittenFormat || (promptData.outputFormat && promptData.outputFormat.length > 0)) {
      const format = promptData.userWrittenFormat || promptData.outputFormat.join(', ');
      reference += `FORMATO OUTPUT:\n${format}`;
    }
    
    return reference;
  };

  // Score minimo richiesto è 4/5 (equivalente a 70/100)
  const minimumScore = 4;

  return (
    <div className="step-card glassmorphism-base">
      {/* Header */}
      <div className="text-center space-y-4 mb-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-700/50">
            <Edit3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            ✍️ STEP 7/9: Pratica di Scrittura Completa
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Ora metti tutto insieme! Scrivi un prompt completo da zero per gestire la situazione qui sotto. 
            Serve almeno <strong>{minimumScore}/5</strong> per procedere al test finale.
          </p>
        </div>
      </div>

      {/* Test Scenario */}
      <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-6 mb-6">
        <h3 className="text-amber-300 font-medium mb-4 flex items-center">
          🎯 Scenario di Test: {testScenario.title}
        </h3>
        
        <div className="bg-slate-800/60 border border-amber-600/30 rounded-lg p-4 mb-4">
          <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
            {testScenario.email}
          </pre>
        </div>

        <div className="space-y-2">
          <h4 className="text-amber-300 text-sm font-medium">📋 Il tuo prompt deve garantire:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {testScenario.requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm text-slate-300">
                <Target className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reference Toggle */}
      <div className="mb-6 text-center">
        <Button
          onClick={() => setShowReference(!showReference)}
          size="sm"
          className="bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 border border-slate-600/50"
        >
          <Lightbulb className="w-3 h-3 mr-1" />
          {showReference ? 'Nascondi' : 'Mostra'} Componenti di Riferimento
        </Button>
      </div>

      {/* Reference Components */}
      {showReference && (
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
      <div className="bg-purple-900/15 border border-purple-700/30 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-purple-300 font-medium flex items-center">
            <Edit3 className="w-4 h-4 mr-2" />
            ✍️ Scrivi il Tuo Prompt Completo:
          </h3>
          <div className="text-right">
            <div className="text-purple-400 text-xs">Score Attuale</div>
            <div className={`text-lg font-bold ${
              currentScore >= minimumScore ? 'text-emerald-400' : 
              currentScore >= 3 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {currentScore}/5
            </div>
          </div>
        </div>

        <textarea
          value={userWrittenPrompt}
          onChange={(e) => setUserWrittenPrompt(e.target.value)}
          placeholder="Esempio: 'Sei un responsabile customer service esperto con 5 anni di esperienza...'

Scrivi un prompt completo che includa:
- Il tuo ruolo e competenza
- Il contesto aziendale
- I task specifici da svolgere
- Lo stile di comunicazione
- Il formato della risposta

Ricorda: deve essere specifico per gestire il reclamo di Francesca!"
          className="w-full bg-slate-800/60 border border-purple-600/50 rounded-lg p-4 text-slate-200 placeholder-slate-400 resize-none min-h-64 focus:border-purple-500 focus:outline-none text-sm leading-relaxed"
          rows={16}
        />

        {/* AI Coach Feedback */}
        <OpenAICoach 
          userInput={userWrittenPrompt} 
          context="complete-prompt"
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
                  ? 'Hai raggiunto il punteggio minimo! Puoi procedere al test finale con GPT-4o.' 
                  : `Ti serve almeno ${minimumScore}/5 per procedere. Attuale: ${currentScore}/5`}
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
              Procedi al Test Finale con GPT-4o
            </>
          ) : (
            `Serve almeno ${minimumScore}/5 per procedere (${currentScore}/5)`
          )}
        </Button>
      </div>
    </div>
  );
};

export default HandsOnWritingStep;
