
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FoundationStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [microprompt, setMicroprompt] = useState(promptData.microprompt1 || '');

  const handleUserPromptSubmit = () => {
    setShowDemo(true);
    updatePromptData('foundationComplete', true);
  };

  const handleMicropromptChange = (text: string) => {
    setMicroprompt(text);
    updatePromptData('microprompt1', text);
  };

  const getAIResponse = (prompt: string) => {
    if (!prompt.trim()) return "Fornisci istruzioni chiare per un'assistenza ottimale.";
    
    if (prompt.toLowerCase().includes('aiutami') || prompt.toLowerCase().includes('help')) {
      return "Posso fornire assistenza generale su produttività, gestione email, ottimizzazione workflow e altri argomenti. Specifica le tue esigenze per un supporto più mirato.";
    }
    
    if (prompt.toLowerCase().includes('email') && prompt.toLowerCase().includes('cliente')) {
      return "Ho bisogno di contesto aggiuntivo per fornirti assistenza efficace. Che tipo di comunicazione email? Quale contesto aziendale? Quale risultato specifico stai cercando?";
    }
    
    return "Posso aiutarti con la tua richiesta. Tuttavia, fornire contesto più specifico e obiettivi chiari mi permetterebbe di offrire una guida più precisa e attuabile.";
  };

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Brain className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Fondamenti del Prompt Engineering
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Un prompt funziona come un set di istruzioni per i sistemi di AI. La specificità e struttura del tuo prompt 
            è direttamente correlata alla qualità e rilevanza della risposta AI.
          </p>
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="bg-slate-800/50 rounded-lg p-3 element-spacing">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400 sub-element-spacing">Comunicazione Umana:</div>
                  <div className="text-slate-300">"Aiutami con le email" →</div>
                  <div className="text-slate-400 text-xs">Risposta: "Cosa ti serve specificamente?"</div>
                </div>
                <div>
                  <div className="text-slate-400 sub-element-spacing">Comunicazione AI:</div>
                  <div className="text-slate-300">"Aiutami con le email" →</div>
                  <div className="text-slate-400 text-xs">Risposta: "Ecco 50 consigli generali per le email..."</div>
                </div>
              </div>
            </div>

            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3 element-spacing">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <AlertTriangle className="w-4 h-4 text-rose-300" />
                <span className="text-rose-300 text-sm font-medium">Problema Comune:</span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                Senza definizione del ruolo, le risposte AI mancano di contesto e autorevolezza. 
                Prompt generici producono risposte generiche con valore pratico limitato.
              </div>
            </div>
            
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">Approccio Professionale:</span>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                "Sei un responsabile customer service con 8 anni di esperienza. Redigi una risposta professionale 
                per un cliente scontento che richiede un rimborso."
              </div>
              <div className="text-emerald-400/70 text-xs mt-2">
                Questo approccio stabilisce chiaramente l'autorità del ruolo e il contesto specifico per risultati mirati.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-4 section-spacing">
          <h3 className="text-slate-200 font-medium element-spacing flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Esercizio Pratico:</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 text-sm block sub-element-spacing">
                Inserisci la tua istruzione per il sistema AI:
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Esempio: Aiutami con la gestione delle email..."
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 text-slate-200 placeholder-slate-500 resize-none focus:border-slate-600 focus:outline-none"
                rows={2}
              />
            </div>
            <Button
              onClick={handleUserPromptSubmit}
              disabled={!userPrompt.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
            >
              Invia Prompt
            </Button>
          </div>
        </div>

        {showDemo && (
          <div className="bg-slate-800/30 border border-orange-700/30 rounded-lg p-4 animate-fade-in section-spacing">
            <h4 className="text-orange-300 font-medium sub-element-spacing flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Risposta AI:</span>
            </h4>
            <div className="bg-slate-900/40 rounded-lg p-3 element-spacing">
              <p className="text-slate-300 text-sm leading-relaxed">
                {getAIResponse(userPrompt)}
              </p>
            </div>
            
            <div className="bg-rose-900/15 border border-rose-700/30 rounded-lg p-3">
              <h5 className="text-rose-300 font-medium sub-element-spacing flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Osservazione Chiave:</span>
              </h5>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• I sistemi AI rispondono letteralmente all'input fornito</li>
                <li>• Istruzioni vaghe producono risposte generiche</li>
                <li>• Contesto specifico produce risultati mirati</li>
                <li>• <strong>La precisione è essenziale per l'efficacia</strong></li>
              </ul>
            </div>
          </div>
        )}

        {showDemo && (
          <>
            <MicropromptWriter
              title="Pratica: Crea un Prompt Specifico"
              instruction="Ora prova tu! Scrivi un prompt più specifico e strutturato per lo stesso obiettivo:"
              placeholder="Sei un [ruolo] con [esperienza]. Il tuo compito è [obiettivo specifico]..."
              example="Sei un responsabile customer service con 5 anni di esperienza. Redigi una risposta professionale per un cliente che richiede supporto tecnico per un prodotto difettoso."
              context="role"
              onTextChange={handleMicropromptChange}
              value={microprompt}
            />

            <div className="flex justify-end">
              <Button
                onClick={onComplete}
                disabled={!microprompt.trim()}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center space-x-2 border border-slate-600"
              >
                <span>Procedi al Modulo Successivo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FoundationStep;
