
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, X, ArrowRight, Lightbulb, CheckCircle } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const OutputFormatStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [newFormat, setNewFormat] = useState('');
  const [microprompt, setMicroprompt] = useState(promptData.microprompt7 || '');

  const predefinedFormats = [
    'Email professionale con oggetto',
    'Lista puntata con priorità',
    'Template risposta strutturata',
    'Paragrafo introduttivo + soluzioni + conclusione',
    'FAQ format con domande e risposte',
    'Step-by-step action plan'
  ];

  const addFormat = () => {
    if (newFormat.trim()) {
      const updatedFormats = [...(promptData.outputFormat || []), newFormat.trim()];
      updatePromptData('outputFormat', updatedFormats);
      setNewFormat('');
    }
  };

  const addPredefinedFormat = (format: string) => {
    if (!promptData.outputFormat?.includes(format)) {
      const updatedFormats = [...(promptData.outputFormat || []), format];
      updatePromptData('outputFormat', updatedFormats);
    }
  };

  const removeFormat = (index: number) => {
    const updatedFormats = promptData.outputFormat.filter((_: any, i: number) => i !== index);
    updatePromptData('outputFormat', updatedFormats);
  };

  const handleMicropromptChange = (text: string) => {
    setMicroprompt(text);
    updatePromptData('microprompt7', text);
  };

  const canProceed = promptData.outputFormat?.length >= 1 && microprompt.trim().length > 0;

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <FileText className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Formato Output
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Il formato output definisce esattamente come deve essere strutturata la risposta dell'AI. 
            Questo garantisce consistenza e professionalità in tutte le comunicazioni.
          </p>
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-lg p-3 element-spacing">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">Esempio Formato Strutturato:</span>
              </div>
              <div className="text-slate-300 text-sm font-mono bg-slate-800/40 p-3 rounded border border-slate-700/30">
                <div>OGGETTO: [Riassunto problema + soluzione]</div>
                <div className="mt-2">Gentile [Nome Cliente],</div>
                <div className="mt-1">1. RICONOSCIMENTO: [Comprensione del problema]</div>
                <div>2. SOLUZIONE: [Azione concreta]</div>
                <div>3. NEXT STEPS: [Cosa succede ora]</div>
                <div className="mt-2">Cordiali saluti,<br/>[Nome + Ruolo]</div>
              </div>
            </div>

            <div className="bg-blue-900/15 border border-blue-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 sub-element-spacing">
                <Lightbulb className="w-4 h-4 text-blue-300" />
                <span className="text-blue-300 text-sm font-medium">Vantaggi del Formato Strutturato:</span>
              </div>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Consistenza tra diverse risposte</li>
                <li>• Facilità di lettura per il cliente</li>
                <li>• Processo scalabile per il team</li>
                <li>• Riduzione errori e omissioni</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium sub-element-spacing">Formati Predefiniti:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 element-spacing">
            {predefinedFormats.map((format, index) => (
              <button
                key={index}
                onClick={() => addPredefinedFormat(format)}
                disabled={promptData.outputFormat?.includes(format)}
                className={`text-left p-3 rounded-lg border text-sm transition-all duration-200 ${
                  promptData.outputFormat?.includes(format)
                    ? 'bg-slate-700/40 border-slate-600/30 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-700/60 hover:border-slate-600/50'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium sub-element-spacing">I Tuoi Formati Personalizzati:</h3>
          
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="flex space-x-2 sub-element-spacing">
              <input
                type="text"
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value)}
                placeholder="Esempio: Email con sezioni: Problema → Soluzione → Follow-up"
                className="flex-1 bg-slate-700/60 border border-slate-600/50 rounded px-3 py-2 text-slate-200 placeholder-slate-400 text-sm focus:border-slate-500 focus:outline-none"
              />
              <Button
                onClick={addFormat}
                disabled={!newFormat.trim()}
                size="sm"
                className="bg-slate-600 hover:bg-slate-500 text-slate-200 px-4"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {promptData.outputFormat?.length > 0 && (
              <div className="space-y-2">
                {promptData.outputFormat.map((format: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/40 border border-slate-600/30 rounded px-3 py-2">
                    <span className="text-slate-200 text-sm flex-1">{format}</span>
                    <button
                      onClick={() => removeFormat(index)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(!promptData.outputFormat || promptData.outputFormat.length === 0) && (
              <div className="flex items-center space-x-2 text-orange-400 text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Aggiungi almeno un formato output per procedere</span>
              </div>
            )}
          </div>
        </div>

        {promptData.outputFormat?.length >= 1 && (
          <MicropromptWriter
            title="Pratica: Definisci il Formato della Risposta"
            instruction="Scrivi il template esatto che l'AI deve seguire per strutturare la risposta. Sii molto specifico sulla struttura."
            placeholder="OUTPUT FORMAT:&#10;OGGETTO: [Riassunto + soluzione]&#10;&#10;Gentile [Nome],&#10;&#10;1. COMPRENSIONE: [Riassumi il problema]&#10;2. SOLUZIONE: [Azione specifica]&#10;3. TIMELINE: [Quando + come]&#10;4. CONTATTI: [Info per follow-up]&#10;&#10;Cordiali saluti,&#10;[Nome] - [Ruolo]"
            example="OUTPUT FORMAT:&#10;OGGETTO: Risoluzione [tipo problema] - Ordine #[numero]&#10;&#10;Gentile [Nome Cliente],&#10;&#10;COMPRENSIONE DEL PROBLEMA:&#10;[Riassumi in 1-2 frasi il problema del cliente]&#10;&#10;SOLUZIONE PROPOSTA:&#10;[Azione specifica che stiamo prendendo]&#10;&#10;PROSSIMI PASSI:&#10;- [Cosa faremo noi]&#10;- [Cosa deve fare il cliente se necessario]&#10;- [Timeline prevista]&#10;&#10;Per ulteriori informazioni: [contatti]&#10;&#10;Cordiali saluti,&#10;[Nome] - Team Customer Service"
            context="format"
            onTextChange={handleMicropromptChange}
            value={microprompt}
          />
        )}

        {canProceed && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
            >
              <span>Procedi alla Scrittura Libera</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputFormatStep;
