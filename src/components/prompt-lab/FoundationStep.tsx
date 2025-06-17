
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const FoundationStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const handleComplete = () => {
    updatePromptData('foundationComplete', true);
    onComplete();
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

        <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-4 section-spacing">
          <div className="flex items-center space-x-2 sub-element-spacing">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-300 text-sm font-medium">Principi Chiave:</span>
          </div>
          <ul className="text-slate-300 text-sm space-y-2 mt-3">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span><strong>Specificità:</strong> Più dettagli fornisci, più precise saranno le risposte</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span><strong>Contesto:</strong> Definisci sempre il ruolo e la situazione</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span><strong>Obiettivi:</strong> Specifica cosa vuoi ottenere dalla risposta</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span><strong>Struttura:</strong> Organizza le informazioni in modo logico</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleComplete}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
          >
            <span>Procedi al Modulo Successivo</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoundationStep;
