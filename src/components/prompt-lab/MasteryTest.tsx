
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const MasteryTest: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const complexEmail = `Ciao, sono cliente da 3 anni e ho sempre pagato puntuale. Stavolta ho ordinato 5 magliette per matrimonio figlio (€180) ma sono arrivate colori sbagliati. Matrimonio è sabato prossimo (3 giorni) e non so cosa fare. Help! - Sofia, ordine #9876`;

  const competitorResponse = `Ciao Sofia, grazie per averci contattato. Mi dispiace per l'inconveniente. Ti aiuteremo a risolvere. Puoi darci più dettagli?`;

  const masterResponse = `Gentile Sofia,

[Sentiment: Stress alto | Urgenza: 5/5 | Cliente VIP: 3 anni loyalty]

Comprendo perfettamente la sua ansia per il matrimonio di suo figlio. Come cliente fedele da 3 anni, merita un servizio eccezionale.

SOLUZIONI IMMEDIATE (entro oggi):
1. Spedizione express gratuita colori corretti
2. Pick-up domani + consegna venerdì  
3. Rimborso + voucher €50 per inconveniente

Ho già messo in priorità il suo ordine. La ricontatto entro 2 ore con tracking.

I miei migliori auguri per il matrimonio!

Marco Bianchi - Senior Customer Service
Diretto: +39 02 1234567`;

  const handleShowComparison = () => {
    setShowComparison(true);
    // Calculate final quality score
    const score = 9.6;
    updatePromptData('qualityScore', score);
  };

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
  };

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        🎓 STEP 7/7: Test di Mastery - Il TUO PROMPT in azione!
      </h2>
      
      <div className="relative z-10 space-y-6">
        <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
          <h3 className="text-green-400 font-medium mb-3">🎯 QUELLO CHE HAI COSTRUITO:</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white/80">ROLE: Customer service expert 8+ anni</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white/80">CONTEXT: E-commerce abbigliamento</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white/80">TASKS: Sentiment + urgenza + soluzioni</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white/80">TONE: Empatico ma professionale</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white/80">FORMAT: 5 sezioni strutturate</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white/80">= 847 caratteri di precisione!</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-medium mb-3">
            📧 NUOVO TEST EMAIL (più complessa):
          </h3>
          <div className="bg-slate-800/50 border border-white/20 rounded-lg p-4">
            <p className="text-white/80 text-sm leading-relaxed">
              {complexEmail}
            </p>
          </div>
        </div>

        {!showComparison && (
          <div className="text-center">
            <Button
              onClick={handleShowComparison}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-medium"
            >
              🆚 Tu vs AI "Competitor"
            </Button>
          </div>
        )}

        {showComparison && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-red-400 font-medium mb-3">🤖 "COMPETITOR" GENERIC AI:</h4>
                <div className="bg-red-600/20 border border-red-400/30 rounded-lg p-4">
                  <p className="text-white/80 text-sm">
                    {competitorResponse}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-green-400 font-medium mb-3">🎯 IL TUO PROMPT TRAINED:</h4>
                <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap">
                    {masterResponse}
                  </pre>
                </div>
              </div>
            </div>

            {!showAnalysis && (
              <div className="text-center">
                <Button
                  onClick={handleShowAnalysis}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl"
                >
                  📊 Analizza Qualità
                </Button>
              </div>
            )}

            {showAnalysis && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-3">📊 ANALISI QUALITÀ:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Riconosce customer loyalty (3 anni)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Identifica urgenza massima (matrimonio)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Offre soluzioni multiple concrete</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Timeline specifici e realistici</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Tone empatico per situazione emotiva</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Contact diretto per escalation</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Personal touch (auguri matrimonio)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 mr-2">✅</span>
                        <span className="text-white/70">Structured professional format</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-3">SCORE:</span>
                      <div className="bg-slate-700 rounded-full h-3 w-32">
                        <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full w-11/12"></div>
                      </div>
                      <span className="text-green-400 font-bold ml-3">96/100</span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">MASTER LEVEL!</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-3">CONGRATULAZIONI!</h3>
                  <p className="text-white/80 mb-4">Sei passato da:</p>
                  <div className="flex items-center justify-center space-x-6 mb-4">
                    <div className="text-center">
                      <div className="text-red-400 text-xs mb-1">PRIMA</div>
                      <div className="text-red-400 font-bold text-xl">"Aiutami con email"</div>
                      <div className="text-red-400/60 text-xs">Quality: 2/10</div>
                    </div>
                    <div className="text-white/40 text-2xl">→</div>
                    <div className="text-center">
                      <div className="text-green-400 text-xs mb-1">DOPO</div>
                      <div className="text-green-400 font-bold text-xl">Professional prompt 847 chars</div>
                      <div className="text-green-400/60 text-xs">Quality: 9.6/10</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3 rounded-xl font-medium text-lg"
                  >
                    🎯 COMPLETA CORSO!
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MasteryTest;
