
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const StyleConstraintsStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [tone, setTone] = useState(promptData.tone || { formal: 60, empathy: 40 });

  const handleToneChange = (type: 'formal' | 'empathy', value: number) => {
    const newTone = { ...tone, [type]: value };
    setTone(newTone);
    updatePromptData('tone', newTone);
  };

  const generateTonePreview = () => {
    const formalLevel = tone.formal;
    const empathyLevel = tone.empathy;
    
    if (formalLevel > 70 && empathyLevel < 40) {
      return {
        text: "Gentile Signor/Signora [Nome], la ringraziamo per aver contattato il nostro servizio clienti. Procederemo con l'analisi della sua richiesta secondo le procedure standard...",
        score: 7
      };
    } else if (formalLevel < 40 && empathyLevel > 60) {
      return {
        text: "Ciao [Nome]! Ho visto il tuo messaggio e capisco perfettamente la tua frustrazione. Nessun problema, ci pensiamo noi a sistemare tutto! 😊",
        score: 8
      };
    } else {
      return {
        text: "Gentile [Nome], comprendo la sua frustrazione riguardo al prodotto ricevuto. Mi scuso per l'inconveniente e procederò immediatamente per risolvere la situazione...",
        score: 9
      };
    }
  };

  const tonePreview = generateTonePreview();

  return (
    <div className="bg-slate-900/90 border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 hover:bg-slate-800/95 transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-semibold text-white mb-4 relative z-10">
        ⚖️ STEP 4/5: Style & Constraints
      </h2>
      
      <p className="text-white/70 mb-6 relative z-10">
        Definisci il tono di comunicazione per adattare lo stile alle aspettative dei tuoi clienti.
      </p>
      
      {/* Tone sliders */}
      <div className="mb-6 relative z-10">
        <label className="text-white/70 mb-3 block">🎭 Tone di comunicazione:</label>
        <div className="space-y-6 bg-slate-800/40 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Formale</span>
              <span className="text-white font-medium">{tone.formal}%</span>
              <span className="text-white/60 text-sm">Casual</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tone.formal}
              onChange={(e) => handleToneChange('formal', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Diretto</span>
              <span className="text-white font-medium">{tone.empathy}%</span>
              <span className="text-white/60 text-sm">Empatico</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tone.empathy}
              onChange={(e) => handleToneChange('empathy', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10">
          <label className="text-white/70 text-sm mb-2 block">📏 Lunghezza risposta:</label>
          <select className="w-full bg-slate-700/60 border border-white/20 rounded text-white p-2">
            <option>Concisa (50-100 parole)</option>
            <option>Standard (100-200 parole)</option>
            <option>Dettagliata (200-300 parole)</option>
          </select>
        </div>
        
        <div className="bg-slate-800/40 rounded-lg p-4 border border-white/10">
          <label className="text-white/70 text-sm mb-2 block">🌍 Lingua e localizzazione:</label>
          <select className="w-full bg-slate-700/60 border border-white/20 rounded text-white p-2">
            <option>Italiano (Italia)</option>
            <option>Italiano (Svizzera)</option>
            <option>Inglese (UK)</option>
            <option>Inglese (US)</option>
          </select>
        </div>
      </div>
      
      {/* Tone preview */}
      <div className="bg-slate-800/50 border border-amber-400/30 rounded-lg p-4 mb-6 relative z-10">
        <h4 className="text-amber-400 font-medium mb-2 flex items-center">
          💡 Tone Preview:
        </h4>
        <p className="text-white/70 text-sm italic leading-relaxed mb-3">
          "{tonePreview.text}"
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <span className="text-white/60 text-xs mr-2">Tone Score:</span>
            <div className="bg-slate-700 rounded-full h-2 flex-1 max-w-32">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(tonePreview.score / 10) * 100}%` }}
              />
            </div>
            <span className="text-green-400 text-sm ml-2">{tonePreview.score}/10</span>
          </div>
          <div className="ml-4">
            {tonePreview.score >= 8 && (
              <span className="text-green-400 text-xs px-2 py-1 bg-green-400/20 rounded-full">
                ✨ Excellent Balance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Style recommendations */}
      <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4 mb-6 relative z-10">
        <h4 className="text-blue-400 font-medium mb-2">🎯 Raccomandazioni AI:</h4>
        <div className="space-y-2 text-sm">
          {tone.formal > 80 && (
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">⚠️</span>
              <span className="text-white/70">Troppo formale potrebbe sembrare freddo. Considera di aggiungere più empatia.</span>
            </div>
          )}
          {tone.empathy > 80 && tone.formal < 30 && (
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">⚠️</span>
              <span className="text-white/70">Troppo casual per contesti business. Bilancia con più professionalità.</span>
            </div>
          )}
          {tone.formal >= 40 && tone.formal <= 70 && tone.empathy >= 40 && tone.empathy <= 70 && (
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✅</span>
              <span className="text-white/70">Perfetto! Bilanciamento ideale tra professionalità ed empatia.</span>
            </div>
          )}
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-end relative z-10">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300"
        >
          Continua Step 5 →
        </Button>
      </div>
    </div>
  );
};

export default StyleConstraintsStep;
