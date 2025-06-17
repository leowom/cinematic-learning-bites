
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, ArrowRight, Palette, MessageSquare, Clock } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const StyleConstraintsStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [microprompt, setMicroprompt] = useState(promptData.microprompt6 || '');
  const [exerciseQuality, setExerciseQuality] = useState(0);
  const [canProceedExercise, setCanProceedExercise] = useState(false);

  const handleToneChange = (type: 'formal' | 'empathy', value: number) => {
    updatePromptData('tone', {
      ...promptData.tone,
      [type]: value
    });
  };

  const handleMicropromptChange = (text: string) => {
    setMicroprompt(text);
    updatePromptData('microprompt6', text);
  };

  const handleExerciseQuality = (score: number, canProceed: boolean) => {
    setExerciseQuality(score);
    setCanProceedExercise(canProceed);
  };

  const canProceed = canProceedExercise;

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <Settings className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Stile e Vincoli Comunicativi
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            I vincoli definiscono come l'AI deve comunicare. Includono tone, stile, lunghezza, 
            limitazioni e requisiti specifici per mantenere coerenza e professionalità.
          </p>
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 sub-element-spacing">
                  <Palette className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-300 text-sm font-medium">Tone & Style</span>
                </div>
                <ul className="text-slate-300 text-xs space-y-1">
                  <li>• Professionale vs Casual</li>
                  <li>• Empatico vs Diretto</li>
                  <li>• Formale vs Conversazionale</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 sub-element-spacing">
                  <MessageSquare className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 text-sm font-medium">Limitazioni</span>
                </div>
                <ul className="text-slate-300 text-xs space-y-1">
                  <li>• Lunghezza massima</li>
                  <li>• Evitare termini specifici</li>
                  <li>• Non rivelare informazioni</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 sub-element-spacing">
                  <Clock className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium">Requisiti</span>
                </div>
                <ul className="text-slate-300 text-xs space-y-1">
                  <li>• Call to action chiare</li>
                  <li>• Menzione policy aziendali</li>
                  <li>• Firma specifica</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium sub-element-spacing">Configurazione Tone:</h3>
          
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between sub-element-spacing">
                <label className="text-slate-300 text-sm">Livello di Formalità</label>
                <span className="text-slate-400 text-xs">
                  {promptData.tone?.formal > 70 ? 'Molto Formale' : 
                   promptData.tone?.formal > 40 ? 'Bilanciato' : 'Casual'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={promptData.tone?.formal || 60}
                onChange={(e) => handleToneChange('formal', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Casual</span>
                <span>Formale</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between sub-element-spacing">
                <label className="text-slate-300 text-sm">Livello di Empatia</label>
                <span className="text-slate-400 text-xs">
                  {promptData.tone?.empathy > 70 ? 'Molto Empatico' : 
                   promptData.tone?.empathy > 40 ? 'Bilanciato' : 'Diretto'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={promptData.tone?.empathy || 40}
                onChange={(e) => handleToneChange('empathy', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Diretto</span>
                <span>Empatico</span>
              </div>
            </div>
          </div>
        </div>

        <MicropromptWriter
          title="Pratica: Definisci Stile e Vincoli"
          instruction="Scrivi i vincoli specifici per il tuo scenario: tone, limitazioni, requisiti aziendali e stile comunicativo."
          placeholder="VINCOLI:&#10;- Tone: Professionale ed empatico&#10;- Lunghezza: Massimo 200 parole&#10;- Evita: Promesse che non possiamo mantenere&#10;- Includi sempre: Policy di rimborso e numero di riferimento&#10;- Chiudi con: Invito a contattare per ulteriori informazioni"
          example="VINCOLI:&#10;- Tone: Professionale ma caloroso, riconoscendo la frustrazione del cliente&#10;- Lunghezza: 150-200 parole massimo&#10;- Evitare: Promesse di tempistiche che non possiamo garantire&#10;- Includere sempre: Riferimento al numero ordine e policy aziendale&#10;- Struttura: Scuse → Soluzione → Azione → Chiusura positiva"
          context="tone"
          onTextChange={handleMicropromptChange}
          value={microprompt}
          onQualityChange={handleExerciseQuality}
        />

        {canProceed && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
            >
              <span>Procedi al Formato Output</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleConstraintsStep;
