
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FoundationStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleUserPromptSubmit = () => {
    setShowDemo(true);
    updatePromptData('foundationComplete', true);
  };

  const getAIResponse = (prompt: string) => {
    if (!prompt.trim()) return "Per favore, scrivi un'istruzione!";
    
    if (prompt.toLowerCase().includes('aiutami') || prompt.toLowerCase().includes('help')) {
      return "Certo! Ecco 50 consigli generici per migliorare la produttività, gestire le email, ottimizzare il workflow...";
    }
    
    if (prompt.toLowerCase().includes('email') && prompt.toLowerCase().includes('cliente')) {
      return "Ho bisogno di più informazioni. Che tipo di email? Quale contesto aziendale? Che risultato vuoi ottenere?";
    }
    
    return "Risposta generica basata sulla tua richiesta. Per risultati più specifici, fornisci più dettagli sul contesto e obiettivi.";
  };

  return (
    <div className="step-card glassmorphism-base">
      <h2 className="text-2xl font-semibold text-white element-spacing relative z-10">
        🤔 STEP 0/9: Ma cos'è esattamente un "prompt"?
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-white/80 leading-relaxed element-spacing">
            💭 Un prompt è come dare istruzioni a una persona. Più sei specifico, migliore è il risultato!
          </p>
          
          <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4 element-spacing">
            <div className="bg-slate-700/60 rounded-lg p-3 element-spacing">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-white/60 sub-element-spacing">👤 UMANO:</div>
                  <div className="text-white/80">"Aiutami con le email" →</div>
                  <div className="text-white/60 text-xs">Umano: "Di cosa si tratta?"</div>
                </div>
                <div>
                  <div className="text-white/60 sub-element-spacing">🤖 AI:</div>
                  <div className="text-white/80">"Aiutami con le email" →</div>
                  <div className="text-white/60 text-xs">AI: "Ecco 50 consigli generici..."</div>
                </div>
              </div>
            </div>

            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-3 element-spacing">
              <div className="text-red-400 text-sm font-medium sub-element-spacing">❌ PROBLEMA COMUNE:</div>
              <div className="text-white/80 text-sm leading-relaxed">
                L'AI non sa chi dovrebbe essere! Senza ruolo definito = risposta generica da "chiunque". 
                Con ruolo specifico = risposta da professional esperto con credibilità e competenza.
              </div>
            </div>
            
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3">
              <div className="text-green-400 text-sm font-medium sub-element-spacing">✅ SPECIFICO = RISULTATO MIGLIORE</div>
              <div className="text-white/80 text-sm leading-relaxed">
                "Tu sei un customer service manager con 8 anni di esperienza. Scrivi una risposta professionale per un cliente arrabbiato che chiede rimborso"
              </div>
              <div className="text-green-400/70 text-xs mt-2">
                → Ora l'AI sa esattamente che ruolo assumere e che expertise dimostrare
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-white/10 rounded-lg p-4 section-spacing">
          <h3 className="text-white font-medium element-spacing">🧪 PROVA TU STESSO:</h3>
          <div className="space-y-3">
            <div>
              <label className="text-white/70 text-sm block sub-element-spacing">
                Scrivi la tua istruzione all'AI:
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Esempio: Aiutami con le email..."
                className="w-full bg-slate-700/60 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 resize-none"
                rows={2}
              />
            </div>
            <Button
              onClick={handleUserPromptSubmit}
              disabled={!userPrompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
            >
              Invia Prompt
            </Button>
          </div>
        </div>

        {showDemo && (
          <div className="bg-slate-800/50 border border-amber-400/30 rounded-lg p-4 animate-fade-in section-spacing">
            <h4 className="text-amber-400 font-medium sub-element-spacing">🤖 AI Response:</h4>
            <div className="bg-slate-900/60 rounded-lg p-3 element-spacing">
              <p className="text-white/80 text-sm leading-relaxed">
                {getAIResponse(userPrompt)}
              </p>
            </div>
            
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-3">
              <h5 className="text-red-400 font-medium sub-element-spacing">💡 SCOPERTA:</h5>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• L'AI fa <strong>esattamente</strong> quello che chiedi</li>
                <li>• Se sei vago → risposta vaga</li>
                <li>• Se sei specifico → risposta specifica</li>
                <li>• <strong>Serve più precisione!</strong></li>
              </ul>
            </div>
          </div>
        )}

        {showDemo && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Ora impariamo a essere specifici! →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundationStep;
