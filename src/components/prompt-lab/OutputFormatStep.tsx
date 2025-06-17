
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Mail, List, MessageSquare } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const OutputFormatStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(promptData.outputFormat || []);
  const [microprompt, setMicroprompt] = useState(promptData.microprompt7 || '');
  const [exerciseQuality, setExerciseQuality] = useState(0);
  const [canProceedExercise, setCanProceedExercise] = useState(false);

  const availableFormats = [
    {
      id: 'email-response',
      label: 'Risposta Email Strutturata',
      description: 'Oggetto + Saluto + Corpo + Chiusura + Firma',
      icon: Mail,
      template: 'OGGETTO: [Oggetto chiaro e specifico]\n\nCaro/a [Nome],\n\n[Corpo della risposta]\n\nCordiali saluti,\n[Nome e ruolo]'
    },
    {
      id: 'bullet-summary',
      label: 'Riassunto a Punti',
      description: 'Lista organizzata per punti principali',
      icon: List,
      template: 'RIASSUNTO:\n• Punto principale 1\n• Punto principale 2\n• Azione richiesta'
    },
    {
      id: 'structured-analysis',
      label: 'Analisi Strutturata',
      description: 'Sezioni: Problema + Soluzione + Next Steps',
      icon: MessageSquare,
      template: 'ANALISI:\n\nProblema identificato:\n[Descrizione]\n\nSoluzione proposta:\n[Dettagli]\n\nNext steps:\n[Azioni concrete]'
    }
  ];

  const handleFormatToggle = (formatId: string) => {
    const newFormats = selectedFormats.includes(formatId)
      ? selectedFormats.filter(id => id !== formatId)
      : [...selectedFormats, formatId];
    
    setSelectedFormats(newFormats);
    updatePromptData('outputFormat', newFormats);
  };

  const handleMicropromptChange = (text: string) => {
    setMicroprompt(text);
    updatePromptData('microprompt7', text);
  };

  const handleExerciseQuality = (score: number, canProceed: boolean) => {
    setExerciseQuality(score);
    setCanProceedExercise(canProceed);
  };

  const canProceed = selectedFormats.length > 0 && canProceedExercise;

  return (
    <div className="step-card glassmorphism-base">
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <FileText className="w-6 h-6 text-slate-300" />
        <h2 className="text-xl font-medium text-slate-200">
          Formato e Struttura Output
        </h2>
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="section-spacing">
          <p className="text-slate-300 leading-relaxed element-spacing">
            Il formato definisce come strutturare la risposta dell'AI. Una struttura chiara 
            garantisce output consistenti e professionali, facilitando l'utilizzo pratico.
          </p>
          
          <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 element-spacing">
            <h4 className="text-blue-300 font-medium sub-element-spacing">
              💡 Perché i Formati Predefiniti sono Utili:
            </h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• <strong>Consistenza:</strong> Stesso formato ogni volta</li>
              <li>• <strong>Leggibilità:</strong> Informazioni organizzate chiaramente</li>
              <li>• <strong>Professionalità:</strong> Output sempre ben strutturato</li>
              <li>• <strong>Efficienza:</strong> Facile da processare e utilizzare</li>
            </ul>
          </div>
        </div>

        <div className="section-spacing">
          <h3 className="text-slate-200 font-medium sub-element-spacing">
            Scegli il Formato per il Tuo Scenario:
          </h3>
          
          <div className="space-y-3 element-spacing">
            {availableFormats.map((format) => {
              const Icon = format.icon;
              const isSelected = selectedFormats.includes(format.id);
              
              return (
                <label
                  key={format.id}
                  className={`flex items-start bg-slate-800/40 rounded-lg p-4 border cursor-pointer transition-all duration-200 group ${
                    isSelected 
                      ? 'border-emerald-500/50 bg-emerald-900/20' 
                      : 'border-slate-600/30 hover:bg-slate-700/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-3 mt-1 accent-emerald-500"
                    checked={isSelected}
                    onChange={() => handleFormatToggle(format.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 sub-element-spacing">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-200 font-medium">{format.label}</span>
                    </div>
                    <p className="text-slate-400 text-sm sub-element-spacing">{format.description}</p>
                    <div className="bg-slate-900/40 rounded p-2 text-xs text-slate-300 font-mono whitespace-pre-wrap">
                      {format.template}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {selectedFormats.length > 0 && (
          <MicropromptWriter
            title="Pratica: Definisci la Struttura Output"
            instruction="Descrivi come vuoi che sia strutturata la risposta dell'AI. Specifica sezioni, ordine e elementi obbligatori."
            placeholder="FORMATO OUTPUT:&#10;&#10;Struttura email di risposta:&#10;1. OGGETTO: Riassunto chiaro in 5-8 parole&#10;2. SALUTO: Personalizzato con nome cliente&#10;3. RICONOSCIMENTO: Conferma di aver compreso la richiesta&#10;4. SOLUZIONE: Azione concreta con timeline&#10;5. CHIUSURA: Invito a contatti futuri + firma aziendale"
            example="FORMATO OUTPUT:&#10;&#10;Struttura email di risposta customer service:&#10;&#10;OGGETTO: [Tipo richiesta] - Risoluzione entro [timeframe]&#10;&#10;CORPO EMAIL:&#10;1. Saluto personalizzato con nome cliente&#10;2. Ringraziamento per il contatto&#10;3. Riassunto della richiesta per conferma comprensione&#10;4. Soluzione specifica con passi actionable&#10;5. Timeline di risoluzione realistica&#10;6. Invito a ricontattare se necessario&#10;7. Firma completa con contatti diretti"
            context="format"
            onTextChange={handleMicropromptChange}
            value={microprompt}
            onQualityChange={handleExerciseQuality}
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
