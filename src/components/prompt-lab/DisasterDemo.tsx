
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const DisasterDemo: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
    updatePromptData('disasterUnderstood', true);
  };

  const clientEmail = `Oggetto: PRODOTTO ROTTO!!!

Ciao, ho ricevuto ieri la vostra maglietta ma ha un buco gigante! Sono furioso, voglio i soldi indietro SUBITO o chiamo l'avvocato!

Marco Rossi`;

  const badPrompt = `"Rispondi a questa email del cliente"`;

  const badResponse = `Ciao Marco,

Grazie per la tua email. Mi dispiace per il problema. Cosa posso fare per aiutarti?

Saluti`;

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        💥 STEP 1/7: Vediamo cosa succede con un prompt generico
      </h2>
      
      <div className="relative z-10 space-y-6">
        <p className="text-white/70 leading-relaxed">
          Testiamo un prompt generico con una situazione reale di customer service. Preparati al disastro! 😅
        </p>

        {/* Email cliente */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            📧 Email Cliente Reale:
          </h3>
          <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4">
            <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">
              {clientEmail}
            </pre>
          </div>
        </div>

        {/* Prompt generico */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            🤖 PROMPT GENERICO:
          </h3>
          <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
            <code className="text-red-300 text-sm">{badPrompt}</code>
          </div>
        </div>

        {/* AI Response disastrosa */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            🤖 AI RESPONSE (Disastro):
          </h3>
          <div className="bg-slate-800/50 border border-red-400/30 rounded-lg p-4">
            <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">
              {badResponse}
            </pre>
          </div>
        </div>

        {!showAnalysis && (
          <div className="text-center">
            <Button
              onClick={handleShowAnalysis}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-medium"
            >
              😱 Analizza i Problemi
            </Button>
          </div>
        )}

        {showAnalysis && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-3">❌ PROBLEMI EVIDENTI:</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Non si scusa per l'errore aziendale
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Non offre soluzione concreta (rimborso/sostituzione)
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Tone troppo casual per cliente arrabbiato
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Non menziona rimborso nonostante richiesta esplicita
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Chiede al cliente cosa fare (unprofessional)
                </li>
              </ul>
            </div>

            <div className="bg-amber-600/20 border border-amber-400/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-medium mb-2">💭 RISULTATO:</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                "Marco sarà ancora più arrabbiato! Questa risposta non risolve il problema e potrebbe 
                escalare la situazione. L'AI non aveva le informazioni necessarie per gestire 
                professionalmente la situazione."
              </p>
            </div>

            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">✅ LA BUONA NOTIZIA:</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Possiamo fare MOLTO meglio! Nei prossimi step imparerai come trasformare questo 
                disastro in una risposta professionale che soddisfa il cliente e risolve il problema.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
              >
                Vediamo come migliorare! →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterDemo;
