
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
}

const TestingSection: React.FC<Props> = ({ promptData }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleTestPrompt = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const testEmail = {
    subject: "PROBLEMA CON ORDINE #12345",
    content: `Ciao, ho ricevuto ieri il vestito ma è arrivato della taglia sbagliata. Ho ordinato una M ma è arrivata una L. Vorrei un rimborso immediato perché devo partire domani per viaggio.

Grazie, Sofia`
  };

  const aiResponse = `Gentile Sofia,

Ho ricevuto la sua email riguardo l'ordine #12345 e comprendo la frustrazione per la taglia errata ricevuta.

[SENTIMENT: Negativo | URGENZA: 4/5 | CATEGORIA: Errore Logistica]

Mi scuso sinceramente per l'inconveniente. Poiché l'errore è nostro, procederò immediatamente con:

1. Rimborso completo entro 24 ore sul metodo di pagamento utilizzato
2. Ritiro gratuito del prodotto errato (può tenerlo se preferisce)
3. Sconto 15% sul prossimo acquisto per l'inconveniente

Procederemo entro 1 giorno lavorativo considerando la sua partenza.

Cordiali saluti,
Marco Rossi
Customer Care Team`;

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-6 relative z-10">
        🧪 Testa il Tuo Prompt
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Input email */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            📧 Email Cliente Test:
          </h3>
          <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4">
            <div className="text-white/80 text-sm leading-relaxed">
              <strong>Oggetto:</strong> {testEmail.subject}<br/><br/>
              {testEmail.content}
            </div>
          </div>
          
          {/* Test button */}
          <div className="mt-4">
            <Button
              onClick={handleTestPrompt}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white py-3 rounded-xl font-medium transition-all duration-300"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                  Analizzando...
                </div>
              ) : (
                '🚀 Testa Prompt'
              )}
            </Button>
          </div>
        </div>
        
        {/* AI Response */}
        <div>
          <h3 className="text-white font-medium mb-3 flex items-center">
            🤖 Risposta AI Generata:
          </h3>
          <div className="bg-slate-800/50 border border-green-400/30 rounded-lg p-4 min-h-64">
            {analysisComplete ? (
              <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                {aiResponse}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-white/50">
                <div className="text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <p>Clicca "Testa Prompt" per vedere la risposta AI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Results analysis */}
      {analysisComplete && (
        <div className="mt-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400/30 rounded-lg p-4 relative z-10">
          <h4 className="text-green-400 font-medium mb-3 flex items-center">
            📊 Analisi Qualità Risposta:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-green-400">
                <span className="mr-2">✅</span>Sentiment correttamente identificato
              </div>
              <div className="flex items-center text-green-400">
                <span className="mr-2">✅</span>Urgenza appropriata (4/5)
              </div>
              <div className="flex items-center text-green-400">
                <span className="mr-2">✅</span>Tone empatico ma professionale
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-green-400">
                <span className="mr-2">✅</span>Timeline specifico
              </div>
              <div className="flex items-center text-green-400">
                <span className="mr-2">✅</span>Next steps chiari
              </div>
              <div className="flex items-center text-green-400">
                <span className="mr-2">✅</span>Soluzione immediata
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <span className="text-white font-medium mr-3">Overall Score:</span>
              <div className="bg-slate-700 rounded-full h-3 flex-1 max-w-48">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full w-11/12 transition-all duration-1000" />
              </div>
              <span className="text-green-400 font-bold ml-3">92/100</span>
            </div>
            <span className="text-green-400 font-bold ml-4 px-3 py-1 bg-green-400/20 rounded-full">
              ECCELLENTE!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestingSection;
