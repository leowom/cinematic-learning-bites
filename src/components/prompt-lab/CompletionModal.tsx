
import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  onClose: () => void;
  finalScore: number;
}

const CompletionModal: React.FC<Props> = ({ onClose, finalScore }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900/95 border border-white/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl shadow-black/40">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
        
        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Prompt Completato!
          </h2>
          <p className="text-white/70 mb-6 leading-relaxed">
            Hai imparato a costruire prompt efficaci step-by-step. Il tuo prompt è ora ottimizzato per risultati professionali!
          </p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
            <div className="text-sm text-white/70 mb-2">Miglioramento qualità:</div>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-red-400 text-xs mb-1">PRIMA</div>
                <div className="text-red-400 font-bold text-xl">2/10</div>
                <div className="text-red-400/60 text-xs">Prompt generico</div>
              </div>
              <div className="text-white/40 text-2xl">→</div>
              <div className="text-center">
                <div className="text-green-400 text-xs mb-1">DOPO</div>
                <div className="text-green-400 font-bold text-xl">9.2/10</div>
                <div className="text-green-400/60 text-xs">Prompt ottimizzato</div>
              </div>
            </div>
          </div>
          
          {/* Achievement badges */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
            <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-2">
              <div className="text-blue-400 font-medium">🎯 Accuracy Master</div>
              <div className="text-blue-400/70">+40% precisione</div>
            </div>
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-2">
              <div className="text-green-400 font-medium">⚡ Speed Optimizer</div>
              <div className="text-green-400/70">-60% tempo risposta</div>
            </div>
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-2">
              <div className="text-purple-400 font-medium">🎭 Tone Expert</div>
              <div className="text-purple-400/70">Perfect balance</div>
            </div>
            <div className="bg-amber-600/20 border border-amber-400/30 rounded-lg p-2">
              <div className="text-amber-400 font-medium">📋 Structure Pro</div>
              <div className="text-amber-400/70">Format ottimale</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
              onClick={() => {
                // Save template logic here
                onClose();
              }}
            >
              💾 Salva Template
            </Button>
            <Button
              className="w-full bg-slate-700 text-white py-3 rounded-xl font-medium hover:bg-slate-600 transition-all duration-300"
              onClick={onClose}
            >
              ▶️ Prossima Lezione
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
