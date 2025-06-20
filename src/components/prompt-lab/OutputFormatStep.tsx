
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Layout, List, Grid } from 'lucide-react';
import MicropromptWriter from './MicropromptWriter';

interface Props {
  promptData: any;
  updatePromptData: (field: string, value: any) => void;
  onComplete: () => void;
}

const OutputFormatStep: React.FC<Props> = ({ promptData, updatePromptData, onComplete }) => {
  const [microprompt, setMicroprompt] = useState(promptData.userWrittenFormat || '');
  const [exerciseQuality, setExerciseQuality] = useState(0);
  const [canProceedExercise, setCanProceedExercise] = useState(false);

  console.log('🔍 OutputFormatStep DEBUG:', {
    microprompt: microprompt.length > 0 ? `${microprompt.substring(0, 50)}...` : 'empty',
    exerciseQuality,
    canProceedExercise,
    promptDataFormat: promptData.userWrittenFormat
  });

  const handleFormatChange = (format: string, checked: boolean) => {
    const currentFormats = promptData.outputFormat || [];
    const newFormats = checked 
      ? [...currentFormats, format]
      : currentFormats.filter((f: string) => f !== format);
    
    updatePromptData('outputFormat', newFormats);
  };

  const handleMicropromptChange = (text: string) => {
    console.log('🔍 handleMicropromptChange:', { text: text.substring(0, 50) + '...' });
    setMicroprompt(text);
    updatePromptData('userWrittenFormat', text);
  };

  const handleExerciseQuality = (score: number, canProceed: boolean) => {
    console.log('🔍 handleExerciseQuality called:', { score, canProceed });
    setExerciseQuality(score);
    setCanProceedExercise(canProceed);
  };

  const formatOptions = [
    { id: 'structured', label: 'Risposta Strutturata', icon: Layout, desc: 'Con sezioni chiare e intestazioni' },
    { id: 'bullet', label: 'Elenco Puntato', icon: List, desc: 'Lista di punti e azioni' },
    { id: 'table', label: 'Formato Tabellare', icon: Grid, desc: 'Dati organizzati in tabelle' },
    { id: 'paragraph', label: 'Paragrafi Fluidi', icon: FileText, desc: 'Testo scorrevole e naturale' }
  ];

  const canProceed = canProceedExercise;

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
            Il formato definisce come l'AI deve strutturare le sue risposte. Una formattazione chiara 
            migliora la leggibilità e l'usabilità delle risposte per i clienti e i colleghi.
          </p>
          
          <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-4 element-spacing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = promptData.outputFormat?.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500/50 bg-blue-900/20' 
                        : 'border-slate-700/40 bg-slate-800/20 hover:border-slate-600/60'
                    }`}
                    onClick={() => handleFormatChange(option.id, !isSelected)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {option.desc}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-slate-600'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Esempio di formato */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-3 flex items-center">
            <Layout className="w-4 h-4 mr-2" />
            💡 Esempio Formato Strutturato:
          </h4>
          <div className="bg-slate-800/40 rounded-lg p-3 text-sm">
            <div className="text-slate-200 space-y-2">
              <div className="font-medium text-emerald-300">**ANALISI RICHIESTA:**</div>
              <div className="text-slate-300 ml-2">• Sentiment: Negativo (2/5)</div>
              <div className="text-slate-300 ml-2">• Categoria: Reclamo spedizione</div>
              
              <div className="font-medium text-emerald-300 mt-3">**SOLUZIONE PROPOSTA:**</div>
              <div className="text-slate-300 ml-2">• Verifica tracking immediata</div>
              <div className="text-slate-300 ml-2">• Rimborso spese spedizione</div>
              
              <div className="font-medium text-emerald-300 mt-3">**PROSSIMI PASSI:**</div>
              <div className="text-slate-300 ml-2">• Contatto corriere entro 24h</div>
              <div className="text-slate-300 ml-2">• Aggiornamento via email</div>
            </div>
          </div>
        </div>

        {/* Esercizio Pratico con MicropromptWriter */}
        <div className="section-spacing">
          <MicropromptWriter
            title="Esercizio Pratico: Definisci il Formato Output"
            instruction="Scrivi le specifiche per il formato delle risposte. Riceverai feedback dall'AI Coach per migliorare la struttura."
            placeholder="FORMATO OUTPUT:&#10;&#10;**ANALISI RICHIESTA:**&#10;• Sentiment: [positivo/neutro/negativo] (scala 1-5)&#10;• Categoria: [tipo richiesta]&#10;• Priorità: [bassa/media/alta]&#10;&#10;**SOLUZIONE PROPOSTA:**&#10;• [azione principale]&#10;• [azioni di supporto]&#10;&#10;**TIMELINE:**&#10;• [tempi realistici]&#10;&#10;**RIFERIMENTI:**&#10;• Numero caso: [auto-generato]&#10;• Policy applicabile: [riferimento]"
            example="FORMATO OUTPUT:&#10;&#10;**ANALISI RICHIESTA:**&#10;• Sentiment: [positivo/neutro/negativo] (scala 1-5)&#10;• Categoria: [reclamo/informazione/supporto tecnico/rimborso/altro]&#10;• Priorità: [bassa/media/alta] basata su valore cliente e urgenza&#10;• Confidence score: [percentuale accuratezza classificazione]&#10;&#10;**RISPOSTA CLIENTE:**&#10;• Saluto personalizzato con nome cliente&#10;• Riconoscimento del problema specifico&#10;• Soluzione concreta con passi chiari&#10;• Timeline realistica (24-48 ore lavorative)&#10;• Riferimento policy aziendale se applicabile&#10;&#10;**AZIONI INTERNE:**&#10;• [azioni immediate da intraprendere]&#10;• [follow-up necessari]&#10;• [escalation se richiesta]&#10;&#10;**RIFERIMENTI:**&#10;• Numero caso: [auto-generato]&#10;• Policy applicabile: [collegamento diretto]&#10;• Prossimo contatto: [data/ora]"
            context="format"
            onTextChange={handleMicropromptChange}
            value={microprompt}
            onQualityChange={handleExerciseQuality}
            updatePromptData={updatePromptData}
          />
        </div>

        {canProceed && (
          <div className="flex justify-end">
            <Button
              onClick={onComplete}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-slate-600 flex items-center space-x-2"
            >
              <span>Procedi alla Scrittura Pratica</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputFormatStep;
