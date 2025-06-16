
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, TrendingUp, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

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
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Settings className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Definizione Stile e Vincoli
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Definisci il tono di comunicazione per adattare lo stile alle aspettative dei tuoi clienti.
          </p>
          
          <div className="bg-orange-900/15 border border-orange-700/30 rounded-lg p-4 element-spacing">
            <div className="flex items-center space-x-2 sub-element-spacing">
              <AlertTriangle className="w-4 h-4 text-orange-300" />
              <span className="text-orange-300 text-sm font-medium">Importanza del Tono:</span>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed">
              Il tono influenza direttamente la percezione del brand e la soddisfazione del cliente. 
              Un equilibrio tra professionalità ed empatia ottimizza i risultati.
            </div>
          </div>
        </div>
        
        {/* Tone sliders */}
        <div className="section-spacing">
          <label className="text-slate-200 font-medium element-spacing block">🎭 Tono di comunicazione:</label>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Formale</span>
                  <span className="text-slate-300 font-medium">{tone.formal}%</span>
                  <span className="text-slate-400 text-sm">Casual</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tone.formal}
                  onChange={(e) => handleToneChange('formal', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Diretto</span>
                  <span className="text-slate-300 font-medium">{tone.empathy}%</span>
                  <span className="text-slate-400 text-sm">Empatico</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tone.empathy}
                  onChange={(e) => handleToneChange('empathy', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 section-spacing">
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
            <label className="text-slate-300 text-sm mb-2 block">📏 Lunghezza risposta:</label>
            <select className="w-full bg-slate-700/60 border border-slate-600/50 rounded text-slate-200 p-2">
              <option>Concisa (50-100 parole)</option>
              <option>Standard (100-200 parole)</option>
              <option>Dettagliata (200-300 parole)</option>
            </select>
          </div>
          
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/40">
            <label className="text-slate-300 text-sm mb-2 block">🌍 Lingua e localizzazione:</label>
            <select className="w-full bg-slate-700/60 border border-slate-600/50 rounded text-slate-200 p-2">
              <option>Italiano (Italia)</option>
              <option>Italiano (Svizzera)</option>
              <option>Inglese (UK)</option>
              <option>Inglese (US)</option>
            </select>
          </div>
        </div>
        
        {/* Tone preview */}
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
          <h4 className="text-slate-200 font-medium sub-element-spacing flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Anteprima Tono:</span>
          </h4>
          <p className="text-slate-300 text-sm italic leading-relaxed element-spacing">
            "{tonePreview.text}"
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <span className="text-slate-400 text-xs mr-2">Punteggio Tono:</span>
              <div className="bg-slate-700 rounded-full h-2 flex-1 max-w-32">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(tonePreview.score / 10) * 100}%` }}
                />
              </div>
              <span className="text-emerald-400 text-sm ml-2">{tonePreview.score}/10</span>
            </div>
            <div className="ml-4">
              {tonePreview.score >= 8 && (
                <span className="text-emerald-400 text-xs px-2 py-1 bg-emerald-400/20 rounded-full">
                  ✨ Equilibrio Eccellente
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Style recommendations */}
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 section-spacing">
          <h4 className="text-slate-200 font-medium sub-element-spacing">🎯 Raccomandazioni AI:</h4>
          <div className="space-y-2 text-sm">
            {tone.formal > 80 && (
              <div className="flex items-start">
                <span className="text-orange-400 mr-2">⚠️</span>
                <span className="text-slate-300">Troppo formale potrebbe sembrare freddo. Considera di aggiungere più empatia.</span>
              </div>
            )}
            {tone.empathy > 80 && tone.formal < 30 && (
              <div className="flex items-start">
                <span className="text-orange-400 mr-2">⚠️</span>
                <span className="text-slate-300">Troppo casual per contesti business. Bilancia con più professionalità.</span>
              </div>
            )}
            {tone.formal >= 40 && tone.formal <= 70 && tone.empathy >= 40 && tone.empathy <= 70 && (
              <div className="flex items-start">
                <span className="text-emerald-400 mr-2">✅</span>
                <span className="text-slate-300">Perfetto! Bilanciamento ideale tra professionalità ed empatia.</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
          >
            <span>Procedi al Formato Output</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <style>
        {`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #64748b;
          border: 2px solid #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #94a3b8;
          border-color: #64748b;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #64748b;
          border: 2px solid #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        `}
      </style>
    </div>
  );
};

export default StyleConstraintsStep;
